<script lang='ts'>
    import { 
        paths, 
        brushType, 
        brushSize, 
        cursor,
        canvasStyle,
        imageStyle,
        toolMode,
        resetState,
    } from '../state'
    import { onMount } from 'svelte'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'
    import type { Path } from '@lib/types'
    import { undo, getColor } from '../utils'
    import GestureHandler from './GestureHandler.svelte'
    import AutoLineTool from './AutoLineTool.svelte'
    import { drawPaths, drawPoints, floodFill } from './canvas-helpers'
    import Cursor from './Cursor.svelte'    
    
    export let imageData: string // base64
    
    let canvas: HTMLCanvasElement
    let image: HTMLImageElement    
    let ctx: CanvasRenderingContext2D
    
    $: image && (image.src = imageData)

    onMount(() => {        
        image.width = canvas.width = IMAGE_WIDTH
        image.height = canvas.height = IMAGE_HEIGHT
        ctx = canvas.getContext('2d')

        paths.subscribe(paths => 
            drawPaths({ ctx, paths })
        )
    })

    const fill = ({ detail: { x, y } }) => {
        const path = createNewPath(x, y)
        const color = getColor($brushType)

        floodFill({ ctx, color, x, y })
        $paths.push(path)
    }   

    const startNewPathFromCursor = () => {
        const path = createNewPath($cursor.x, $cursor.y)
        const color = getColor($brushType)

        drawPoints({ ctx, points: path.points, color, size: path.size })
        $paths.push(path)
    }

    const createNewPath = (x: number, y: number): Path => {
        if ($toolMode === 'move') {
            throw Error('Cannot create a new path with mode "move"')
        }

        ctx.beginPath()
        ctx.moveTo(x, y)

        return {
            type: $brushType,
            size: $brushSize,
            // @ts-ignore
            mode: $toolMode,
            points: [{ x, y }],
        }
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

    const handleDrawEnd = () => {
        if ($toolMode !== 'autoLine') {
            ctx.fill()
        }
        
        removeSinglePointPaths()
    }

    const removeSinglePointPaths = () => {
        $paths = $paths.filter(({ points, mode }) => 
            points.length > 1 || mode === 'fill'
        )
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
        id='viewport-canvas'
        style={$canvasStyle}
        bind:this={canvas} 
    />    
    {#if image}
        <AutoLineTool {image} />
    {/if}
</div>

<GestureHandler
    {canvas} 
    on:drawstart={startNewPathFromCursor}
    on:brushmove={addPointToLastPath}
    on:drawend={handleDrawEnd}
    on:doubletap={undo}
    on:fill={fill}
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