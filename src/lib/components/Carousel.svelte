<script lang='ts'>
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
    let container: HTMLElement

    $: inFocusSectionHeight = sectionHeights && 
        sectionHeights[sectionIndex]
    // TODO 32 is an arbitrary margin
    $: sectionStyle = `
        width: ${sectionWidth}px; 
        margin: 0 32px;
    `
    // TODO 40 is an arbitrary offset
    $: containerStyle = sectionWidth && `
        height: ${inFocusSectionHeight + 40}px;
        width: ${sectionWidth * sections.length}px;
        transform: translateX(${-$xPos}px); 
    `

    const calculateSectionHeights = () => {        
        sectionHeights = Array.from(container.children).map(c => 
            Array.from(c.children).reduce((acc, e) => 
                acc + e.getBoundingClientRect().height
            , 0)
        )
    }

    onMount(async () => {
        const VELOCITY_THRESHOLD = 1
        let xStart = $xPos
        let isFirstTouch = true
        gestures = new Hammer(container)
        sectionWidth = container.clientWidth

        // Wait to calculate heights until after pending state 
        // changes have been applied to the DOM
        await tick()
        calculateSectionHeights()

        container.addEventListener('touchstart', () => {
            isFirstTouch = true
        })        

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
                sectionIndex = type === 'panleft'
                    ? Math.min(++sectionIndex, sections.length - 1)
                    : Math.max(--sectionIndex, 0)
                
                // Disable pan if we surpassed a threshold
                gestures.get('pan').set({ enable: false })
            }             
        })

        container.addEventListener('touchend', () => {
            $xPos = sectionIndex * sectionWidth      
            gestures.get('pan').set({ enable: true })
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
        transition: height 250ms ease-out;
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