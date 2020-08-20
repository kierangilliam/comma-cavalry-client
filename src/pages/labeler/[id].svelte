<script lang='ts'>
    import { params, url } from '@sveltech/routify'
    import { H4, Spacer } from '@ollopa/cedar'
    import { getImage } from '@gql'
    import type { Image } from '@lib/types'
    import { BottomSheet, LoadingScreen } from '@lib/components'
    import { getEntry } from '@lib/storage'
    import { paths, resetState } from './_lib/state'
    import { urlToImageData } from './_lib/viewport/canvas-helpers'
    import Viewport from './_lib/viewport/Viewport.svelte'
    import Controls from './_lib/controls/Controls.svelte'
    import StatusIndicator from './_lib/StatusIndicator.svelte'
    import TutorialModal from './_lib/tutorial/TutorialModal.svelte'
    import { onMount } from 'svelte'

    let loading = true
    let error = null 
    let image = null

    onMount(() => {
        // TODO BUG: onMount fires twice when navigating from homepage 
        resetState()
        loadSavedPaths($params.id)
        image = loadImage($params.id)
    })
    
    function loadSavedPaths(id: string) {
        const { paths: loadedPaths } = getEntry(id)

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
            <Spacer />
            <p>{error}</p>
            <Spacer />
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
        <TutorialModal />            
    {/await}
{/if}