<script lang='ts'>
    import { 
        zoom, 
        paths, 
        toolMode, 
        brushType, 
        overlayOpacity,
        brushSize, 
        canvasPosition,
        isTouching,
        cursor,
    } from '../state'
    import type { Path, Point } from '@lib/types'
    import { getColor, undo, setMode } from '../utils'
    import { onMount } from 'svelte'
    import { urlToImageData } from './canvas-helpers'
    import GestureEmitter from './GestureEmitter.svelte'
    import AutoLineTool from './AutoLineTool.svelte'

    export let imageUrl: string 
    export let maskUrl: string = null
    
    const WIDTH = 1164
    const HEIGHT = 874    

    let origin: Point = { x: -(WIDTH / 2), y: 0 }
    let canvas: HTMLCanvasElement
    let image: HTMLImageElement
    let imageData: string // base64
    let ctx: CanvasRenderingContext2D
    let mask: CanvasImageSource
    
    $: drawPaths($paths)
    $: setMask(maskUrl)
    $: image && setImage(imageUrl)
    $: imageStyle = `
        transform-origin: ${origin.x}px ${origin.y}px;
        transform: scale(${$zoom});
        top: ${$canvasPosition.y}px;
        left: ${$canvasPosition.x}px;
    `
    $: canvasStyle = imageStyle + `opacity: ${$overlayOpacity};`

    onMount(() => {        
        image.width = canvas.width = WIDTH
        image.height = canvas.height = HEIGHT
        ctx = canvas.getContext('2d')
    
        drawPaths($paths)
    })

    /**
     * Calculate a y offset to lift returned value 
     * a consistent height above finger, despite the 
     * zoom level
     */  
    const pointFromCanvasPosition = (canvasX: number, canvasY: number): Point => {
        const CURSOR_OFFSET = 40
        // TODO Make more even
        const offset = (CURSOR_OFFSET / $zoom * .75)
        console.log(offset)
        return { x: canvasX, y: canvasY - offset }
    }

    const drawPaths = (_) => {
        if (!ctx) return 

        console.debug('Draw paths')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = getColor('empty')
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (mask !== null){
            ctx.drawImage(mask, 0, 0)
        }

        $paths.forEach(({ points, size, type }) => {
            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)

            points.forEach(({ x, y }) => ctx.lineTo(x, y))

            ctx.lineWidth = size
            ctx.strokeStyle = getColor(type)
            ctx.fillStyle = getColor(type)
            ctx.stroke()
            ctx.fill()
        })
    }

    const setMask = (_) => {
        if (!maskUrl) { 
            mask = null
            return 
        }

        mask = new Image()
        mask.src = maskUrl
        mask.onload = drawPaths
        mask.onerror = () => mask = null
    }

    const setImage = async (_) => {
        imageData = await urlToImageData(imageUrl)
        image.src = imageData
    }

    interface GestureEvent {
        detail: { 
            x?: number, 
            y?: number, 
            canvasX?: number, 
            canvasY?: number, 
            scale?: number, 
            delta?: Point, 
        }
    }

    const onPanStart = ({ detail: { canvasX, canvasY } }: GestureEvent) => {
        $isTouching = false
        $cursor = pointFromCanvasPosition(canvasX, canvasY)

        if ($toolMode === 'brush') {
            startNewPath($cursor)
        }
    }

    const onPanMove = ({ detail: { canvasX, canvasY } }: GestureEvent) => {
        $cursor = pointFromCanvasPosition(canvasX, canvasY)

        if ($toolMode === 'brush' && $paths.length > 0) {
            addPointToLastPath($cursor)
        }        
    }

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

    const onEnd = () => {
        console.debug('end')
        // Remove paths with 1 point
        $paths = $paths.filter(({ points }) => points.length > 1)
        $isTouching = false
        setMode('last')
    }

    const { onPinch, onPinchEnd } = (() => {
        const MIN_ZOOM = .2
        const MAX_ZOOM = 6
        let lastScale = $zoom
        let lastDelta: Point = { x: 0, y: 0 }
        
        const onPinch = ({ detail: { scale, delta, x, y }}: GestureEvent) => {
            const SPEED = 5
            const newZoom = $zoom + ((scale - lastScale) * SPEED)
            
            $zoom = newZoom < MIN_ZOOM 
                ? $zoom
                : Math.min(MAX_ZOOM, newZoom)

            $canvasPosition = {
                x: $canvasPosition.x + ((delta.x - lastDelta.x) * SPEED),
                y: $canvasPosition.y + ((delta.y - lastDelta.y) * SPEED),
            }

            origin = { x, y }
            lastDelta = delta
            lastScale = scale
        }    
    
        const onPinchEnd = () => {
            lastScale = 1
            lastDelta = { x: 0, y: 0 }
            setMode('last')
        }

        return { onPinchEnd, onPinch }
    })()
</script>

<div class='background'></div>
<div class='outer'>    
    <div class='inner'>
        <img 
            bind:this={image}            
            style={imageStyle}
            alt='Source'
        >
        <canvas 
            style={canvasStyle}
            bind:this={canvas} 
        />        
        {#if imageData}
            <AutoLineTool {image}/>
        {/if}
    </div>
</div>

<GestureEmitter 
    {canvas} 
    on:panstart={onPanStart}
    on:panmove={onPanMove}
    on:end={onEnd}
    on:doubletap={undo}
    on:pinchstart={() => setMode('move')} 
    on:pinch={onPinch}
    on:pinchend={onPinchEnd}
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
        overflow: hidden;
    }

    .inner {
        width: 100%;
        position: relative;
    }

    img, canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>