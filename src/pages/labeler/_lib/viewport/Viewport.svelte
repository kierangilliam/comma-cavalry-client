<script lang='ts'>
    import { 
        paths, 
        brushType, 
        brushSize, 
        cursor,
        canvasStyle,
        imageStyle,
        toolMode,
    } from '../state'
    import { onMount } from 'svelte'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'
    import type { Path } from '@lib/types'
    import { undo } from '../utils'
    import GestureHandler from './GestureHandler.svelte'
    import AutoLineTool from './AutoLineTool.svelte'
    import { drawPaths } from './canvas-helpers'
    import Cursor from './Cursor.svelte'
    
    export let imageData: string // base64
    
    let canvas: HTMLCanvasElement
    let image: HTMLImageElement    
    let ctx: CanvasRenderingContext2D
    
    $: ctx && drawPaths({ canvas, ctx, paths: $paths })
    $: image && (image.src = imageData)

    onMount(() => {        
        image.width = canvas.width = IMAGE_WIDTH
        image.height = canvas.height = IMAGE_HEIGHT
        ctx = canvas.getContext('2d')
    
        drawPaths({ canvas, ctx, paths: $paths })
    })

    const startNewPath = () => {
        console.debug('Start new path')

        const path: Path = {
            type: $brushType,
            size: $brushSize,
            mode: $toolMode,
            points: [{ ...$cursor }],
        }

        $paths = [...$paths, path]
    }

    const addPointToLastPath = () => {
        if ($paths.length == 0) {
            return
        }

        const { x, y } = $cursor

        $paths[$paths.length - 1].points.push({ x, y })
        
        ctx.lineTo(x, y)
        ctx.lineWidth = $brushSize
        ctx.stroke()
    } 

    const removeSinglePointPaths = () => {
        $paths = $paths.filter(({ points }) => points.length > 1)
    }
</script>

<div class='background'></div>
<div class='container'>
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

<GestureHandler
    {canvas} 
    on:drawstart={startNewPath}
    on:drawmove={addPointToLastPath}
    on:drawend={removeSinglePointPaths}
    on:doubletap={undo}
/>

<Cursor />

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
    
    .container {
        width: 100vw;
        height: 100vh;
        position: relative;
    }

    img {
        box-shadow: 
            0px 0px 10px rgba(25, 25, 25, 0.5),
            0px 0px 100px rgba(45, 45, 45, .2)
        ;
    }
</style>