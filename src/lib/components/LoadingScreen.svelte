
<script>
    import { expoOut, quartOut } from 'svelte/easing'
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
        top: 50%;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    div.logo-container {
        top: 0;
    }
    
    img {
        flex: 1;
        width: 50px;
        margin-bottom: var(--s-4);
        animation: fade 2s ease-in-out alternate infinite;        
    }
    img.error {
        animation: none;
    }

    @keyframes fade {
        from { 
            opacity: 0; 
            filter: drop-shadow(0px 3px 0px rgba(255, 255, 255, 0.2));
        }
        to { 
            opacity: 1; 
            filter: drop-shadow(0px 3px 10px rgba(255, 255, 255, 0.4));
        }
    }       
</style>