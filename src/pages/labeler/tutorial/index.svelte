<script lang='ts'>
    import { H4, Flex } from '@ollopa/cedar'
    import Hammer from 'hammerjs'
    import { onMount } from 'svelte'
    import { tweened } from 'svelte/motion'
    import { elasticOut } from 'svelte/easing'

    const spacer = '<div style=\'height: var(--s-6);\'></div>'
    const sections = [
        {
            title: 'what to do',
            body: `
                Draw on the image until the it is entirely filled with color.
                ${spacer}
                You are creating a ‘mask’ that will help comma ai’s cars drive themselves.
                ${spacer}
                Once you are finished with a mask you can submit it for review.
            `,
        },
        {
            title: 'drawing',
            body: `
                Tap on a color to select it.
                ${spacer}
                Additional taps will cycle through your drawing tools.
                ${spacer}
                Brush and fill work similar to all types of drawing apps.
                ${spacer}
                The auto line tries to detect lines in the image and draw them onto the mask. Auto line sucks right now.
                `,
            },
        {
            title: 'moving around',
            body: `
                In the editor, press finger down for half a second to toggle ‘move mode’. 
                ${spacer}
                In move mode, drag your finger across the screen to pan around. 
                ${spacer}
                When you are done, hold your finger down to switch back into drawing mode.
            `,
        },
        {
            title: 'zooming',
            body: `
                Pinch to zoom in and out. 
                ${spacer}
                This also automatically enables move mode after you release.
            `,
        },
    ]

    const xPos = tweened(0, {
        duration: 3000,
        easing: elasticOut,
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

            const MAX_PAN = xStart + (width/2)
            const MIN_PAN = xStart - (width/2)
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
    {#each sections as { title, body }, i}
        <div class='section' style={sectionStyle}>
            <Flex>
                <H4>{title}</H4>
            </Flex>
    
            <p>{@html body}</p>
        </div>
    {/each}
</div>

{sectionIndex}

<style>
    .container {
        display: flex;
        overflow-x: hidden;
        touch-action: none;
    }

    div.section {        
        flex-shrink: 0; /* do not shrink */
    }
</style>