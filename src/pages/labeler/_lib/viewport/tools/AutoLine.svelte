<script lang='ts'>
    import { 
        brushType,
        cursor, 
        paths, 
        brushSize, 
        canvasStyle,
        highThreshold,
        lowThreshold,
        blurRadius,
    } from '../../state'
    import { onMount } from 'svelte'
    import * as jsfeat from 'jsfeat'    
    import type { AutoLineRenderer } from '@lib/editor-renderer'
    import type { Point, Cursor } from '@lib/types'
    import { renderImageData, copyImageData } from '@lib/utils'
    import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@lib/constants'
    import { removeSinglePointPaths, listenToEvents, createNewPath } from './common'
    import type { AutoLineEvent } from './common'
    import { getColor } from '../../utils'
    
    export let renderer: AutoLineRenderer 
    export let image: HTMLImageElement
    
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    let imageData: ImageData
    let img_u8: jsfeat.matrix_t
    let debounceTimer: any
    let debounced: boolean = false

    $: img_u8 = cannyProcessImage(
        imageData,
        $blurRadius,
        $lowThreshold,
        $highThreshold,
    )

    onMount(() => {
        ctx = canvas.getContext('2d')
        imageData = copyImageData({ x: 0, y: 0, ctx, image })                 
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    })

    const debounce = () => {
        debounced = true
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => { debounced = false }, 50)
    }   

    const startNewPathFromCursor = () => {
        const path = createNewPath({ x: $cursor.x, y: $cursor.y, renderer }) 
        const color = getColor($brushType)

        renderer.drawPoints({ ...path, color })

        $paths.push(path)
    }

    const autoLineMove = () => {
        if (debounced) return

        debounce()

        const points = getCannyPointsAndRender(
            imageData, 
            img_u8, 
            image.width as number, 
            image.height as number, 
            $cursor
        )

        const currentPath = $paths.pop()

        renderImageData({ x: 0, y: 0, ctx, canvas, imageData })
        
        currentPath.points = [...currentPath.points, ...points]
        $paths = [...$paths, currentPath]
    }

    const autoLineEnd = () => {
        removeSinglePointPaths()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    
    const cannyProcessImage = (
        imageData: ImageData,
        blurRadius: number,
        lowThreshold: number, 
        highThreshold: number, 
    ): jsfeat.matrix_t => {
        if (!imageData) {
            return
        }

        const r = blurRadius|0
        const kernel_size = (r + 1) << 1
        let img_u8 = new jsfeat.matrix_t(imageData.width, imageData.height, jsfeat.U8C1_t)

        jsfeat.imgproc.grayscale(imageData.data, imageData.width, imageData.height, img_u8);
        jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
        jsfeat.imgproc.canny(img_u8, img_u8, lowThreshold|0, highThreshold|0);

        return img_u8
    }

    const withinRadiusHelper = (cursor: Cursor, radius: number) => 
        (x: number, y: number) => {
            const dist = Math.hypot(x - cursor.x, y - cursor.y)
            return dist < radius
        }

    const getCannyPointsAndRender = (
        imageData: ImageData, 
        img_u8: jsfeat.matrix_t, 
        width: number, 
        height: number, 
        cursor: Cursor,
    ): Point[] => {
        const WHITE = 255
        const ALPHA = (0xff << 24)
        const RENDER_RADIUS = 50
        const withinRenderRadius = withinRadiusHelper(cursor, RENDER_RADIUS)
        const withinSearchRadius = withinRadiusHelper(cursor, $brushSize)
        const data_u32 = new Uint32Array(imageData.data.buffer)
        const result: Point[] = []
        let pixel: number
        let i = Math.round(cursor.x + (width * (cursor.y + RENDER_RADIUS)))
        const iMin = Math.round(width * (cursor.y - RENDER_RADIUS))

        // Make transparent
        data_u32.fill(0x000000, 0, width * height)

        while(--i >= iMin) {
            const y = (i - (i % width)) / width
            const x = (i % width)

            if (!withinRenderRadius(x, y)) {
                continue
            }

            // Make pixel white for lines or black otherwise
            pixel = img_u8.data[i]
            data_u32[i] = ALPHA | (pixel << 16) | (pixel << 8) | pixel

            // Get canny point, make data within brush size red
            if (img_u8.data[i] == WHITE && withinSearchRadius(x, y)) {                
                result.push({ x, y })
                data_u32[i] = ALPHA | 0x0000ff
            }
        }

        return result.length > $brushSize
            ? result
            : []
    }

    listenToEvents<AutoLineEvent>('autoLine', {
        autoLineStart: startNewPathFromCursor,
        autoLineMove,
        autoLineEnd,
    })
</script>

<canvas 
    style={$canvasStyle + 'opacity: 1;'}
    bind:this={canvas} 
    width={IMAGE_WIDTH}
    height={IMAGE_HEIGHT}
/>