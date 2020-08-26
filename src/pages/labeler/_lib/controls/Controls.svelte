<script lang='ts'>
    import { overlayOpacity, brushSize, } from '../state'
    import { Fade } from '@lib/components'
    import ColorSelector from './ColorSelector.svelte'
    import { H3, Button, Spacer, Flex } from '@ollopa/cedar'    
    import { createEventDispatcher, getContext } from 'svelte'
    import Slider from './Slider.svelte'
    import { notifications } from '@lib/notifications'
    import type { Readable, Writable } from 'svelte/store'
    import type { Path } from '@lib/types'
    
    export let paths: Writable<Path[]>
    export let dirty: Readable<boolean>
    export let id: string
    
    const dispatch = createEventDispatcher()
    const { open, positionLocked } = getContext('bottomSheet')
    const GUTTER_SPACING = 8

    const clearAll = async () => {
        if (await notifications.confirm('Are you sure?')) {
            $paths = []
        }
    }
</script>

<Fade visible={$open}>
    <H3>Image {id}</H3>
    <Spacer s={GUTTER_SPACING} />
</Fade>

<ColorSelector showLabels={$open} />

<Fade visible={$open}>
    <Spacer s={GUTTER_SPACING} />

    <Flex justify='around'>
        <Button on:click={() => dispatch('exit')} outline warn stretch>
            exit
        </Button>

        <Spacer s={16} />

        <Button on:click={() => dispatch('save')} disabled={!$dirty} stretch>
            save
        </Button>
    </Flex>

    <Spacer s={GUTTER_SPACING} />

    <Flex justify='around'>
        <Flex flex={1} column justify='between'>
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