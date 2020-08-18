<script lang='ts'>
    import { goto } from '@sveltech/routify'
    import { getUnclaimed } from '@gql'
    import { Header } from '@lib/components'
    import { savedEntries } from '@lib/storage'
    import { Button, Flex, Spacer } from '@ollopa/cedar'
    import ImageRow from './_lib/ImageRow.svelte'
    import Onboard from './_lib/Onboard.svelte'
    import SelectedImageModal from './_lib/SelectedImageModal.svelte'

    let disabled = false
    let selectedImageID: string = null

    $: inProgress = getInProgress($savedEntries)

    const getInProgress = (saved) => 
        Object.entries(saved).map(([id]) => ({ id }))

    const labelNewImage = async () => {
        disabled = true

        try {
            const { id } = await getUnclaimed()
    
            $goto(`/labeler/${id}`)
        } catch (error) {
            window.alert(error)
            disabled = false

            console.error(error)
        }
    }
</script>

<Flex justify='between' align='start' span column>
    {#if inProgress.length > 0}
        <Header />

        <Spacer s={6} />

        <ImageRow 
            label='in progress'
            on:select={({ detail: { id } }) => selectedImageID = id} 
        />
    {:else}
        <Onboard />
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
        bottom: var(--s-8);
    }
</style>