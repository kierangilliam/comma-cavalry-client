<svelte:window bind:innerWidth />

<script lang='ts'>
    import { Modal, DisplacementFilter } from '@lib/components'
    import { Button, Flex, H4, Spacer } from '@ollopa/cedar'
    import { goto } from '@sveltech/routify'
    import { getImage, submitMask } from '@gql'
    import { deleteEntry, getEntry, archiveEntry } from '@lib/storage'
    import { notifications } from '@lib/notifications'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'
    import type { User } from '@lib/types'
    import { setCSSVar, waitForEvent, getCSSVarPx } from '@lib/utils'
    import UserModal from './UserModal.svelte'
    import { MaskRenderer } from '@lib/editor-renderer'
import { tick } from 'svelte';

    export let id: string

    let innerWidth: number
    let loading = false

    $: imageScale = setImageScale(innerWidth)
    $: entry = getEntry(id)

    const setImageScale = (_) => {
        const maxModalWidth = getCSSVarPx('maxModalWidth')
        const scale = Math.min(innerWidth, maxModalWidth) / IMAGE_WIDTH

        setCSSVar(['selectedImageScale', `${scale}`])

        return scale
    }

    const gotoEditor = () => $goto(`/labeler/${id}`)  

    const remove = async () => {
        if (await notifications.confirm('Are you sure?')) {
            deleteEntry(id)
            id = null
        }
    }
    
    const archive = async () => {
        archiveEntry(id)
        id = null
    }

    const getUser = async (): Promise<User> => {    
        return waitForEvent<User>(UserModal, { active: true }, 'submit', 'cancel')        
    }

    const submitForReview = async () => {
        loading = true

        try {
            const user = await getUser()
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const { paths } = getEntry(id)
            const renderer = new MaskRenderer()

            renderer.ctx = ctx
            canvas.width = IMAGE_WIDTH
            canvas.height = IMAGE_HEIGHT

            renderer.drawAllPaths({ paths, drawTruePathColors: true })

            const blob = await fetch(canvas.toDataURL('image/png')).then(r => r.blob())

            await submitMask(id, user.name, user.email, blob)

            notifications.success(
                'Success!', 
                'Your mask was sent to your email. Check your spam folder if you do not see it.',
            )
        } catch (error) {
            if (error.message !== 'user canceled operation') {
                notifications.error('Could not submit', error.message)
            }                
        } finally {
            loading = false
        }
    }
    
</script>

<Modal bind:active={id} padding={{ x: '0', y: '0' }}>
    {#await getImage(id)}
        ...
    {:then { url, depthMapUrl }}
        <div class='img-container'>
            <DisplacementFilter 
                scale={imageScale}
                drift={15}
                source={url}
                map={depthMapUrl}
            />
        </div>        
    {/await}

    <div class='details'>
        <H4>image {id}</H4>

        {#if entry.archived}
            <p>Archived</p>
        {/if}

        <Spacer s={8} />

        <Flex justify='around' stretch>
            {#if entry.archived}
                <Button on:click={remove} stretch outline disabled={loading} warn>delete</Button>
            {:else}
                <Button on:click={archive} stretch outline disabled={loading} warn>archive</Button>
            {/if}
            <Spacer s={4} />
            <Button on:click={gotoEditor} stretch disabled={loading} small>edit</Button>
        </Flex>

        <Spacer s={4} />

        <Button on:click={submitForReview} outline disabled={loading} stretch>
            email me this mask
        </Button>
    </div>
</Modal>

<style>
    .img-container {
        --selectedImageHeight: calc(874px * var(--selectedImageScale));                
        position: relative;
        width: 100%;
        overflow: hidden;  
        /* multipy by .9 to cut off some of the bottom y values */
        height: calc(.9 * var(--selectedImageHeight));        
    }
    
    .details {
        padding: var(--modalPaddingY) var(--modalPaddingX);
    }
</style>