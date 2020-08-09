<svelte:window bind:innerWidth bind:innerHeight />

<script lang='ts'>
    import { viewport, paths, brush } from './state'
    import type { Path } from './state'
    import { getColor } from './utils'
    import { onMount } from 'svelte'

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
            const color = getColor(type)

            console.log('color:', color)

            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)

            points.forEach(({ x, y }) => ctx.lineTo(x, y))

            ctx.lineWidth = size
            ctx.strokeStyle = color
            ctx.fillStyle = color
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

    const handleTouchStart = (e: TouchEvent) => {
        if ($brush.mode === 'draw') {
            return startNewPath(e)
        }
    }

    const handleTouchMove = (e: TouchEvent) => {
        if (
            $brush.mode === 'draw'
            && e.touches.length === 1
        ) {
            return addPointToLastPath(e)
        }

        // TODO Delete last path if touches > 1?
        // Pan
        console.log('pan')
    }

    const startNewPath = (e: TouchEvent) => {
        const { type, size } = $brush
        
        const path: Path = {
            type,
            size,
            points: [pointFromEvent(e)]
        }

        console.log('start new path', type)

        $paths = [...$paths, path]
    }

    const addPointToLastPath = (e: TouchEvent) => {
        const lastPath = $paths.pop()

        lastPath.points.push(pointFromEvent(e))

        $paths = [...$paths, lastPath]
    }

    const pointFromEvent = (e: TouchEvent) => {
        const rect = canvas.getBoundingClientRect()
        const { clientX, clientY } = e.touches[0]

        return {
            x: (clientX - rect.left) / $viewport.zoom,
            y: (clientY - rect.top) / $viewport.zoom,
        }
    }
</script>

<div class='outer' class:scrollable={$brush.mode === 'move'}>
    <div class='inner'>
        <img 
            bind:this={image}
            src={imageSrc} 
            alt='Source'
        >
        <canvas 
            bind:this={canvas} 
            on:touchstart={handleTouchStart}
            on:touchmove={handleTouchMove}
        />
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