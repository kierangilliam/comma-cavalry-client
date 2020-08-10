<script lang='ts'>
    import { 
        zoom, 
        paths, 
        toolMode, 
        brushType, 
        overlayOpacity,
        brushSize, 
    } from '../state'
    import type { Path, Point } from '../state'
    import { getColor, undo } from '../utils'
    import { onMount } from 'svelte'
    import GestureEmitter from './GestureEmitter.svelte'

    export let imageSrc: string 
    export let maskSrc: string = null
    
    const WIDTH = 1164
    const HEIGHT = 874

    let origin: Point = { x: -(WIDTH / 2), y: 0 }
    let canvas: HTMLCanvasElement
    let image: HTMLImageElement
    let ctx: CanvasRenderingContext2D
    let mask: CanvasImageSource

    $: drawPaths($paths)
    $: setMask(maskSrc)
    $: imageStyle = `
        transform: scale(${$zoom});
        top: ${origin.y}px;
        left: ${origin.x}px;
    `
    $: canvasStyle = imageStyle + `opacity: ${$overlayOpacity};`

    onMount(() => {
        ctx = canvas.getContext('2d')
        drawPaths($paths)       
        image.width = canvas.width = WIDTH
        image.height = canvas.height = HEIGHT
    })

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
        if (!maskSrc) { 
            mask = null
            return 
        }

        mask = new Image()
        mask.src = maskSrc
        mask.onload = drawPaths
        mask.onerror = () => mask = null
    }

    const setMode = (mode: 'brush' | 'move' | 'fill') => 
        (_?) => {
        console.debug('Set mode', mode)
        $toolMode = mode
    }

    interface GestureEvent {
        detail: { 
            e: TouchEvent, 
            eStart?: TouchEvent, 
            scale?: number, 
            delta?: Point, 
        }
    }

    const startNewPath = ({ detail: { e } }: GestureEvent) => {
        if ($toolMode !== 'brush') {
            return
        }

        console.debug('Start new path')

        const path: Path = {
            type: $brushType,
            size: $brushSize,
            points: [pointFromEvent(e)],
        }

        $paths = [...$paths, path]
    }

    const addPointToLastPath = ({ detail: { e } }: GestureEvent) => {
        const lastPath = $paths.pop()
        
        if (lastPath) {
            console.debug('add point to last path')
            lastPath.points.push(pointFromEvent(e))
            $paths = [...$paths, lastPath]
        }
    }

    const pointFromEvent = (e: TouchEvent) => {
        const rect = canvas.getBoundingClientRect()
        const { clientX, clientY } = e.touches[0]

        return {
            x: (clientX - rect.left) / $zoom,
            y: (clientY - rect.top) / $zoom,
        }
    }

    const onEnd = () => {
        // Remove paths with 1 point
        $paths = $paths.filter(({ points }) => points.length > 1)
        setMode('brush')()
    }

    const { onPinch, onPinchEnd } = (() => {
        const MIN_ZOOM = .3
        const MAX_ZOOM = 3
        let lastScale = $zoom
        let lastDelta: Point = { x: 0, y: 0 }
        
        const onPinch = ({ detail: { scale, delta }}: GestureEvent) => {
            const newZoom = $zoom + (scale - lastScale) 
            
            $zoom = newZoom < MIN_ZOOM 
                ? $zoom
                : Math.min(MAX_ZOOM, newZoom)

            origin = {
                x: origin.x + delta.x - lastDelta.x,
                y: origin.y + delta.y - lastDelta.y,
            }
    
            lastDelta = delta
            lastScale = scale
        }    
    
        const onPinchEnd = () => {
            lastScale = 1
            lastDelta = { x: 0, y: 0 }
            setMode('brush')()
        }

        return { onPinchEnd, onPinch }
    })()
</script>

{#if canvas}
    <GestureEmitter 
        {canvas} 
        on:singlestart={startNewPath}
        on:singlemove={addPointToLastPath}
        on:end={onEnd}
        on:doubletap={undo}
        on:pinchstart={setMode('move')} 
        on:pinch={onPinch}
        on:pinchend={onPinchEnd}
    />
    <!-- TODO Set mode locked, 'last' -->
{/if}

<div class='outer'>
    <div class='inner'>
        <img 
            bind:this={image}
            src={imageSrc} 
            style={imageStyle}
            alt='Source'
        >
        <canvas 
            style={canvasStyle}
            bind:this={canvas} 
        />
    </div>
</div>

<style>
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