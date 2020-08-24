<script lang='ts'>
    import { goto } from '@sveltech/routify'
    import { getUnclaimed, getInProgress as getInProgressQuery } from '@gql'
    import { Header } from '@lib/components'
    import { notifications } from '@lib/notifications'
    import { savedEntries, getEntry, saveEntry } from '@lib/storage'
    import type { Entry } from '@lib/storage'
    import { Button, Flex, Spacer } from '@ollopa/cedar'
    import ImageRow from './_lib/ImageRow.svelte'
    import Onboard from './_lib/Onboard.svelte'
    import SelectedImageModal from './_lib/SelectedImageModal.svelte'    
    import DiscordUsernameModal from './_lib/DiscordUsernameModal.svelte'
    import { waitForEvent } from '@lib/utils'

    let disabled = false
    let selectedImageID: string = null

    $: inProgress = getEntryIDs($savedEntries, { archived: false })
    $: archived = getEntryIDs($savedEntries, { archived: true })

    const getEntryIDs = (saved: Record<string, Entry>, { archived = false }): string[] => 
        Object.entries(saved)
            .filter(([_id, entry]) => (entry.archived ?? false) == archived)
            .map(([id, _entry]) => id)

    const getInProgress = async () => {
        disabled = true 

        try {
            const { username } = await waitForEvent(DiscordUsernameModal, { active: true }, 'submit', 'cancel')
            const { images } = await getInProgressQuery(username)

            // If the entry already exists, save it as is
            // if not, create a new entry
            images.forEach(({ id }) => {
                const entry = getEntry(id)

                saveEntry(id, { ...entry })
            })
        } catch(error) {
            notifications.error('Coud not get a new image', error)
            disabled = false
            console.error(error)
        } finally {
            disabled = false
        }
    }

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

    const selectImage = ({ detail: { id } }) => selectedImageID = id
</script>

<Flex justify='between' align='start' span column>
    {#if inProgress.length == 0 && archived.length == 0}
        <Onboard />
    {:else}
        <Header />
        
        {#if inProgress.length > 0}
            <Spacer s={6} />
            <ImageRow label='in progress' images={inProgress} on:select={selectImage} />
        {/if}

        {#if archived.length > 0}
            <Spacer s={6} />
            <ImageRow label='archived' images={archived} on:select={selectImage} />
        {/if}
    {/if}
    
    <div class='footer'>
        <Button on:click={getInProgress} {disabled}>get in progress</Button>
        <div id='random-image' on:click={labelNewImage}>Or, get a random unlabeled image.</div>
    </div>
</Flex>

<SelectedImageModal bind:id={selectedImageID} />

<style>    
    .footer {
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        bottom: var(--viewPaddingBottom);
    }
    .footer #random-image {
        margin-top: var(--s-2);
        color: var(--primary);
        font-size: var(--textSmall);
    }
</style>