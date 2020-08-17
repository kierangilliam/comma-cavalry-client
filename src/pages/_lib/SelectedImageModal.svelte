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
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)        
        // TODO .9 is modal viewport width
        const MODAL_VW = .9
        const scale = (innerWidth * MODAL_VW + (rem * 2.2)) / IMAGE_WIDTH
        
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

<Modal bind:active={id}>
    {#await getImage(id)}
        ...
    {:then { url, depthMapUrl }}
        <div class='img-container'>
            <div class="img">
                <DisplacementFilter 
                    scale={imageScale}
                    drift={15}
                    source={url}
                    map={depthMapUrl}
                />
            </div>
        </div>        
    {/await}

    <Spacer s={8} />

    <H4>image {id}</H4>
    <p>Some text</p>

    <Spacer s={8} />

    <Flex justify='around' stretch>
        <Button on:click={deleteImage} stretch outline warn>delete</Button>
        <Spacer s={4} />
        <Button on:click={gotoEditor} stretch small>edit</Button>
    </Flex>

    <Spacer s={4} />

    <Button on:click={submitForReview} outline stretch>submit for review</Button>
</Modal>

<style>
    :root {        
        --selectedImageHeight: calc(874px * var(--selectedImageScale));                
        --selectedImageWidth: calc(1164px * var(--selectedImageScale));                
    }

    .img-container {
        position: relative;
        height: var(--selectedImageHeight);        
        width: 100vw;
        margin-left: -2.2rem;
        margin-top: -4.4rem;
        overflow: hidden;  
    }

    .img {
        position: absolute;
        top: 2.2rem;
    }
</style>