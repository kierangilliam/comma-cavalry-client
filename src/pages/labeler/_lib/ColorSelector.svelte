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
                style='background: {color}'
            ></div>

            {#if showLabels}
                {id}
            {/if}
        </div>
    {/each}
</div>

<style>
    .row {
        display: flex;
    }

    .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .bubble {
        --bubbleSize: 44px;
        width: var(--bubbleSize);
        height: var(--bubbleSize);
    }
</style>