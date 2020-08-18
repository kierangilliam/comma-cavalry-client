<script lang='ts'>
    import { toolMode, brushType, paths, dirty } from './state'
</script>

<div>
    <span>{$brushType} • {$toolMode}</span>
    <!-- • {$paths.length} {$dirty ? ' • dirty' : ''} -->
</div>

<style>
    div {        
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        /* TODO Change to s-16 or use view padding */
        /* top: var(--statusBarHeight); */
        top: 20px;   
        left: 0;     
        right: 0;  
        pointer-events: none; 
    }

    span {
        padding: var(--s-2) var(--s-4);
        border-radius: var(--borderRadiusFull);
        background: var(--background);
    }
</style>