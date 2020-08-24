<script lang='ts'>
    import { toolMode } from './state'
    import type { ToolMode } from '@lib/types'
    import { setMode } from './utils'
    import { isDesktop } from '@lib/capacitor'
    import { TOOL_SHORTCUTS } from '@lib/constants'

    const tools: ToolMode[] = ['brush', 'fill', 'autoLine', 'move']

    if (isDesktop) {
        window.addEventListener('keyup', ({ keyCode }: KeyboardEvent) => {
            if (TOOL_SHORTCUTS[keyCode]) setMode(TOOL_SHORTCUTS[keyCode])
        })
    }
</script>

<div class='container'>
    <div id='toolbar'>
        {#each tools as tool}
            <img 
                id='icon' 
                class:active={$toolMode === tool} 
                src='/tools/{tool}.svg' 
                alt={tool}
                on:click={() => setMode(tool)}
            >
        {/each}
    </div>
</div>

<style>
    .container {        
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        bottom: 0;  
        right: calc(env(safe-area-inset-right) + 16px);     
        pointer-events: none; 
    }

    @media screen and (min-width: 600px) {
        .container {
            right: 7vw;
        }
    }   

    #toolbar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: var(--background);
        padding: var(--s-2) var(--s-3);
        border-radius: var(--borderRadiusSmall);
        pointer-events: all;
    }

    img {
        height: var(--s-4);
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
</style>