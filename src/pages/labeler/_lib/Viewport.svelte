<svelte:window bind:innerWidth bind:innerHeight />

<script lang='ts'>
    import { 
        zoom, 
        paths, 
        toolMode, 
        brushType, 
        brushSize 
    } from './state'
    import type { Path } from './state'
    import { getColor } from './utils'
    import { onMount } from 'svelte'
    import GestureEmitter from './GestureEmitter.svelte'

    export let imageSrc: string 
    export let maskSrc: string = null

    let innerWidth: number, innerHeight: number
    let canvas: HTMLCanvasElement
    let image: HTMLImageElement
    let ctx: CanvasRenderingContext2D
    let mask: CanvasImageSource

    $: drawPaths($paths)
    $: setMask(maskSrc)

    onMount(() => {
        ctx = canvas.getContext('2d')
        drawPaths($paths)       
        image.width = canvas.width = 1164
        image.height = canvas.height = 874
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
        (_) => {
        console.debug('Set mode', mode)
        $toolMode = mode
    }

    interface GestureEvent {
        detail: { 
            e: TouchEvent, 
            eStart: TouchEvent, 
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
        console.debug('add point to last path')

        const lastPath = $paths.pop()

        lastPath.points.push(pointFromEvent(e))
        $paths = [...$paths, lastPath]
    }

    const pointFromEvent = (e: TouchEvent) => {
        const rect = canvas.getBoundingClientRect()
        const { clientX, clientY } = e.touches[0]

        return {
            x: (clientX - rect.left) / $zoom,
            y: (clientY - rect.top) / $zoom,
        }
    }

    const undo = () => {
        console.debug('Undo')
        $paths.pop()
        $paths.pop()
        // Trigger state update
        $paths = $paths 
    }

    const pan = ({ detail: { e, eStart }}: GestureEvent) => {
        // if (
        //     e.touches.length < 2
        //     // eStart.touches.length < 2
        // ) {
        //     throw Error('Cannot pan with only one finger')
        // }

        // const { clientX, clientY } = eStart.touches[1]
        // const deltaX = e.changedTouches[0].clientX - clientX
        // const deltaY = e.changedTouches[0].clientY - clientY

        // console.log(deltaX, deltaY)
    }
</script>

{#if canvas}
    <GestureEmitter 
        {canvas} 
        on:singlestart={startNewPath}
        on:doublestart={setMode('move')}
        on:singlemove={addPointToLastPath}
        on:doublemove={pan}
        on:end={setMode('brush')}
        on:doubletap={undo}
    />
{/if}

<div class='outer' class:scrollable={$toolMode === 'move'}>
    <div class='inner'>
        <img 
            bind:this={image}
            src={imageSrc} 
            alt='Source'
        >
        <canvas bind:this={canvas} />
    </div>
</div>

<style>
    .outer {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
    .outer.scrollable {
        overflow: auto;
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

    canvas {
        opacity: .5;
    }
</style>