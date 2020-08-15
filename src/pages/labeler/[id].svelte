<script lang='ts'>
    import { params, url } from '@sveltech/routify'
    import { H4 } from '@ollopa/cedar'
    import { getImage } from '@gql'
    import type { Image } from '@lib/types'
    import { BottomSheet, LoadingScreen, Modal } from '@lib/components'
    import { getEntry } from '@lib/storage'
    import Viewport from './_lib/viewport/Viewport.svelte'
    import Controls from './_lib/controls/Controls.svelte'
    import StatusIndicator from './_lib/StatusIndicator.svelte'
    import { paths } from './_lib/state'
    import { urlToImageData } from './_lib/viewport/canvas-helpers'
    import Tutorial from './_lib/tutorial/Tutorial.svelte'

    let loading = true
    let error = null

    $: loadSavedPaths($params.id)
    $: image = loadImage($params.id)
    
    function loadSavedPaths(id: string) {
        const [loadedPaths] = getEntry(id)

        if (loadedPaths.length > 0) {
            console.log('Resuming progress from last session')
            $paths = loadedPaths
        }
    }

    async function loadImage(id: string): Promise<Image & { imageData: string }> {
        loading = true 

        try {
            const image = await getImage(id)
            const imageData = await urlToImageData(image.url)

            return { ...image, imageData }
        } catch (e) {
            error = e
            return null 
        } finally {
            loading = false
        }
    }
</script>

{#if loading || error}
    <LoadingScreen {error}>
        <a href={$url('/')}>cancel</a>

        <div slot='error'>
            <H4>Something went wrong.</H4>
            <p>{error}</p>
            <a href={$url('/')}>go back</a>
        </div>
    </LoadingScreen>
{:else}
    {#await image then { id, imageData }}
        <Viewport {imageData} />
        <StatusIndicator />
        <BottomSheet>
            <Controls {id} />
        </BottomSheet>

        {#if true}
            <Modal>
                <Tutorial />
            </Modal>
        {/if}
    {/await}
{/if}