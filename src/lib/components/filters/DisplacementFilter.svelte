<script lang='ts'>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'    
    import type { Point } from '@lib/types'
    import { frag, vert } from './glsl-depth-displacement'
    import Regl from 'regl'
    import { loadImageFromUrl } from '@lib/utils'
    
    export let scale = .25
    export let drift = 10
    export let speed = 1
    export let source = 'https://raw.githubusercontent.com/commaai/comma10k/master/imgs/0260_e61068239ce72500_2018-07-31--22-35-41_1_1008.png' 
    export let map = 'https://ik.imagekit.io/ollopa/0260_e61068239ce72500_2018-07-31--22-35-41_1_1008_Cq9e6Ou8dj.jpg' 
    export let hoverable: boolean = false
    
    const dispatch = createEventDispatcher()

    let cursor: Point
    let target: HTMLCanvasElement
    let animationFrame: { cancel: () => void }
    let sourceImage: HTMLImageElement
    let mapImage: HTMLImageElement
    let regl: any

    // Wait until everything is loaded to start regl
    $: sourceImage && mapImage && (initRegl()) 
    $: scaledHeight = IMAGE_HEIGHT * scale
    $: scaledWidth = IMAGE_WIDTH * scale
    $: scaledHeightCanvas = scaledHeight * 2
    $: scaledWidthCanvas = scaledWidth * 2
    $: style = `
        width: ${scaledWidth}px;
        height: ${scaledHeight}px;
    `

    onMount(() => {         
        loadImages()
    })

    onDestroy(() => {
        animationFrame && animationFrame.cancel()
    })

    const loadImages = async () => {
        try {
            const images = await Promise.all([
                loadImageFromUrl(source), 
                loadImageFromUrl(map)
            ])
            
            sourceImage = images[0] 
            mapImage = images[1]
        } catch (error) {
            console.error(error)
            map = null
        }
    }

    const initRegl = () => {
        console.debug('Initializing regl')

        regl = Regl(target)

        const emptyTextureDimension = {
            width: 1164,
            height: 874,
            channels: 3,
        }
        
        const sourceTexture = regl.texture(emptyTextureDimension)({ data: sourceImage })
        const mapTexture = regl.texture(emptyTextureDimension)({ data: mapImage })

        try {
            startRegl(draw(sourceTexture, mapTexture))
        } catch (error) {
            console.error('Could not start regl', error)
            map = null // go to fallback
        }
    }

    const draw = (source, depthMap) => regl({
        frag: frag({ easing: true }),
        vert,
        attributes: {
            position: [
                -2, 0,
                0, -2,
                2, 2
            ]
        },
        uniforms: {
            source,
            depthMap,
            dx: regl.prop('dy'),
            dy: regl.prop('dx'),
            size: regl.prop('size'),
        },
        count: 3
    })

    // regl.frame() wraps requestAnimationFrame and also handles viewport changes
    const startRegl = (draw: (args: any) => void) => {
        animationFrame = regl.frame(({ time }) => {
            // clear contents of the drawing buffer
            regl.clear({
                color: [0, 0, 0, 0],
                depth: 1
            })
            
            const scale = IMAGE_WIDTH / scaledWidthCanvas
            const size = [IMAGE_WIDTH, IMAGE_HEIGHT, scale]
            let dx = Math.sin(time * speed) * drift
            let dy = Math.cos(time * 0.5 * speed) * drift
            
            if (cursor) {
                const percentX = cursor.x / scaledWidth
                const percentY = cursor.y / scaledHeight
                dx = (percentX - .5) * (drift * 2) * -1
                dy = (percentY - .5) * (drift * 2) * -1
            }

            draw({ dx, dy, size })
        })
    }

    const setCursor = (e) => {
        cursor = e 
            ? { x: e.clientX, y: e.clientY }
            : null
    }

    const hasWebglSupport = () => { 
        try {
            const canvas = document.createElement('canvas')
            return !!window.WebGLRenderingContext && canvas.getContext('webgl')
        } catch(e) {
            return false
        }
    }
</script>

{#if map && hasWebglSupport()}
    <div class:hoverable on:click={() => dispatch('click')} {style}>
        <canvas 
            bind:this={target}
            width={scaledWidthCanvas}
            height={scaledHeightCanvas}
            on:mousemove={e => setCursor(e)}
            on:touchmove={({ touches }) => setCursor(touches[0])}
            on:touchend={() => setCursor(null)}
            on:mouseout={() => setCursor(null)}
        ></canvas>
    </div>
{:else}
    <!-- Fallback -->
    <img 
        class:hoverable 
        on:click={() => dispatch('click')} 
        {style} 
        src={source} 
        alt=''
    >
{/if}

<style>
    div {
        overflow: hidden;
        transition: all 250ms;
    }

    .hoverable:hover {
        cursor: pointer;
        --shadowOffset: 1.5px;
        transform: scale(.93);
    }
</style>