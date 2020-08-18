<script lang='ts'>
    import { fly, fade } from 'svelte/transition'
    import { quintOut } from 'svelte/easing'
    import { createEventDispatcher } from 'svelte'

    export let active: any = false
    export let padding: { x?: string, y?: string}

    const dispatch = createEventDispatcher()
    const paddingStyle = `
        ${padding?.y || 'var(--modalPaddingY)'} 
        ${padding?.x || 'var(--modalPaddingX)'}
    `

    const setInactive = () => {
        dispatch('inactive')
        active = false
    }
</script>

<!-- TODO Dont animate if changing page -->
{#if active}
    <div 
        class='container'                
    >
        <div 
            class='background'
            transition:fade
            on:click={setInactive}
        ></div>
        <div 
            class='modal'
            style='padding: {paddingStyle};'
            in:fly={{ y: 200, easing: quintOut, duration: 1250 }}
            out:fly={{ y: 200, easing: quintOut, duration: 500 }}
        >
            <slot />
        </div>
    </div>
{/if}

<style>
    .container, .background {        
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;                
    }

    .container {
        padding: var(--viewPadding);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .background {
        z-index: 1;
        background: rgba(87, 87, 87, 0.35);
        -webkit-backdrop-filter: blur(1px);
        backdrop-filter: blur(1px);
    }

    .modal {
        z-index: 2;
        --modalPaddingX: var(--s-8);
        --modalPaddingY: var(--s-6);
        --modalShadow: var(--level-2);
        background: var(--background);
        border-radius: var(--borderRadius);
        box-shadow: var(--modalShadow);
        width: 100%;
        overflow: hidden;
    }
</style>