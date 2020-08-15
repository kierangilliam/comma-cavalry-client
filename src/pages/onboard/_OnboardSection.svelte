<script>
    import { H4, Flex, Spacer } from '@ollopa/cedar'

    export let title
    export let image
    export let body
</script>

<Flex column>
    <H4>{title}</H4>

    <Spacer s={4} />
    
    <img src={image} alt={title}>
    
    <Spacer s={4} />

    <p>{body}</p>
</Flex>

<style>
    img {
        border: var(--line);
        border-radius: var(--borderRadius);
        width: 100%;
        min-height: 40px;
        max-height: 200px;
    }

    p {
        width: 80%;
    }
</style>