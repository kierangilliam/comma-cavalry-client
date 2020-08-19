<script lang='ts'>
    import { onMount, onDestroy } from 'svelte'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'    
    import type { Point } from '@lib/types'
    import { frag, vert } from './glsl-depth-displacement'
    import Regl from 'regl'
    
    export let scale = .25
    export let drift = 10
    export let speed = 1
    export let source = 'https://raw.githubusercontent.com/commaai/comma10k/master/imgs/0260_e61068239ce72500_2018-07-31--22-35-41_1_1008.png' 
    export let map = 'https://ik.imagekit.io/ollopa/0260_e61068239ce72500_2018-07-31--22-35-41_1_1008_Cq9e6Ou8dj.jpg' 
    
    const DRIFT = drift    

    let cursor: Point
    let target: HTMLCanvasElement
    let animationFrame: { cancel: () => void }
    let sourceImage: HTMLImageElement
    let mapImage: HTMLImageElement
    let regl: any

    // Wait until everything is loaded to start regl
    $: regl && sourceImage && mapImage && (initRegl()) 
    $: scaledHeight = IMAGE_HEIGHT * scale
    $: scaledWidth = IMAGE_WIDTH * scale
    $: style = `
        width: ${scaledWidth}px;
        height: ${scaledHeight}px;
    `

    onMount(() => { 
        regl = Regl(target)
        loadImages()
    })

    onDestroy(() => {
        animationFrame && animationFrame.cancel()
    })

    const loadImages = async () => {
        const images = await Promise.all([
            loadImage(source), 
            loadImage(map)
        ])
        
        sourceImage = images[0] 
        mapImage = images[1]

        async function loadImage(url): Promise<HTMLImageElement> {
            const image = new Image()
            image.crossOrigin = 'anonymous'
            image.src = url

            return new Promise(resolve => {    
                image.onload = () => resolve(image)
                image.onerror = (e) => 
                    console.error('Filter: Could not load ', url)
            })
        }
    }

    const initRegl = () => {
        console.debug('Initializing regl')

        const emptyTextureDimension = {
            width: 1164,
            height: 874,
            channels: 3,
        }
        
        const sourceTexture = regl.texture(emptyTextureDimension)({ data: sourceImage })
        const mapTexture = regl.texture(emptyTextureDimension)({ data: mapImage })

        startRegl(draw(sourceTexture, mapTexture))
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
            wRcp: ({ viewportWidth }) => 1.0 / viewportWidth,
            hRcp: ({ viewportHeight }) => 1.0 / viewportHeight
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

            const size = [IMAGE_WIDTH, IMAGE_HEIGHT]
            let dx = Math.sin(time * speed) * DRIFT
            let dy = Math.cos(time * 0.5 * speed) * DRIFT
            
            if (cursor) {
                const percentX = cursor.x / scaledWidth
                const percentY = cursor.y / scaledHeight
                dx = (percentX - .5) * (DRIFT * 2) * -1
                dy = (percentY - .5) * (DRIFT * 2) * -1
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
    <canvas 
        bind:this={target}
        {style} 
        on:mousemove={e => setCursor(e)}
        on:touchmove={({ touches }) => setCursor(touches[0])}
        on:touchend={() => setCursor(null)}
        on:mouseout={() => setCursor(null)}
    ></canvas>
{:else}
    <!-- Fallback -->
    <img {style} src={source} alt=''>
{/if}
