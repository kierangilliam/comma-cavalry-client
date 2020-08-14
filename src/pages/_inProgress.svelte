<script>
    import { getImage } from '@gql'
    import { getSaved } from '@lib/storage'
    import { goto } from '@sveltech/routify'
    import { Flex } from '@ollopa/cedar'
    import { fly } from 'svelte/transition'

    const inProgress = () => {
        const saved = getSaved()
        
        return Object.entries(saved).map(([id]) => ({ id }))
    }
</script>

<p>in progress</p>
<div class='container hide-scrollbar'>
    {#each inProgress() as { id }, i}
        <!-- TODO Cache image and load that too -->
        <div class='item' on:click={() => $goto(`/labeler/${id}`)}>
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