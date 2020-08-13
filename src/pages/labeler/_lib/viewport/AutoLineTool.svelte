<script lang='ts'>
    import { onMount } from 'svelte'
    import * as jsfeat from 'jsfeat'
    import { isTouching, cursor, paths, toolMode, brushSize } from '../state'
    import type { Point } from '@lib/types'
import { renderImageData, copyImageData } from './canvas-helpers';

    export let image: CanvasImageSource

    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    
    $: $toolMode == 'autoLine' 
        && $isTouching 
        && generateAutoLine()

    onMount(() => {
        ctx = canvas.getContext('2d')
    })

    const generateAutoLine = () => {
        const cannySearchSpace = 250       
        const start = {
            x: Math.floor($cursor.x - (cannySearchSpace / 2)),
            y: Math.floor($cursor.y - (cannySearchSpace / 2))
        }

        const imageData = copyImageData({ ...start, ctx, image, size: cannySearchSpace })         
        const img_u8 = cannyProcessImage(imageData, cannySearchSpace)        
        const points = getCannyPointsAndRender(imageData, img_u8, cannySearchSpace, $cursor)
        const currentPath = $paths.pop()
        
        renderImageData({ ...start, ctx, canvas, imageData })

        currentPath.points = [...currentPath.points, ...points]
        $paths = [...$paths, currentPath]
        // (TODO collapse overlapping points?)
    }
    
    const cannyProcessImage = (imageData: ImageData, size: number): jsfeat.matrix_t => {
        const blurRadius = 1
        const lowThreshold = 20
        const highThreshold = 50
        const r = blurRadius|0
        const kernel_size = (r + 1) << 1
        let img_u8 = new jsfeat.matrix_t(size, size, jsfeat.U8C1_t)
        
        jsfeat.imgproc.grayscale(imageData.data, size, size, img_u8);
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
        size: number, 
        cursor: Point
    ): Point[] => {
        const WHITE = 0
        const ALPHA = (0xff << 24)
        const RENDER_RADIUS = 250
        const withinRenderRadius = withinRadiusHelper(cursor, RENDER_RADIUS)
        const withinSearchRadius = withinRadiusHelper(cursor, $brushSize)
        const data_u32 = new Uint32Array(imageData.data.buffer)
        const result: Point[] = []
        let i = img_u8.cols * img_u8.rows
        let pixel: number 

        while(--i >= 0) {
            const col = Math.floor(i % size)
            const row = (i - col) / size
            const x = (cursor.x) + (col - (size / 2))
            const y = (cursor.y) + (row - (size / 2)) 

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

        return result
    }
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        position: absolute;
    }
</style>