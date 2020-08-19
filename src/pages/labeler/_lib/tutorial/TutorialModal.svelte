<script lang='ts'>
    import { Carousel, Modal } from '@lib/components'    
    import TutorialSection from './TutorialSection.svelte'    
    import { PATH_COLORS } from '@lib/constants'
    import { showTutorial } from '../state'
import { isDesktop } from '@lib/capacitor';

    const bold = (text) => `<span style=\'font-weight: bolder;\'>${text}</span>`

    const spacer = '<div style=\'height: var(--s-6);\'></div>'

    const color = (name: keyof typeof PATH_COLORS) => {
        const color = PATH_COLORS[name]
        let textColor = 'var(--white)'

        if (name === 'undrivable')   textColor = '#331f15'
        else if (name === 'movable') textColor = '#22441f'
        
        return `
            <span style='
                padding: var(--s-1) var(--s-2);
                color: ${textColor}; 
                background: ${color};
                font-weight: bolder;
                border-radius: 5px;
                margin-right: var(--s-2);
                box-shadow: inset 0px -2.5px 0 rgba(12, 12, 12, .2);
            '>
                ${name}
            </span>
        `
    }

    const tutorials = [
        {
            title: 'what to do',
            body: `
                Draw on the image until the it is entirely filled with color.
                ${spacer}
                You are creating a ${bold('mask')} that will help comma ai’s cars drive themselves.
                ${spacer}
                Once you are finished with a mask you can submit it for review.
            `,
        },
        {
            title: 'color guide',
            body: `
                ${color('road')} All parts, anywhere nobody would look at you funny for driving.
                ${spacer}
                ${color('movable')} Vehicles, people, or animals.
                ${spacer}
                ${color('undrivable')} Sky, highway barrier, etc.
            `,
        },
        {
            title: 'color guide pt. 2',
            body: `
                ${color('lane markings')} Don't include non lane markings like turn arrows and crosswalks.
                ${spacer}
                ${color('ego')} My car and anything inside it, including wires, mounts, etc. No reflections.
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
                ${
                    // Autoline is disabled on mobile 
                    // because of performance reasons
                    !isDesktop
                    ? ''
                    : `${spacer}
                        The auto line tries to detect lines in the image and draw them onto the mask.
                    `
                }                
            `,
            },
        {
            title: 'moving around',
            body: `
                In the editor, press finger down for half a second to toggle ${bold('move mode')}. 
                ${spacer}
                In move mode, drag your finger across the screen to pan around. 
                ${spacer}
                When you are done, hold your finger down to switch back into drawing mode.
            `,
        },
        {
            title: 'zooming and more',
            body: `
                Pinch to zoom in and out. 
                ${spacer}
                This also automatically enables move mode after you release.
                ${spacer}
                Lastly, swipe the bottom drawer up to access more controls.
            `,
        },
    ]

    const sections = tutorials.map(({ title, body }) => ({
        component: TutorialSection as SvelteComponent,
        props: { title, body },
    }))
</script>

<Modal 
    bind:active={$showTutorial}
    padding={{ x: '0' }}
>
    <Carousel {sections} />
</Modal>
