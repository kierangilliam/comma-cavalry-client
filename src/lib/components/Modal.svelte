<script context='module'>
    let zIndex = 1
</script>

<script lang='ts'>
    import { fly, fade } from 'svelte/transition'
    import { quintOut } from 'svelte/easing'
    import { createEventDispatcher, onMount } from 'svelte'

    export let active: any = false
    export let closable: boolean = true
    export let color: string = 'var(--background)'
    export let padding: { x?: string, y?: string}

    const dispatch = createEventDispatcher()
    const paddingStyle = `
        ${padding?.y || 'var(--modalPaddingY)'} 
        ${padding?.x || 'var(--modalPaddingX)'}
    `
    const backgroundStyle = `
        z-index: ${zIndex + 1};
    `
    const modalStyle = `
        padding: ${paddingStyle};
        background: ${color};
        z-index: ${zIndex + 1};
    `
    const close = () => {
        if (closable) {
            dispatch('close')
            active = false
        }
    }

    onMount(() => {
        zIndex += 1
    })
</script>

<!-- TODO Dont animate if changing page -->
{#if active}
    <div class='container'>
        <div 
            class='background'
            transition:fade
            style={backgroundStyle}
            on:click={close}
        ></div>
        <div 
            class='modal'
            style={modalStyle}
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
        background: rgba(87, 87, 87, 0.35);
        -webkit-backdrop-filter: blur(1px);
        backdrop-filter: blur(1px);
    }

    .modal {
        --modalPaddingX: var(--s-8);
        --modalPaddingY: var(--s-6);
        --modalShadow: var(--level-2);
        border-radius: var(--borderRadius);
        box-shadow: var(--modalShadow);
        width: 100%;
        max-width: 600px;
        overflow: hidden;
    }
</style>