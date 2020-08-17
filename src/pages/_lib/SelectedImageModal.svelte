<svelte:window bind:innerWidth />

<script lang='ts'>
    import { Modal, DisplacementFilter, Stats } from '@lib/components'
    import { Button, Flex, H4, Spacer } from '@ollopa/cedar'
    import { goto } from '@sveltech/routify'
    import { getImage } from '@gql'
    import { deleteEntry } from '@lib/storage'
    import { IMAGE_WIDTH } from '@lib/constants'
    import { setCSSVar } from '@lib/utils'

    export let id: string

    let innerWidth: number

    $: imageScale = setImageScale(innerWidth)

    const setImageScale = (_) => {
        const scale = innerWidth / IMAGE_WIDTH
        
        setCSSVar(['selectedImageScale', `${scale}`])

        return scale
    }

    const gotoEditor = () => $goto(`/labeler/${id}`)  

    const deleteImage = () => {
        if (window.confirm('Are you sure?')) {
            deleteEntry(id)
            id = null
        }
    }

    const submitForReview = () => {
        window.alert('Coming soon')
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
        <p>Some text</p>

        <Spacer s={8} />

        <Flex justify='around' stretch>
            <Button on:click={deleteImage} stretch outline warn>delete</Button>
            <Spacer s={4} />
            <Button on:click={gotoEditor} stretch small>edit</Button>
        </Flex>

        <Spacer s={4} />

        <Button on:click={submitForReview} outline stretch>
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