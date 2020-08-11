<script lang='ts'>
    import { goto } from '@sveltech/routify'
    import { getUnclaimed } from '@gql'
    import { getSaved } from '@lib/storage'
    import { Button, Flex, H4, Spacer } from '@ollopa/cedar'
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

<Flex justify='between' span column>
    <H4>comma cavalry</H4>

    <Spacer s={12} />
    
    <InProgress />

    <Spacer s={12} />

    <div class='footer'>
        <Button on:click={labelNewImage} {disabled}>
            label a new image
        </Button>
    </div>
</Flex>

<style>
    .footer {
        position: absolute;
        bottom: var(--s-8);
    }
</style>