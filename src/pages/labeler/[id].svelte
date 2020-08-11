<script lang='ts'>
    import { getImage } from '@gql'
    import { BottomSheet } from '@lib/components'
    import Viewport from './_lib/viewport/Viewport.svelte'
    import Controls from './_lib/controls/Controls.svelte'
    import StatusIndicator from './_lib/StatusIndicator.svelte'
    import { params } from '@sveltech/routify'

    const image = getImage($params.id)
</script>

{#await image}
    Loading...
    <!-- TODO loading spinner & cancel button at bottom -->
{:then image}
    <Viewport imageUrl={image.url} />
    <StatusIndicator />
    <BottomSheet>
        <Controls />
    </BottomSheet>
{:catch error}
    Error { error }
{/await}