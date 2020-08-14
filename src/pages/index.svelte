<script lang='ts'>
    import { goto } from '@sveltech/routify'
    import { getUnclaimed } from '@gql'
    import { getSaved } from '@lib/storage'
    import { Button, Flex, H1, Spacer } from '@ollopa/cedar'
    import InProgress from './_inProgress.svelte'

    let disabled = false


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
    <Flex>
        <img id="logo" src="/comma.svg" alt="logo">
        <H1>cavalry</H1>
    </Flex>

    <Spacer s={6} />
    
    <InProgress />

    <div class='footer'>
        <Button on:click={labelNewImage} {disabled}>
            label a new image
        </Button>
    </div>
</Flex>

<style>
    #logo {
        height: var(--s-8);
        margin-right: var(--s-2);
    }
    .footer {
        display: flex;
        width: 100%;
        justify-content: center;
        position: fixed;
        bottom: var(--s-8);
    }
</style>