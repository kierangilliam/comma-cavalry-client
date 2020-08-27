<script lang='ts'>
    import { Viewport, Controls, ToolBar } from '.'
    import KeyboardShortcuts from './KeyboardShortcuts.svelte'
    import type { EditorContext, Path } from '@lib/types'
    import { H4, Spacer } from '@ollopa/cedar'
    import LoadingScreen from './LoadingScreen.svelte'
    import BottomSheet from '../BottomSheet.svelte'
    import { setContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'
    import { loadImageFromUrl } from '@lib/utils'

    export let id: string
    export let imageURL: string
    export let maskURL: string
    export let paths: Writable<Path[]>
    export let dirty: Readable<boolean>
    export let onSave: () => any
    export let onExit: () => any
    
    // Bindables
    export let showGit: boolean
    export let showTutorial: boolean
    export let loading: boolean
    export let error: Error

    let image: HTMLImageElement
    let mask: HTMLImageElement
    let truePathColor = false

    setContext<EditorContext>('editor', { paths })

    $: loadDetails(imageURL, maskURL)

    const loadDetails = async (_, __) => {
        loading = true 

        if (!id && !imageURL) {
            return
        }

        try {
            if (maskURL) {
                truePathColor = true
                mask = await loadImageFromUrl(maskURL)
            }

            image = await loadImageFromUrl(imageURL)
        } catch (e) {
            error = e
        } finally {
            loading = false
        }
    }
</script>

{#if loading || error}
    <LoadingScreen {error}>
        <a on:click={onExit}>cancel</a>

        <div slot='error'>
            <H4>Something went wrong.</H4>
            <Spacer />
            <p>{error}</p>
            <Spacer />
            <a on:click={onExit}>go back</a>
        </div>
    </LoadingScreen>
{:else if image}
    <Viewport {image} {mask} {truePathColor} />
{:else}
    Something went wrong.
{/if}

<ToolBar 
    on:github={() => showGit = true} 
    on:help={() => showTutorial = true} 
/>

<BottomSheet>
    <Controls 
        {id} 
        {paths} 
        {dirty}
        on:exit={onExit}
        on:save={onSave}
    />
</BottomSheet>

<KeyboardShortcuts />