<script lang='ts'>
    import type { ClassType } from './state'
    import { tool } from './state'
    import { getColor, COLORS } from './utils'

    export let showLabels: boolean = false

    const updateTool = (type: string) => 
        (_: Event) => {
            console.log('Changed to brush', type)
            $tool = { ...$tool, brushType: type as ClassType }
        }
</script>
            
<div class='row'>
    {#each Object.entries(COLORS) as [id, color]}
        <div 
            class='item'            
            on:click={updateTool(id)}
        >
            <div 
                class='bubble' 
                class:selected={$tool.brushType === id}
                style='background: {color}'
            ></div>

            {#if showLabels}
                {id === 'lane markings' ? 'lanes' : id }
            {/if}
        </div>
    {/each}
</div>

<style>
    .row {
        display: flex;
        justify-content: space-evenly;
    }

    .item {
        --bubbleSize: 32px;
        --bubbleInnerShadow: inset -3px -3px 0px rgba(0, 0, 0, 0.12);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .bubble {
        width: var(--bubbleSize);
        height: var(--bubbleSize);
        border: none;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 
            var(--bubbleInnerShadow);
        transition: all 150ms ease-out;
    }

    .selected {
        --whiteSelectionBorder: 0px 0px 0px 2px var(--white);
        
        border: 3px solid var(--background);
        box-shadow: var(--bubbleInnerShadow),
            var(--whiteSelectionBorder);
    }
</style>