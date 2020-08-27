<script lang='ts'>
    import { toolMode } from './state'
    import type { ToolMode } from '@lib/types'
    import { setMode, undo } from './utils'
    import { createEventDispatcher } from 'svelte'

    const tools: ToolMode[] = ['brush', 'fill', 'autoLine', 'move']
    const dispatch = createEventDispatcher()
</script>

<div class='container'>
    <div class='toolbar'>
        {#each tools as tool}
            <img 
                id='icon' 
                class:active={$toolMode === tool} 
                src='/tools/{tool}.svg' 
                alt={tool}
                on:click={() => setMode(tool)}
            >
        {/each}
        <img src='/tools/undo.svg' alt='undo' on:click={undo} />
    </div>
    <div class='toolbar'>
        <img src='/github.svg' alt='github' on:click={() => dispatch('github')} />
        <img src='/help.svg' alt='help' on:click={() => dispatch('help')} />
    </div>
</div>

<style>
    .container {        
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: calc(env(safe-area-inset-top) + 16px);     
        right: calc(env(safe-area-inset-right) + 16px);     
        pointer-events: none; 
    }

    .toolbar {
        display: flex;
        margin-bottom: var(--s-2);
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: var(--background);
        padding: var(--s-2) var(--s-3);
        border-radius: var(--borderRadiusSmall);
        pointer-events: all;
    }

    img {
        height: var(--s-5);
        margin: var(--s-2) 0;
        transition: filter 150ms ease-out;
    }
    img.active {
        /* Calculated using https://codepen.io/sosuke/pen/Pjoqqp */
        filter: 
            /* First, force to black */
            brightness(0) saturate(100%)
            invert(100%) 
            sepia(0%) 
            saturate(2220%) 
            hue-rotate(78deg) 
            brightness(104%) 
            contrast(94%);
    }
    img:hover {
        cursor: pointer;
    }
</style>