<script lang='ts'>
    import { Viewport, Controls, ToolBar } from '.'
    import KeyboardShortcuts from './KeyboardShortcuts.svelte'
    import type { EditorContext, Image, Path } from '@lib/types'
    import { H4, Spacer } from '@ollopa/cedar'
    import LoadingScreen from './LoadingScreen.svelte'
    import BottomSheet from '../BottomSheet.svelte'
    import { onMount, setContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'
    import { getImage } from '@gql'
    import { loadImageFromUrl } from '@lib/utils'

    export let id: string
    export let paths: Writable<Path[]>
    export let dirty: Readable<boolean>
    export let onSave: () => any
    export let onExit: () => any
    
    // Bindables
    export let showGit: boolean
    export let showTutorial: boolean
    export let loading: boolean

    let error: Error
    let image: HTMLImageElement

    setContext<EditorContext>('editor', { paths })

    onMount(async () => {
        loading = true 

        try {
            image = await loadImage(id)
        } catch (e) {
            error = e
        } finally {
            loading = false
        }

        setContext<EditorContext>('editor', { paths })
    })

    async function loadImage(id: string): Promise<HTMLImageElement> {
        loading = true 

        try {
            const comma10KImage = await getImage(id)
            return await loadImageFromUrl(comma10KImage.url)
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
    <Viewport {image} />
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