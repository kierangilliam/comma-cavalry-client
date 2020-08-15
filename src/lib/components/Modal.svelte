<script>
    import { fly, fade } from 'svelte/transition'
    import { quintOut } from 'svelte/easing'

    export let active = false
</script>

{#if active}
    <div 
        class='container'        
        on:click={() => active = false}
    >
        <div 
            class='background'
            transition:fade
        ></div>
        <div 
            class='modal'
            in:fly={{ y: 200, easing: quintOut, duration: 1250 }}
            out:fly={{ y: 200, easing: quintOut, duration: 500 }}
        >
            <slot />
        </div>
    </div>
{/if}

<style>
    .container, .background {        
        position: fixed;
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
        background: rgba(0, 0, 0, .2);
        backdrop-filter: blur(2px);
    }

    .modal {
        z-index: 2;
        --modalPadding: var(--s-6) var(--s-8);
        --modalShadow: var(--level-2);
        background: var(--background);
        border-radius: var(--borderRadius);
        box-shadow: var(--modalShadow);
        padding: var(--modalPadding);
        width: 100%;
        overflow: hidden;
    }
</style>