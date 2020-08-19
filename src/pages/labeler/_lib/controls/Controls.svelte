<script lang='ts'>
    import { 
        overlayOpacity, 
        dirty, 
        brushSize, 
        paths, 
        showTutorial 
    } from '../state'
    import { Fade } from '@lib/components'
    import ColorSelector from './ColorSelector.svelte'
    import { undo, save } from '../utils'
    import { H3, Button, Spacer, Flex } from '@ollopa/cedar'    
    import { getContext } from 'svelte'
    import { goto } from '@sveltech/routify'
    import Slider from './Slider.svelte'
    import { notifications } from '@lib/notifications'
    
    export let id: string
    
    const { open, positionLocked } = getContext('bottomSheet')
    const GUTTER_SPACING = 8

    const exit = async () => {
        if (
            $dirty 
            && await notifications.confirm('Save changes before exiting?')
        ) {
            save()
        }

        $goto('/')
    }

    const clearAll = async () => {
        if (await notifications.confirm('Are you sure?')) {
            $paths = []
        }
    }

    const toggleTutorial = () => {
        $showTutorial = true
        $open = false
    }
</script>

<Fade visible={$open}>
    <H3>Image {id}</H3>
    <div class='tutorial' on:click={toggleTutorial}>show tutorial</div>
    <Spacer s={GUTTER_SPACING} />
</Fade>

<ColorSelector showLabels={$open} />

<Fade visible={$open}>
    <Spacer s={GUTTER_SPACING} />

    <Flex justify='around'>
        <Button on:click={exit} outline warn stretch>
            exit
        </Button>

        <Spacer s={16} />

        <Button on:click={save} disabled={!$dirty} stretch>
            save
        </Button>
    </Flex>

    <Spacer s={GUTTER_SPACING} />

    <Flex justify='around'>
        <Flex flex={1} column justify='between'>
            <Flex stretch column>
                <Button on:click={undo} stretch>undo</Button>
                <Spacer s={2} />
                <label>Or, double tap to undo</label>
            </Flex>
            <Spacer s={6} />
            <Button on:click={clearAll} stretch warn>clear all</Button>
        </Flex>
        
        <Spacer s={8} />

        <div
            style="flex: 1;"
            on:touchstart={() => { $positionLocked = true }}
            on:touchend={() => { $positionLocked = false }}
        >
            <Slider 
                label="brush size" 
                store={brushSize} 
                options={[1, 20, 1]}
            />
            <Spacer s={6} />
            <Slider 
                label="overlay opacity" 
                store={overlayOpacity} 
                options={[0, 1, .1]}
            />
        </div>
    </Flex>
</Fade>

<style>
    .tutorial {
        color: var(--primary);
    }
</style>