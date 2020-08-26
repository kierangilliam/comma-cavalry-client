<script lang='ts'>
    import { getImage } from '@gql'        
    import { Spacer } from '@ollopa/cedar'
    import { createEventDispatcher } from 'svelte'
    import { loadImageFromUrl } from '@lib/utils'
    import { Image } from '@lib/components'
    
    const dispatch = createEventDispatcher()

    export let images: string[]
    export let label: string = ''

    const getUrl = async (id: string): Promise<string> => {
        const { url } = await getImage(id)
        return url
    }
</script>

<p>{label}</p>

<Spacer />

<div class='container hide-scrollbar'>
    {#each images as id, i}
        <div class='item' on:click={() => dispatch('select', { id })}>
            <Image url={getUrl(id)} scale={.15} {i} hoverable />
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
        display: inline-block;
        vertical-align: top;
        margin-right: 20px;
        white-space: normal;
    }
</style>