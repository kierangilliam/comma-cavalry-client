<script lang='ts'>
    import { Modal } from '@lib/components'
    import { Button, Flex, H4, Spacer } from '@ollopa/cedar'
    import { goto } from '@sveltech/routify'
    import { getImage } from '@gql'
    import { deleteEntry } from '@lib/storage'

    export let id: string

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
    {:then { url }}
        <div class='img-container'>
            <img src={url} alt={id}>
        </div>
    {/await}

    <Spacer s={8} />

    <H4>image {id}</H4>
    <p>Some text</p>

    <Spacer s={8} />

    <Flex justify='around' stretch>
        <Button on:click={deleteImage} small outline warn>delete</Button>
        <Button on:click={submitForReview} outline small>submit for review</Button>
        <Button on:click={gotoEditor} small>edit</Button>
    </Flex>
</Modal>

<style>
    :root {
        --selectedImageHeight: 200px;                
    }

    .img-container {
        position: relative;
        height: var(--selectedImageHeight);        
        width: 120%;
        margin-left: -10%;
    }

    img {
        position: absolute;
        --offset: calc(var(--selectedImageHeight) / 2 * -1);
        bottom: 0;
        width: 100%;
        object-fit: cover;
    }

    /* .details {
        padding: var(--s-4) 0;
    } */
</style>