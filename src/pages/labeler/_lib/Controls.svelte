<script lang='ts'>
    import { viewport, tool } from './state'
    import ColorSelector from './ColorSelector.svelte'
    import { H1, H2 } from '@ollopa/cedar'
</script>


<div class='sheet'>
    <ColorSelector showLabels={true} />
    <div>
        <label>Brush size</label>
        <input 
            type='range' 
            bind:value={$tool.brushSize}
            min='1' 
            max='20' 
            step='1' 
        />

        <label>Overlay Opacity</label>
        <input 
            type='range' 
            bind:value={$viewport.overlayOpacity}
            min='0' 
            max='1' 
            step='.1' 
        />
    </div>
</div>


<style>
    .sheet {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--background);
        border-radius: var(--borderRadius) var(--borderRadius) 0 0;
        height: 200px;
        margin: 0 4px;
        padding: var(--viewPadding);
    }
</style>