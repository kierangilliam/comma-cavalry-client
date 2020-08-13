<script lang='ts'>
    import { getImage } from '@gql'
    import { BottomSheet } from '@lib/components'
    import Viewport from './_lib/viewport/Viewport.svelte'
    import Controls from './_lib/controls/Controls.svelte'
    import StatusIndicator from './_lib/StatusIndicator.svelte'
    import { params } from '@sveltech/routify'
    import { getEntry } from '@lib/storage'
    import { paths } from './_lib/state'

    $: loadSaved($params.id)
    $: image = getImage($params.id)
    
    function loadSaved(id: string) {
        const [loadedPaths] = getEntry(id)

        if (loadedPaths.length > 0) {
            console.log('Resuming progress from last session')
            $paths = loadedPaths
        }
    }
</script>

{#await image}
    Loading...
    <!-- TODO loading spinner & cancel button at bottom -->
{:then image}
    <Viewport imageUrl={image.url} />
    <StatusIndicator />
    <BottomSheet>
        <Controls imageID={image.id} />
    </BottomSheet>
{:catch error}
    Error { error }
{/await}