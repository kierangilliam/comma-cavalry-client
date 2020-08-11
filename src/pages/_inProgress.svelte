<script>
    import { getImage } from '@gql'
    import { getSaved } from '@lib/storage'
    import { goto } from '@sveltech/routify'
    import { Flex } from '@ollopa/cedar'

    const inProgress = () => {
        const saved = getSaved()
        
        return Object.entries(saved).map(([id]) => ({ id }))
    }
</script>

<div>
    {#each inProgress() as { id }}
        <!-- TODO Cache image and load that too -->
        <div class='entry' on:click={() => $goto(`/labeler/${id}`)}>
            {#await getImage(id)}
                Loading...
            {:then { url }} 
                <img src={url} alt={id}>
            {:catch error} 
                Error {error}
            {/await}
        </div>
    {/each}
</div>

<style>
    div {
        display: flex;
        overflow-x: scroll;
    }
    /* Fixes hidden overflow issue https://stackoverflow.com/questions/33485841/top-gets-cut-off-when-using-flexbox */
    div::before { margin-left: auto; }
    div::after { margin-right: auto; }

    img {
        max-width: 50vw;
        margin-left: var(--s-6);
        filter: drop-shadow(-3px -3px 0px rgba(247, 247, 247, 0.25));
    }
</style>