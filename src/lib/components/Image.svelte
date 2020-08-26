<!-- 
    Lazily load image
    Caller passes a promise to a url 
 -->
<script lang='ts'>
    import { createEventDispatcher } from 'svelte'
    import { fly } from 'svelte/transition'
    import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@lib/constants'
    import { loadImageFromUrl } from '@lib/utils'

    export let url: Promise<string> | string
    export let alt: string = ''
    export let scale = .25
    export let hoverable: boolean = false
    export let i = 0 // to delay the image flying in by i * 100ms

    const dispatch = createEventDispatcher()
        
    const style = `
        --displayHeight: calc(${IMAGE_HEIGHT}px * ${scale});
        --displayWidth: calc(${IMAGE_WIDTH}px * ${scale});
    `

    const loadImage = async (): Promise<string> => {
        const _url = await url
        await loadImageFromUrl(_url, { anonymous: false })
        
        return _url
    }
</script>

{#await loadImage()}
    <div {style} class:hoverable class='loading-placeholder'></div>
{:then url} 
    <img 
        on:click={() => dispatch('click')}
        {style}
        class:hoverable
        in:fly={{ x: -50, duration: 750, delay: 100 * i }} 
        src={url} 
        {alt}
    >
{:catch error} 
    Could not load image: {error}
{/await}

<style>
    img, .loading-placeholder {
        --shadowOffset: 3px;
        --shadow: calc(-1 * var(--shadowOffset));
        object-fit: cover;
        height: var(--displayHeight);
        width: var(--displayWidth);
        filter: drop-shadow(var(--shadow) var(--shadow) 0px rgba(247, 247, 247, 0.25));
        padding-top: var(--shadowOffset);
        padding-left: var(--shadowOffset);
        transition: all 250ms;
    }

    .hoverable:hover {
        cursor: pointer;
        --shadowOffset: 1.5px;
        transform: scale(.93);
    }

    .loading-placeholder {
        background: var(--white);
        animation: var(--glowAnimation);
    }    
</style>