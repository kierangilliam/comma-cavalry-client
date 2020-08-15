<script lang='ts'>
    import { Flex } from '@ollopa/cedar'
    import Hammer from 'hammerjs'
    import { onMount } from 'svelte'
    import { tweened } from 'svelte/motion'

    export let sections: { component: SvelteComponent, props: any }[]

    const xPos = tweened(0, {
        duration: 2000,
        // Svelte's elastic out is far too aggressive for this use-case
        easing: (t: number) => {
            const passiveness = 2.5 // 2 is
            const backAndForthAmount = -18.0
            return (
                Math.sin( (-13.0 * (t + 1.0) * Math.PI) / 2) 
                * Math.pow(passiveness, backAndForthAmount * t) 
                + 1.0
            );
        },
    })

    let surpassedThreshold = false
    let width = null
    let sectionIndex = 0
    let gestures: HammerManager
    let container: HTMLElement

    $: sectionStyle = `width: ${width}px;`
    $: containerStyle = width && `
        width: ${width * sections.length}px;
        transform: translateX(${-$xPos}px); 
    `

    $: gestures && (
        // Disable pan if we surpassed a threshold
        gestures.get('pan').set({ enable: !surpassedThreshold })
    )

    onMount(() => {
        const VELOCITY_THRESHOLD = 1.25
        let xStart = $xPos
        let isFirstTouch = true
        gestures = new Hammer(container)
        width = container.clientWidth

        container.addEventListener('touchstart', () => {
            isFirstTouch = true
        })

        gestures.on('panleft panright', ({ deltaX, velocityX }) => {            
            if (isFirstTouch) {
                xStart = $xPos
                isFirstTouch = false                
            }

            const MAX_PAN = xStart + (width / 2)
            const MIN_PAN = xStart - (width / 2)
            
            $xPos = -deltaX + xStart

            // Next
            if (
                -1 * velocityX > VELOCITY_THRESHOLD
                || $xPos > MAX_PAN
            ) {
                sectionIndex = Math.min(sections.length - 1, ++sectionIndex)
                surpassedThreshold = true
            } 
            
            // Previous
            else if (
                velocityX > VELOCITY_THRESHOLD
                || $xPos < MIN_PAN
            ) {
                sectionIndex = Math.max(0, --sectionIndex)
                surpassedThreshold = true
            }            
        })

        container.addEventListener('touchend', () => {
            $xPos = sectionIndex * width      
            surpassedThreshold = false      
        })
    })
</script>

<div 
    class='container' 
    style={containerStyle} 
    bind:this={container}
>
    {#each sections as { component, props }}
        <div class='section' style={sectionStyle}>            
            <svelte:component this={component} {...props} />
        </div>
    {/each}
</div>

<Flex stretch>
    {#each sections as _, i}
        <div 
            class='bubble' 
            class:active={sectionIndex === i}
        ></div>
    {/each}
</Flex>

<style>
    .container {
        display: flex;
        overflow-x: hidden;
        touch-action: none;
    }

    div.section {        
        flex-shrink: 0; /* do not shrink */
    }

    .bubble {
        --bubbleSize: 16px;
        margin: 0 var(--s-2);
        width: var(--bubbleSize);
        height: var(--bubbleSize);
        transition: all 250ms ease-out;
    }
    .bubble.active {
        background: var(--white);
    }
</style>