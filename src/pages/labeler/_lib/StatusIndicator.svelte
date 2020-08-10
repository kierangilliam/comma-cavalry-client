<script lang='ts'>
    import { tool } from './state'
</script>

<div>
    {$tool.brushType} • {$tool.mode}
</div>

<style>
    div {
        position: fixed;
        /* TODO Change to s-16 or use view padding */
        top: 20px;
        left: 20px;
        background: var(--background);
        padding: .25rem;
    }
</style>