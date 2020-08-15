<script lang='ts'>
    import { Carousel } from '@lib/components'    
    import TutorialSection from './TutorialSection.svelte'    

    const spacer = '<div style=\'height: var(--s-6);\'></div>'
    const tutorials = [
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

    const sections = tutorials.map(({ title, body }) => ({
        component: TutorialSection as SvelteComponent,
        props: { title, body },
    }))
</script>

<Carousel {sections} />
