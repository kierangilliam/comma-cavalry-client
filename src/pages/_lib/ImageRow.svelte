<script>
    import { getImage } from '@gql'    
    import { fly } from 'svelte/transition'
    import { Spacer } from '@ollopa/cedar'
    import { createEventDispatcher } from 'svelte'
    
    const dispatch = createEventDispatcher()

    export let images
    export let label = ''
</script>

<p>{label}</p>

<Spacer />

<div class='container hide-scrollbar'>
    {#each images as { id }, i}
        <div 
            class='item' 
            on:click={() => dispatch('select', { id })}
        >
            {#await getImage(id)}
                <div class='loading-placeholder'></div>
            {:then { url }} 
                <img 
                    in:fly={{ x: -50, duration: 750, delay: 100 * i }} 
                    src={url} 
                    alt={id}
                >
            {:catch error} 
                Error {error}
            {/await}
        </div>
    {/each}
</div>

<style>
    .container {
        overflow: auto;
        white-space: nowrap;
        width: 100%;        
    }

    .item {
        --shadowOffset: 3px;
        padding-top: var(--shadowOffset);
        padding-left: var(--shadowOffset);
        display: inline-block;
        vertical-align: top;
        margin-right: 20px;
        white-space: normal;
    }

    img, .loading-placeholder {
        --shadow: calc(-1 * var(--shadowOffset));
        --displayHeight: calc(874px * .15);
        --displayWidth: calc(1164px * .15);
        object-fit: cover;
        height: var(--displayHeight);
        width: var(--displayWidth);
        filter: drop-shadow(var(--shadow) var(--shadow) 0px rgba(247, 247, 247, 0.25));
    }
    .loading-placeholder {
        background: var(--white);
        animation: var(--glowAnimation);
    }    
</style>