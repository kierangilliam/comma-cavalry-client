<script>
    import { fade } from 'svelte/transition'

    export let visible
</script>

{#if visible}
    <div
        transition:fade={{ duration: 250 }}
    >
        <slot />
    </div>
{/if}