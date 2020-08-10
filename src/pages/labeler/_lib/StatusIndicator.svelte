<script lang='ts'>
    import { toolMode, brushType } from './state'
</script>

<div>
    {$brushType} • {$toolMode}
</div>

<style>
    div {
        position: fixed;
        /* TODO Change to s-16 or use view padding */
        top: 20px;
        left: 20px;
        background: var(--background);
        padding: var(--s-2) var(--s-4);
        border-radius: var(--borderRadiusFull);
    }
</style>