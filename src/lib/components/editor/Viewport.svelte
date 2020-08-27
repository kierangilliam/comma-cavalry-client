<script lang='ts'>
    import { getContext, onMount } from 'svelte'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'
    import Cursor from './Cursor.svelte'        
    import { MaskRenderer } from '@lib/mask-renderer'
    import { copyImageData } from '@lib/utils'
    import { Brush, ToolCoordinator, AutoLine, Move, Fill, Undo } from './tools'
    import { canvasStyle, imageStyle, resetState } from './state'
    import type { EditorContext } from '@lib/types'
    
    export let image: HTMLImageElement
    export let mask: HTMLImageElement
    export let truePathColor: boolean = true

    const { paths } = getContext<EditorContext>('editor')

    const renderer = new MaskRenderer()
    
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    let imageContainer: HTMLImageElement
    let maskImageData: ImageData

    // Rerender if ctx, paths, etc changes
    $: render([ctx, $paths])
    $: renderer.truePathColor = truePathColor
    
    onMount(() => {        
        resetState() 

        imageContainer.appendChild(image)        
        canvas.width = IMAGE_WIDTH
        canvas.height = IMAGE_HEIGHT
        ctx = canvas.getContext('2d')
        renderer.ctx = ctx
        renderer.clear()
        maskImageData = mask 
            ? copyImageData({ ctx, image: mask, x: 0, y: 0 }) 
            : null
    })

    const render = _ => { 
        if (!ctx) return

        renderer.drawAllPaths({ 
            paths: $paths, 
            mask: maskImageData, 
        })
    }
</script>

<div class='background'></div>
<div class='container'>
    <div 
        bind:this={imageContainer}            
        id='image-container'
        style={$imageStyle}
        alt='Source'
    ></div>   
    <canvas 
        id='mask-canvas'
        style={$canvasStyle}
        bind:this={canvas} 
    />    
    {#if image}
        <ToolCoordinator {canvas}>
            <Brush renderer={renderer.getTool('brush')} />
            <Fill renderer={renderer.getTool('fill')} />
            <AutoLine renderer={renderer.getTool('autoLine')} {image} />
            <Move />
            <Undo />
        </ToolCoordinator>
    {/if}
</div>

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

    #image-container {
        box-shadow: 
            0px 0px 10px rgba(25, 25, 25, 0.5),
            0px 0px 100px rgba(45, 45, 45, .2)
        ;
    }
</style>