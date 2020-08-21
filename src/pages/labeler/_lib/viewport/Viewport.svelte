<script lang='ts'>
    import { 
        Brush, 
        ToolCoordinator, 
        AutoLine, 
        Move, 
        Fill, 
        Undo,
    } from './tools'
    import { paths, canvasStyle, imageStyle } from '../state'
    import { onMount } from 'svelte'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'
    import Cursor from './Cursor.svelte'    
    import { MaskRenderer } from '@lib/editor-renderer'    
    
    export let image: HTMLImageElement

    const renderer = new MaskRenderer()
    
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    let imageContainer: HTMLImageElement
    
    onMount(() => {                
        imageContainer.appendChild(image)
        image.width = canvas.width = IMAGE_WIDTH
        image.height = canvas.height = IMAGE_HEIGHT
        ctx = canvas.getContext('2d')
        renderer.ctx = ctx

        paths.subscribe(paths => 
            renderer.drawAllPaths({ paths })
        )
    })
</script>

<div class='background'></div>
<div class='container'>
    <div 
        bind:this={imageContainer}            
        style={$imageStyle}
        alt='Source'
    >
    </div>
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

    img {
        box-shadow: 
            0px 0px 10px rgba(25, 25, 25, 0.5),
            0px 0px 100px rgba(45, 45, 45, .2)
        ;
    }
</style>