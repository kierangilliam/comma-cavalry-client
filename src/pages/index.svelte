<script lang='ts'>
    import { getImages } from '@gql'

    const imageNames = getImages()

    const getImage = (name: string) => 
        `https://raw.githubusercontent.com/commaai/comma10k/master/imgs/${name}`
</script>

{#await imageNames}
    Loading...
{:then names}
    {#each names.splice(0, 10) as name}
        <img src={getImage(name)} alt={name}>
    {/each}
    { JSON.stringify(names) }
{:catch error}
    Error { error }
{/await}

<style>
    img {
        max-width: 400px;
        max-height: 400px;
    }
</style>