<script lang='ts'>
    import { goto } from '@sveltech/routify'
    import { getUnclaimed } from '@gql'
    import { Button, Flex, H4, Spacer } from '@ollopa/cedar'

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

    <div class="footer">
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