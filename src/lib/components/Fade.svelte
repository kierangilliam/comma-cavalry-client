<script>
    export let visible
    export let duration = 300

    let style = `
        transition: all ${duration}ms ease-in-out; 
    `
</script>

<div class:visible {style}>
    <slot />
</div>

<style>
    div {
        opacity: 0;
        height: 0;        
    }

    .visible {
        height: auto;
        opacity: 1;
    }
</style>