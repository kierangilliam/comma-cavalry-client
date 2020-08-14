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
    
    export let imageData: string // base64
    export let maskUrl: string = null
    
    let canvas: HTMLCanvasElement
    let image: HTMLImageElement    
    let ctx: CanvasRenderingContext2D
    let mask: CanvasImageSource    
    
    $: drawPaths($paths)
    $: setMask(maskUrl)
    $: image && (image.src = imageData)

    onMount(() => {        
        image.width = canvas.width = IMAGE_WIDTH
        image.height = canvas.height = IMAGE_HEIGHT
        ctx = canvas.getContext('2d')
    
        drawPaths($paths)
    })

    /**
     * Calculate a y offset to lift returned value 
     * a consistent height above finger, despite the 
     * zoom level
     */  
    const pointFromCanvasPosition = (canvasX: number, canvasY: number): Point => {
        const CURSOR_OFFSET = 55
        const { innerHeight } = window
        const { height: canvasHeight } = canvas.getBoundingClientRect()        
        const yDiff = (innerHeight - canvasHeight) / 2
        const scale = innerHeight / canvasHeight
        const offset = (CURSOR_OFFSET * scale) + ((scale / Math.abs(yDiff)) * CURSOR_OFFSET)
        
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

    const onLongPress = () => {
        if ($toolMode === 'move') {
            setMode('last')
        } else {
            setMode('move')
        }
    }

    const onPanStart = ({ detail: { canvasX, canvasY } }: GestureEvent) => {
        $isTouching = true
        $cursor = pointFromCanvasPosition(canvasX, canvasY)
        
        if ($toolMode === 'brush' || $toolMode === 'autoLine') {
            startNewPath($cursor)
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

    // TODO maybe move this & movement into another component
    const { onPinch, onEnd, onPanMove } = (() => {
        const MIN_ZOOM = .2
        const MAX_ZOOM = 6
        const SPEED = 5 
        let lastScale = $zoom        
        let lastDelta: Point = { x: 0, y: 0 }
        
        const onPanMove = ({ detail: { canvasX, canvasY, deltaX, deltaY } }: GestureEvent) => {
            $cursor = pointFromCanvasPosition(canvasX, canvasY)

            if ($toolMode === 'brush' && $paths.length > 0) {
                addPointToLastPath($cursor)
            } else if ($toolMode === 'move') {
                console.log('MOVING')
                const positionFromDelta = {
                    x: $canvasPosition.x + ((deltaX - lastDelta.x) * SPEED),
                    y: $canvasPosition.y + ((deltaY - lastDelta.y) * SPEED),
                }

                $canvasPosition = positionFromDelta
            }        

            lastDelta = { x: deltaX, y: deltaY }
        }

        const onEnd = () => {
            // Remove paths with 1 point
            $paths = $paths.filter(({ points }) => points.length > 1)
            $isTouching = false
            lastDelta = { x: 0, y: 0 }
            lastScale = 1
        }
        
        const onPinch = ({ detail: { scale }}: GestureEvent) => {            
            const newZoom = $zoom + ((scale - lastScale) * SPEED)
            
            $zoom = newZoom < MIN_ZOOM 
                ? $zoom
                : Math.min(MAX_ZOOM, newZoom)

            lastScale = scale
        }            

        return { onPinch, onEnd, onPanMove }
    })()
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
    on:panstart={onPanStart}
    on:panmove={onPanMove}
    on:end={onEnd}
    on:doubletap={undo}
    on:pinchstart={() => setMode('move')} 
    on:pinch={onPinch}
    on:longpress={onLongPress}
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