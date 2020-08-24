<script lang='ts'>
    import { goto } from '@sveltech/routify'
    import { getUnclaimed } from '@gql'
    import { Header } from '@lib/components'
    import { savedEntries } from '@lib/storage'
    import type { Entry } from '@lib/storage'
    import { Button, Flex, Spacer } from '@ollopa/cedar'
    import ImageRow from './_lib/ImageRow.svelte'
    import Onboard from './_lib/Onboard.svelte'
    import SelectedImageModal from './_lib/SelectedImageModal.svelte'
    import { notifications } from '@lib/notifications'

    let disabled = false
    let selectedImageID: string = null

    $: inProgress = getEntryIDs($savedEntries, { archived: false })
    $: archived = getEntryIDs($savedEntries, { archived: true })

    const getEntryIDs = (saved: Record<string, Entry>, { archived = false }): string[] => 
        Object.entries(saved)
            .filter(([_id, entry]) => (entry.archived ?? false) == archived)
            .map(([id, _entry]) => id)

    const labelNewImage = async () => {
        disabled = true

        try {
            const { id } = await getUnclaimed()
    
            $goto(`/labeler/${id}`)
        } catch (error) {
            notifications.error('Coud not get a new image', error)
            disabled = false
            console.error(error)
        }
    }
</script>

<Flex justify='between' align='start' span column>
    {#if inProgress.length == 0 && archived.length == 0}
        <Onboard />
    {:else}
        <Header />
        
        {#if inProgress.length > 0}
            <Spacer s={6} />
            <ImageRow 
                label='in progress'
                images={inProgress}
                on:select={({ detail: { id } }) => selectedImageID = id} 
            />
        {/if}

        {#if archived.length > 0}
            <Spacer s={6} />
            <ImageRow 
                label='archived'
                images={archived}
                on:select={({ detail: { id } }) => selectedImageID = id} 
            />
        {/if}
    {/if}

    <div class='footer'>
        <Button on:click={labelNewImage} {disabled}>
            label a new image
        </Button>
    </div>
</Flex>

<SelectedImageModal bind:id={selectedImageID} />

<style>    
    .footer {
        display: flex;
        width: 100%;
        justify-content: center;
        position: absolute;
        left: 0;
        bottom: var(--s-8);
    }
</style>