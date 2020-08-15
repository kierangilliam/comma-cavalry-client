<script lang='ts'>
    import { goto } from '@sveltech/routify'
    import { getUnclaimed } from '@gql'
    import { Header } from '@lib/components'
    import { Button, Flex, Spacer } from '@ollopa/cedar'
    import InProgress from './_lib/InProgress.svelte'

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
    <Header />

    <Spacer s={6} />
    
    <InProgress />

    <div class='footer'>
        <Button on:click={labelNewImage} {disabled}>
            label a new image
        </Button>
    </div>
</Flex>

<style>    
    .footer {
        display: flex;
        width: 100%;
        justify-content: center;
        position: fixed;
        bottom: var(--s-8);
    }
</style>