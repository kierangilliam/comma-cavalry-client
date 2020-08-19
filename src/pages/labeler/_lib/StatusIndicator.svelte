<script lang='ts'>
    import { toolMode, brushType, paths, dirty } from './state'
</script>

<div id='status-indicator'>
    <span>{$brushType} • {$toolMode}</span>
    <!-- • {$paths.length} {$dirty ? ' • dirty' : ''} -->
</div>

<style>
    #status-indicator {        
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: calc(env(safe-area-inset-top) + 16px);
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