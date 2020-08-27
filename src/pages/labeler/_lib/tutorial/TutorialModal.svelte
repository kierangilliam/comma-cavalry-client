<script lang='ts'>
    import { Carousel, Modal } from '@lib/components'    
    import TutorialSection from './TutorialSection.svelte'    
    import { PATH_COLORS, COLOR_SHORTCUTS, TOOL_SHORTCUTS } from '@lib/constants'
    import { isDesktop } from '@lib/capacitor'

    export let active: boolean = false

    const bold = (text) => `<span style=\'font-weight: bolder;\'>${text}</span>`

    const spacer = '<div style=\'height: var(--s-6);\'></div>'

    const color = (name: keyof typeof PATH_COLORS) => {
        const color = PATH_COLORS[name]
        let textColor = 'var(--white)'

        if (name === 'undrivable')   textColor = '#331f15'
        else if (name === 'movable') textColor = '#22441f'
        else if (name === 'empty') textColor = 'var(--black)'
        
        return `
            <span class='tag' style='
                color: ${textColor}; 
                background: ${color};
                margin-right: var(--s-2);        
            '>${name}</span>
        `
    }

    const colorShortcuts = Object.entries(COLOR_SHORTCUTS).map(([code, path]) =>
        `
            <div style='padding: var(--s-1) 0'>
                <span class='tag monospace' style='margin-right: var(--s-2)'>${code}</span>
                ${color(path)}
            </div>
        `
    )
    
    const toolShortcuts = Object.entries(TOOL_SHORTCUTS).map(([code, tool]) =>
        `
            <div style='padding: var(--s-1) 0'>
                <span class='tag monospace' style='margin-right: var(--s-2)'>${code}</span>
                <span class='tag' style='background: var(--gray);'>${tool}</span>
            </div>
        `
    )

    const desktopShortcuts = `
        <div style='display: grid; grid-template-columns: 1fr 1fr;'>
            ${[...colorShortcuts, ...toolShortcuts].join('')}
        </div>
    `
    
    const mobileShortcuts = `
        In the editor, press finger down for half a second to toggle ${bold('move mode')}. 
        ${spacer}
        In move mode, drag your finger across the screen to pan around. 
        ${spacer}
        When you are done, hold your finger down to switch back into drawing mode.
    `

    const tutorials = [
        {
            title: 'shortcuts',
            body: isDesktop ? desktopShortcuts : mobileShortcuts,
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
            title: 'final notes',
            body: `
                The autoLine tool works like the brush but it tries to draw only over lines that it detects.
                ${spacer}
                Save and exit by swipping up from the bottom.
                ${spacer}
                You can access this tutorial at any time by clicking the help button on the right.
            `,
        },        
    ]

    const sections = tutorials.map(({ title, body }) => ({
        component: TutorialSection as SvelteComponent,
        props: { title, body },
    }))
</script>

<Modal bind:active padding={{ x: '0' }}>
    <Carousel {sections} />
</Modal>
