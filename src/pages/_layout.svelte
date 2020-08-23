<script>
    // TODO
    // import { keyboard } from '@lib/capacitor'

    // $: style = `
    //     top: ${($keyboard.visible ? `-${$keyboard.height}px` : 0)};
    // `
</script>

<div>
    <slot />
</div>

<style>
    div {
        padding: var(--viewPadding);
        min-height: 100vh; 
        overflow-x: hidden;
    }
</style>