
<script>
    import { quartOut } from 'svelte/easing'
    import { tweened } from 'svelte/motion'
    import Fade from './Fade.svelte'

    export let error = false

    const errorTween = tweened(0, { duration: 1500, easing: quartOut })

    /**
     * When an error occurs we set the image's style to 'errorStyle'
     * which tweens the color to red. We do it this way because
     * this cannot be done using a css animaiton.
     * Filter computed using 'black to filter' converter 
     * https://codepen.io/sosuke/pen/Pjoqqp (Target color #f0645b)
    */
    $: error && ($errorTween = 1)
    $: errorStyle = error 
        ? `
            filter: 
                brightness(0%)            
                invert(68%) 
                sepia(38%) 
                saturate(4173%) 
                hue-rotate(318deg) 
                brightness(${$errorTween * 91}%) 
                contrast(${$errorTween * 108}%)
                drop-shadow(0px 3px 12px rgba(240, 100, 1, ${.8 * $errorTween}))
            ;` 
        : ''
</script>

<div class="logo-container">    
    <img 
        src="/comma.svg" 
        alt="logo" 
        class:error 
        style={errorStyle}
    />      
</div>

<div>
    {#if !error}
        <slot></slot>
    {/if}   
        
    <Fade visible={error}>
        <slot name="error" />
    </Fade>  
</div>

<style>
    div {
        position: absolute;
        top: 50vh;
        left: 0;
        width: 100vw;
        height: 50vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    div.logo-container {
        top: 0;
        height: 100vh;
    }
    
    img {
        flex: 1;
        width: 70px;
        margin-bottom: var(--s-4);
        animation: var(--glowAnimation);
        /* Add padding so that the dropshadow does not get cut off */
        padding-left: 14px;
        padding-right: 14px;
    }
    img.error {
        animation: none;
    }
</style>