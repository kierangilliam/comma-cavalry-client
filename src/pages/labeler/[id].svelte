<script lang='ts'>
    import { Haptics } from '@lib/capacitor'
    import { saveEntry } from '@lib/storage'
    import { onMount } from 'svelte'
    import { goto, params } from '@sveltech/routify'
    import type { Path } from '@lib/types'
    import { getEntry } from '@lib/storage'
    import { persistent } from '@lib/utils'
    import { Editor } from '@lib/components'
    import TutorialModal from './_lib/tutorial/TutorialModal.svelte'
    import GitModal from './_lib/GitModal.svelte'
    import { derived, writable } from 'svelte/store'
    import { notifications } from '@lib/notifications'
    import { getImage } from '@gql'

    const paths = writable<Path[]>([])
    const showTutorial = persistent('showLabelerTutorial', true)
    
    let showGit = false
    let loading: boolean
    let error: Error
    let imageURL

    $: getImageURL($params.id)

    onMount(() => {
        loadSavedPaths($params.id)
    })

    const getImageURL = async (id: string) => {
        try {
            const comma10KImage = await getImage(id)

            imageURL = comma10KImage.url
        } catch (e) {
            error = e
        }
    }
    
    const loadSavedPaths = (id: string) => {
        const { paths: loadedPaths } = getEntry(id)

        if (loadedPaths.length > 0) {
            console.log('Resuming progress from last session')
            $paths = loadedPaths
        } else {
            $paths = []
        }
    }

    const onSave = () => {
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

<Editor 
    bind:loading
    bind:error
    bind:showGit
    bind:showTutorial={$showTutorial}
    id={$params.id}
    {imageURL} 
    {paths} 
    {dirty}
    {onExit}
    {onSave}
/>

{#if !loading}
    <TutorialModal bind:active={$showTutorial} />            
    <GitModal bind:active={showGit} paths={$paths} /> 
{/if}