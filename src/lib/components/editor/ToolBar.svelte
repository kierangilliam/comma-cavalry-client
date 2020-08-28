<script lang='ts'>
    import { toolMode } from './state'
    import type { EditorContext, ToolMode } from '@lib/types'
    import { setMode, undo } from './utils'
    import { fly } from 'svelte/transition'
    import { createEventDispatcher, getContext } from 'svelte'
    import GitWidget from './GitWidget.svelte'

    export let id: string

    const { paths } = getContext<EditorContext>('editor')
    const tools: ToolMode[] = ['brush', 'fill', 'autoLine', 'move']
    const dispatch = createEventDispatcher()
    
    let showGit = false
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
        <img src='/tools/undo.svg' alt='undo' on:click={() => undo(paths)} />
    </div>
    <div class='toolbar'>
        {#if showGit}
            <div class='widget' transition:fly={{ x: 100, duration: 150 }}>
                <GitWidget {id} paths={$paths} />
            </div>
        {/if}
        <img src='/github.svg' alt='github' on:click={() => showGit = !showGit} />
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

    .toolbar, .widget {
        background: var(--background);
        padding: var(--s-2) var(--s-3);
        border-radius: var(--borderRadiusSmall);
        pointer-events: all;
    }

    .widget {
        position: absolute;
        transform: translate(-66%, 33%);
        z-index: 100;
    }

    .toolbar {
        display: flex;
        margin-bottom: var(--s-2);
        justify-content: center;
        align-items: center;
        flex-direction: column;
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