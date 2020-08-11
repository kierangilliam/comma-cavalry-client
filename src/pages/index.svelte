<script lang='ts'>
    import { url } from '@sveltech/routify'
    import { getUnclaimed } from '@gql'
    import { Button } from '@ollopa/cedar'

    let disabled = false

    const labelNewImage = async () => {
        disabled = true

        const image = await getUnclaimed()

        console.log(image)

        disabled = false
    }
</script>

<div style='padding-top: 200px;'>
    <a  href={$url('/labeler')}>Labeler</a>
</div>

<Button on:click={labelNewImage} {disabled}>
    label a new image
</Button>