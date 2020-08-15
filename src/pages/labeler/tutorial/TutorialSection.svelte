<script>
    import { H4, Flex } from '@ollopa/cedar'

    export let title, body
</script>

<Flex>
    <H4>{title}</H4>
</Flex>

<p>{@html body}</p>