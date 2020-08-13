<script lang='ts'>
    import { onMount } from 'svelte'
    import * as jsfeat from 'jsfeat'
    import { isTouching, cursor, paths, toolMode, brushSize, canvasStyle } from '../state'
    import type { Point } from '@lib/types'
    import { renderImageData, copyImageData } from './canvas-helpers'

    export let image: CanvasImageSource
    export let canvas: HTMLCanvasElement

    let ctx: CanvasRenderingContext2D
    let imageData
    let img_u8

    let timer, debounced = false

    const debounce = () => {
        debounced = true
        console.log('set debounce')
        clearTimeout(timer)
        timer = setTimeout(() => {
            debounced = false
            console.log('debounce over')
        }, 5000)
    }
    
    $: $toolMode == 'autoLine' 
        && !debounced
        && img_u8
        && $isTouching 
        && $cursor
        && generateAutoLine()

    onMount(() => {
        ctx = canvas.getContext('2d')
        imageData = copyImageData({ x: 0, y: 0, ctx, image })         
        img_u8 = cannyProcessImage(imageData)     
    })

    // TODO: Probably should've just gone with tensorflow
    const generateAutoLine = () => {
        debounce()

        console.count('here')

        const points = getCannyPointsAndRender(
            imageData, 
            img_u8, 
            image.width as number, 
            image.height as number, 
            $cursor
        )

        const currentPath = $paths.pop()

        console.log('currentPath', currentPath.points.length)
        
        renderImageData({ x: 0, y: 0, ctx, canvas, imageData })
        
        currentPath.points = [...currentPath.points, ...points]
        console.log('currentPath2', currentPath.points.length)
        $paths = [...$paths, currentPath]
        // (TODO collapse overlapping points?)
    }
    
    const cannyProcessImage = (imageData: ImageData): jsfeat.matrix_t => {
        const blurRadius = 1
        const lowThreshold = 20
        const highThreshold = 50
        const r = blurRadius|0
        const kernel_size = (r + 1) << 1
        let img_u8 = new jsfeat.matrix_t(imageData.width, imageData.height, jsfeat.U8C1_t)

        jsfeat.imgproc.grayscale(imageData.data, imageData.width, imageData.height, img_u8);
        jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
        jsfeat.imgproc.canny(img_u8, img_u8, lowThreshold|0, highThreshold|0);

        return img_u8
    }

    const withinRadiusHelper = (cursor: Point, radius: number) => 
        (x: number, y: number) => {
            const dist = Math.hypot(x - cursor.x, y - cursor.y)
            return dist < radius
        }

    const getCannyPointsAndRender = (
        imageData: ImageData, 
        img_u8: jsfeat.matrix_t, 
        width: number, 
        height: number, 
        cursor: Point
    ): Point[] => {
        const WHITE = 0
        const ALPHA = (0xff << 24)
        const RENDER_RADIUS = 50
        const withinRenderRadius = withinRadiusHelper(cursor, RENDER_RADIUS)
        const withinSearchRadius = withinRadiusHelper(cursor, $brushSize)
        const data_u32 = new Uint32Array(imageData.data.buffer)
        const result: Point[] = []
        let pixel: number 
        
        // Only search within this space
        const minY = Math.floor(width * Math.max((cursor.y - (RENDER_RADIUS / 2)), 0))
        const maxY = Math.floor(width * Math.min((cursor.y + (RENDER_RADIUS / 2)), height))
        const minX = Math.floor(width - cursor.x - (RENDER_RADIUS / 2))
        const maxX = Math.floor(width - cursor.x + (RENDER_RADIUS / 2))
        let i = maxY + minX

        while(--i >= minY) {
            if (i % width < minX || i % width > maxX) {
                continue
            }

            const col = Math.floor(i % width)
            const row = (i - col) / height
            const x = (cursor.x) + (col - (width / 2))
            const y = (cursor.y) + (row - (height / 2)) 

            console.count('here')

            if (!withinRenderRadius(x, y)) {
                continue
            }

            // Make pixel white for lines or black otherwise
            pixel = img_u8.data[i]
            data_u32[i] = ALPHA | (pixel << 16) | (pixel << 8) | pixel

            // Get canny point
            if (img_u8.data[i] == WHITE && withinSearchRadius(x, y)) {                
                result.push({ x, y })
            }
        }

        console.log('x, y')
        console.log(cursor.x, cursor.y)
        console.log('minX, maxX')
        console.log(minX, maxX)
        console.log('minY, maxY')
        console.log(minY, maxY)

        return result
    }
</script>

<!-- <canvas 
    bind:this={canvas}
    style={$canvasStyle}
></canvas> -->

<style>
    canvas {
        position: absolute;
    }
</style>