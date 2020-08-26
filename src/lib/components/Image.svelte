<!-- 
    Lazily load image
    Caller passes a promise to a url 
 -->
<script lang='ts'>
    import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@lib/constants'
    import { loadImageFromUrl } from '@lib/utils'
    import { fly } from 'svelte/transition'

    export let url: Promise<string>
    export let alt: string = ''
    export let scale = .25
    export let i = 0 // to delay the image flying in by i * 100ms

    const style = `
        --displayHeight: calc(${IMAGE_HEIGHT}px * ${scale});
        --displayWidth: calc(${IMAGE_WIDTH}px * ${scale});
    `

    const loadImage = async (): Promise<string> => {
        const _url = await url
        await loadImageFromUrl(_url)
        
        return _url
    }
</script>

{#await loadImage()}
    <div {style} class='loading-placeholder'></div>
{:then url} 
    <img 
        {style}
        in:fly={{ x: -50, duration: 750, delay: 100 * i }} 
        src={url} 
        {alt}
    >
{:catch error} 
    Could not load image: {error}
{/await}

<style>
    img, .loading-placeholder {
        --shadow: calc(-1 * var(--shadowOffset));
        object-fit: cover;
        height: var(--displayHeight);
        width: var(--displayWidth);
        filter: drop-shadow(var(--shadow) var(--shadow) 0px rgba(247, 247, 247, 0.25));
    }
    .loading-placeholder {
        background: var(--white);
        animation: var(--glowAnimation);
    }    
</style>