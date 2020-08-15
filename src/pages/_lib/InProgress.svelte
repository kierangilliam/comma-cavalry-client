<script>
    import { getImage } from '@gql'
    import { savedEntries } from '@lib/storage'
    import { fly } from 'svelte/transition'
    import { Spacer } from '@ollopa/cedar'
    import { createEventDispatcher } from 'svelte'
    
    const dispatch = createEventDispatcher()

    $: inProgress = getInProgress($savedEntries)

    const getInProgress = (saved) => 
        Object.entries(saved).map(([id]) => ({ id }))
</script>

<!-- TODO remove, hacky, should subscribe to saved, or just bubble this up -->
{#if inProgress.length > 0}
    <p>in progress</p>
    <Spacer />
    <div class='container hide-scrollbar'>
        {#each inProgress as { id }, i}
            <!-- TODO Cache image and load that too -->
            <div class='item' on:click={() => dispatch('select', { id })}>
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
{:else}
    <!-- TODO an image or something pretty lookin -->
    No items in progress. Label a new image below.
{/if}

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