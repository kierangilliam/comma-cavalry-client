<script lang='ts'>
    import { getOpenPRs } from '@lib/gql'
    import { H2, Flex, Spacer, Button } from '@ollopa/cedar'
    import { goto } from '@sveltech/routify'
    import { DisplacementFilter } from '@lib/components'

    let prs = getOpenPRs()
</script>

<div class='container'>
    <H2>Pull requests</H2>

    <Spacer s={8} />

    {#await prs}
        Loading pull requests...
    {:then prs}
        {#each prs as { url, number, files }}
            <Flex justify='none'>
                <DisplacementFilter 
                    source={files[0].maskURL}                    
                    map={files[0].depthMapURL}
                    scale={.2}
                    drift={10}
                    on:click={() => $goto(`../${number}`)}
                    hoverable 
                />
                <Spacer s={4} />
                <div class='details'>
                    <a target='blank' href={url}>{number}</a>
                    <p>{files.length} masks</p>
                    <Spacer s={4} />
                    <Button on:click={() => $goto(`../${number}`)} small>review</Button>
                </div>
            </Flex>
            <Spacer />
        {:else}
            No open pull requests.
        {/each}
    {:catch error}
        Error fetching prs {error}
    {/await}
</div>

<style>
    .container {
        margin: 0 auto;
        max-width: 600px;
        padding: var(--viewPadding);
    }

    .details {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        margin-left: var(--s-2);
    }

    .details a {
        font-size: var(--h3);        
    }
</style>