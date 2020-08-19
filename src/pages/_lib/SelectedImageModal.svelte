<svelte:window bind:innerWidth />

<script lang='ts'>
    import { Modal, DisplacementFilter } from '@lib/components'
    import { Button, Flex, H4, Spacer } from '@ollopa/cedar'
    import { goto } from '@sveltech/routify'
    import { getImage, submitMask } from '@gql'
    import { deleteEntry, getEntry } from '@lib/storage'
    import { notifications } from '@lib/notifications'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'
    import type { User } from '@lib/types'
    import { setCSSVar, waitForEvent, getCSSVarPx } from '@lib/utils'
    import { drawPaths } from '../labeler/_lib/viewport/canvas-helpers'
    import CreateUserModal from './CreateUserModal.svelte'

    export let id: string

    let innerWidth: number
    let loading = false

    $: imageScale = setImageScale(innerWidth)

    const setImageScale = (_) => {
        const maxModalWidth = getCSSVarPx('maxModalWidth')
        const scale = Math.min(innerWidth, maxModalWidth) / IMAGE_WIDTH

        setCSSVar(['selectedImageScale', `${scale}`])

        return scale
    }

    const gotoEditor = () => $goto(`/labeler/${id}`)  

    const deleteImage = async () => {
        if (await notifications.confirm('Are you sure?')) {
            deleteEntry(id)
            id = null
        }
    }

    const getUser = async (): Promise<User> => {    
        // TODO Save user to localstorage
        return waitForEvent<User>(CreateUserModal, { active: true }, 'submit', 'cancel')        
    }

    const submitForReview = async () => {
        loading = true

        try {
            const user = await getUser()
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const { paths } = getEntry(id)

            canvas.width = IMAGE_WIDTH
            canvas.height = IMAGE_HEIGHT

            drawPaths({ ctx, paths, renderTruePathColors: true })

            const mask = canvas.toDataURL('image/png')

            await submitMask(id, user.name, user.email, mask)
        } catch (error) {
            console.log(error.message)
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

        <Spacer s={8} />

        <Flex justify='around' stretch>
            <Button on:click={deleteImage} stretch outline disabled={loading} warn>delete</Button>
            <Spacer s={4} />
            <Button on:click={gotoEditor} stretch disabled={loading} small>edit</Button>
        </Flex>

        <Spacer s={4} />

        <Button on:click={submitForReview} outline disabled={loading} stretch>
            submit for review
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