<script lang='ts'>
    import { isDesktop } from '@lib/capacitor'
    import { Flex } from '@ollopa/cedar'
    import Hammer from 'hammerjs'
    import { onMount, tick } from 'svelte'
    import { tweened } from 'svelte/motion'

    export let sections: { component: SvelteComponent, props: any }[]
    export let sectionIndex = 0

    const xPos = tweened(0, {
        duration: 2000,
        // Svelte's elastic out is far too aggressive for this use-case
        easing: (t: number) => {
            const passiveness = 2.5
            const backAndForthAmount = -25.0
            return (
                Math.sin( (-13.0 * (t + 1.0) * Math.PI) / 2) 
                * Math.pow(passiveness, backAndForthAmount * t) 
                + 1.0
            );
        },
    })

    let sectionWidth = null
    let sectionHeights = null
    let gestures: HammerManager
    let carousel: HTMLElement

    $: inFocusSectionHeight = sectionHeights && 
        sectionHeights[sectionIndex]
    // TODO 32 is an arbitrary margin
    $: sectionStyle = `
        width: ${sectionWidth}px; 
        margin: 0 32px;
    `
    // TODO 40 is an arbitrary offset
    $: carouselStyle = sectionWidth && `
        height: ${inFocusSectionHeight + 40}px;
        width: ${sectionWidth * sections.length}px;
        transform: translateX(${-$xPos}px); 
    `

    const inc = () => sectionIndex = Math.min(++sectionIndex, sections.length - 1)
    
    const dec = () => sectionIndex = Math.max(--sectionIndex, 0)

    const calculateSectionHeights = () => {        
        sectionHeights = Array.from(carousel.children).map(c => 
            Array.from(c.children).reduce((acc, e) => 
                acc + e.getBoundingClientRect().height
            , 0)
        )
    }

    const finalize = () => {
        $xPos = sectionIndex * sectionWidth
        gestures.get('pan').set({ enable: true })
    }

    onMount(async () => {
        const VELOCITY_THRESHOLD = 1
        let xStart = $xPos
        let isFirstTouch = true
        gestures = new Hammer(carousel)
        sectionWidth = carousel.clientWidth

        // Wait to calculate heights until after pending state 
        // changes have been applied to the DOM
        await tick()
        calculateSectionHeights()

        carousel.addEventListener('touchstart', () => isFirstTouch = true)        
        carousel.addEventListener('mousedown', () => isFirstTouch = true)        

        gestures.on('panleft panright', ({ type, deltaX, velocityX }) => {            
            if (isFirstTouch) {
                xStart = $xPos
                isFirstTouch = false                
            }

            const exceedsVelocityThreshold = Math.abs(velocityX) > VELOCITY_THRESHOLD
            const maxPan = xStart + (sectionWidth / 2)
            const minPan = xStart - (sectionWidth / 2)
            const gotoNext = $xPos > maxPan
            const gotoPrevious = $xPos < minPan
            
            $xPos = -deltaX + xStart
            
            if (exceedsVelocityThreshold || gotoNext || gotoPrevious) {
                if (type === 'panleft') inc()
                else dec()
                
                // Disable pan if we surpassed a threshold
                gestures.get('pan').set({ enable: false })
            }             
        })

        carousel.addEventListener('touchend', finalize)
        carousel.addEventListener('mouseup', finalize)
    })

    if (isDesktop) {
        document.addEventListener('keyup', ({ key, cancelBubble }) => {
            if (key === 'ArrowRight') {
                inc() 
                finalize()
            }
            else if (key === 'ArrowLeft') {
                dec()
                finalize()
            }
        }, {})
    }
</script>

<div 
    class='carousel' 
    style={carouselStyle} 
    bind:this={carousel}
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
            on:click={() => { sectionIndex = i; finalize() }}
        ></div>
    {/each}
</Flex>

<style>
    .carousel {
        display: flex;
        overflow-x: hidden;
        touch-action: none;
        transition: height 250ms ease-out;
    }

    .bubble {
        --bubbleSize: 16px;
        margin: 0 var(--s-2);
        width: var(--bubbleSize);
        height: var(--bubbleSize);
        transition: all 250ms ease-out;
        cursor: pointer;
    }
    .bubble.active {
        background: var(--white);
    }
</style>