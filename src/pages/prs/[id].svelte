<script lang='ts'>
    import { onMount } from 'svelte'
    import { getPR } from '@gql'
    import type { Path, PullRequest } from '@lib/types'
    import { Haptics } from '@lib/capacitor'
    import { saveEntry } from '@lib/storage'
    import { goto, params } from '@sveltech/routify'
    import { getEntry } from '@lib/storage'
    import { persistent } from '@lib/utils'
    import { Editor } from '@lib/components'
    import { TutorialModal, baseTutorials } from '@lib/components/tutorial'
    import GitModal from './_lib/GitModal.svelte'
    import Pagination from './_lib/Pagination.svelte'
    import { derived, writable } from 'svelte/store'
    import { notifications } from '@lib/notifications'

    /**
     * 
     * if files are okay -> 
     *    window.notify(click here to view the pull request)
     *    accept pull request
     * else
     *     ~changes made~
     *     commit to branch
     * 
     * Storage
     * - pullRequests
     *  - [number]: {
     *      - branch (personal)
     *      - repo (personal)
     *      - masks [{ id, paths, maskURL }]
     * 
     *  } 
     * 
     * ToolBar git
     *  - dropdown
     *  - takes in a repo & branch
     *  - has that git.ts logic in that component 
     */     
    const paths = writable<Path[]>([])
    let pr: PullRequest = null
    let workingIndex = 0

    // Bindables
    const showTutorial = persistent('showLabelerTutorial', true)
    let showGit = false
    let loading: boolean

    $: [id, imageURL, maskURL] = getDetailsAndSetPaths(pr, workingIndex)

    onMount(async () => {
        try {
            pr = await getPR(parseInt($params.id))
        } catch(e) {
            notifications.error('Could not fetch pull request', e)
        }
    })

    const getDetailsAndSetPaths = (pr: PullRequest, index: number) => {
        if (!pr) {
            return ['', '']
        }
        
        const { maskURL, imageURL, id } = pr.files[index]        
        const entry = getEntry(id)
        
        $paths = entry.paths

        return [id, imageURL, maskURL]
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
    bind:showGit
    bind:showTutorial={$showTutorial}
    {id}
    {imageURL}
    {maskURL}
    {paths} 
    {dirty}
    {onExit}
    {onSave}
/>

{#if pr} 
    <Pagination {pr} bind:index={workingIndex} />
{/if}

{#if !loading}
    <GitModal bind:active={showGit} paths={$paths} /> 
    <TutorialModal bind:active={$showTutorial} tutorials={baseTutorials({
        extraDesktopShortcuts: { n: 'next', p: 'previous' }
    })} />            
{/if}