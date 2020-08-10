<script lang='ts'>
    import { getImages } from '@gql'
    import Viewport from './_lib/Viewport.svelte'
    import Controls from './_lib/Controls.svelte'
    import StatusIndicator from './_lib/StatusIndicator.svelte'

    const imageNames = getImages()

    const getImage = (name: string) => 
        `https://raw.githubusercontent.com/commaai/comma10k/master/imgs/${name}`
</script>

{#await imageNames}
    Loading...
{:then names}
    <Viewport imageSrc={getImage(names[0])} />
    <StatusIndicator />
    <Controls />
{:catch error}
    Error { error }
{/await}