<script lang='ts'>
    import { overlayOpacity, dirty, brushSize } from '../state'
    import { Fade } from '@lib/components'
    import ColorSelector from './ColorSelector.svelte'
    import { undo, save } from '../utils'
    import { H3, Button, Spacer, Flex } from '@ollopa/cedar'    
    import { getContext } from 'svelte'
    import { goto } from '@sveltech/routify'

    const { open, positionLocked } = getContext('bottomSheet')

    export let imageID = -1

    const exit = () => {
        if ($dirty && window.confirm('Save changes before exiting?')) {
            save()
        }

        $goto('/')
    }
</script>

<Fade visible={$open}>
    <H3>Image {imageID}</H3>
    <Spacer s={12} />
</Fade>

<ColorSelector showLabels={$open} />

<Fade visible={$open}>
    <Spacer s={12} />

    <Flex>
        <Button on:click={exit} outline warn stretch >
            exit
        </Button>

        <Spacer s={12} />

        <Button on:click={save} disabled={$dirty} stretch >   
            save
        </Button>
    </Flex>

    <Spacer s={12} />

    <Flex justify='between' stretch>
        <Flex column justify='between'>
            <Flex column>
                <Button on:click={undo} stretch>undo</Button>
                <label>Or, double tap to undo</label>
            </Flex>
            <Button stretch warn>clear all</Button>
        </Flex>

        <div
            on:touchstart={() => { $positionLocked = true }}
            on:touchend={() => { $positionLocked = false }}
        >
            <Flex justify='between'>
                <label for='brush-size'>Brush size</label>
                <strong>{$brushSize}</strong>
            </Flex>
            <input 
                for='brush-size'
                type='range' 
                bind:value={$brushSize}
                min='1' 
                max='20' 
                step='1' 
            />

            <Flex justify='between'>
                <label for='overlay-opacity'>Overlay Opacity</label>
                <strong>{$overlayOpacity}</strong>
            </Flex>
            <input 
                id='overlay-opacity'
                type='range' 
                bind:value={$overlayOpacity}
                min='0' 
                max='1' 
                step='.1' 
            />
        </div>
    </Flex>
</Fade>