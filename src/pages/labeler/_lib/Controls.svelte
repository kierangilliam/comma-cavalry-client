<script>
    import { viewport, brush } from './state'
	import ColorSelector from './ColorSelector.svelte'
</script>

<div class="sheet">
    <ColorSelector showLabels={true} />
    <div>
        <label>Brush size</label>
        <input 
            type='range' 
            bind:value={$brush.size}
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
        width: 100%;
        background: white;
        height: 200px;
    }
</style>