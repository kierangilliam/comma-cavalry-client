<script lang='ts'>
    import type { ClassType } from './state'
    import { brush } from './state'
    import { getColor, COLORS } from './utils'

    export let showLabels: boolean = false

    const updateBrush = (type: string) => 
        (_: Event) => {
            console.log('Changed to brush', type)
            $brush = { ...$brush, type: type as ClassType }
        }
</script>
            
<div class='row'>
    {#each Object.entries(COLORS) as [id, color]}
        <div 
            class='item'
            on:click={updateBrush(id)}
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