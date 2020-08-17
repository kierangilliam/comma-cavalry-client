<script>
    import { H4, Flex, Spacer } from '@ollopa/cedar'

    export let title, body
</script>

<Flex>
    <H4>{title}</H4>
</Flex>

<Spacer s={4} />

<p>{@html body}</p>

<style>
    p {
        line-height: 2rem;
    }
</style>