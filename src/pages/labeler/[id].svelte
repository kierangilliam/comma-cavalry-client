<script lang='ts'>
    import { Haptics } from '@lib/capacitor'
    import { saveEntry } from '@lib/storage'
    import { onMount, setContext } from 'svelte'
    import { goto, params, url } from '@sveltech/routify'
    import { H4, Spacer } from '@ollopa/cedar'
    import { getImage } from '@gql'
    import type { EditorContext, Image, Path } from '@lib/types'
    import { BottomSheet, LoadingScreen } from '@lib/components'
    import { getEntry } from '@lib/storage'
    import { resetState } from './_lib/state'
    import { loadImageFromUrl, persistent } from '@lib/utils'
    import Viewport from './_lib/viewport/Viewport.svelte'
    import Controls from './_lib/controls/Controls.svelte'
    import TutorialModal from './_lib/tutorial/TutorialModal.svelte'
    import ToolBar from './_lib/ToolBar.svelte'    
    import GitModal from './_lib/GitModal.svelte'
    import { derived, writable } from 'svelte/store'
    import { notifications } from '@lib/notifications'

    const paths = writable<Path[]>([])
    const showTutorial = persistent('showLabelerTutorial', true)
    
    let showGit = false
    let loading = true
    let error = null 
    let image = null

    setContext<EditorContext>('editor', { paths })

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
        } else {
            $paths = []
        }
    }

    async function loadImage(id: string): Promise<Image & { image: HTMLImageElement }> {
        loading = true 

        try {
            const comma10KImage = await getImage(id)
            const image = await loadImageFromUrl(comma10KImage.url)

            return { ...comma10KImage, image }
        } catch (e) {
            error = e
            return null 
        } finally {
            loading = false
        }
    }

    export const undo = () => {
        console.debug('Undo')
        const _paths = $paths

        _paths.pop()
        $paths = _paths
    }

    export const onSave = () => {
        const { id } = $params

        saveEntry(id, { paths: $paths })
        Haptics.success()

        // Trigger state refresh so that derived 'dirty' updates
        $paths = $paths
    }

    const onExit = async () => {
        if (
            $dirty 
            && await notifications.confirm('Save changes before exiting?')
        ) {
            onSave()
        } 
        
        $goto('/')
    }

    // Dirty - Have changes been saved?
    const dirty = derived(
        paths,
        ($paths) => {
            const pathsString = JSON.stringify($paths)
            const saved = JSON.parse(localStorage.getItem('saved'))
            const { id } = $params
            const savedPathsString = JSON.stringify(
                saved ? saved[id]?.paths || [] : []
            )

            return savedPathsString !== pathsString
        }
    )
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
    {#await image then { id, image }}
        <Viewport {image} />
        <ToolBar 
            on:undo={undo} 
            on:github={() => showGit = true} 
            on:help={() => $showTutorial = true} 
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
        <TutorialModal bind:active={$showTutorial} />            
        <GitModal bind:active={showGit} paths={$paths} />            
    {/await}
{/if}