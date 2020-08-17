<script lang='ts'>
    import { 
        zoom, 
        paths, 
        toolMode, 
        brushType, 
        brushSize, 
        canvasPosition,
        isTouching,
        cursor,
        canvasStyle,
        imageStyle,
    } from '../state'
    import type { Path, GestureEvent, Point } from '@lib/types'
    import { getColor, undo, setMode } from '../utils'
    import { onMount } from 'svelte'
    import GestureEmitter from './GestureEmitter.svelte'
    import AutoLineTool from './AutoLineTool.svelte'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'
    import { drawPaths } from './canvas-helpers'
    
    export let imageData: string // base64
    
    let canvas: HTMLCanvasElement
    let image: HTMLImageElement    
    let ctx: CanvasRenderingContext2D
    
    $: ctx && drawPaths(canvas, ctx, $paths)
    $: image && (image.src = imageData)

    onMount(() => {        
        image.width = canvas.width = IMAGE_WIDTH
        image.height = canvas.height = IMAGE_HEIGHT
        ctx = canvas.getContext('2d')
    
        drawPaths(canvas, ctx, $paths)
    })

    // TODO Maybe move this stuff to brush tool component? 
    const startNewPath = ({ x, y }: Point) => {
        console.debug('Start new path')

        const path: Path = {
            type: $brushType,
            size: $brushSize,
            points: [{ x, y }],
        }

        $paths = [...$paths, path]
    }

    const addPointToLastPath = ({ x, y }: Point) => {
        $paths[$paths.length - 1].points.push({ x, y })
        
        ctx.lineTo(x, y)
        ctx.lineWidth = $brushSize
        ctx.stroke()
    }    

    const onDrawStart = () => {
        startNewPath($cursor)
    }

    const onDrawMove = () => {
        if ($paths.length > 0) {
            addPointToLastPath($cursor)
        }
    }

    const onDrawEnd = () => {
        // Remove paths with 1 point
        $paths = $paths.filter(({ points }) => points.length > 1)
    }
</script>

<div class='background'></div>
<div class='outer'>
    <img 
        bind:this={image}            
        style={$imageStyle}
        alt='Source'
    >
    <canvas 
        style={$canvasStyle}
        bind:this={canvas} 
    />    
    {#if image}
        <AutoLineTool {image} />
    {/if}
</div>

<GestureEmitter 
    {canvas} 
    on:drawstart={onDrawStart}
    on:drawmove={onDrawMove}
    on:drawend={onDrawEnd}
    on:doubletap={undo}
/>

<style>
    .background {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        background: var(--background);
        filter: brightness(225%);
    }
    
    .outer {
        width: 100vw;
        height: 100vh;
        position: relative;
    }
</style>