<script lang='ts'>
    import { PATH_COLORS } from '@lib/constants'
    import type { ClassType } from '@lib/types'
    import { brushType } from '../state'

    export let showLabels: boolean = false

    const updateTool = (type: string) => 
        (_: Event) => {
            console.log('Changed to brush', type)
            $brushType = (type as ClassType)
        }
</script>
            
<div class='row'>
    {#each Object.entries(PATH_COLORS) as [id, color]}
        <div 
            class='item'            
            on:click={updateTool(id)}
        >
            <div 
                class='bubble' 
                class:selected={$brushType === id}
                style='background: {color}'
            ></div>

            {#if showLabels}
                <label for=''>
                    {id === 'lane markings' ? 'lanes' : id }
                </label>
            {/if}
        </div>
    {/each}
</div>

<style>
    .row {
        display: flex;
        justify-content: space-between;
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