<!-- Fires double tap multi-touch gestures -->

<script lang='ts'>
    import { createEventDispatcher, onMount } from 'svelte'
    import Hammer from 'hammerjs'
    import { zoom } from '../state'

    export let canvas: HTMLCanvasElement

    let target: HTMLElement
    
    const dispatch = createEventDispatcher()    
    
    onMount(() => {
        const gestures = new Hammer(target)

        gestures
            .get('pinch')
            .set({ enable: true })

        gestures.on('pinch pinchstart pinchend', (e) => {
            const { scale, type, deltaX, deltaY } = e

            dispatch(type, { 
                scale, 
                delta: { x: deltaX, y: deltaY },
                ...e,
            })
        })
        
        gestures.get('tap').set({
            event: 'doubletap',
            taps: 2,
        })

        // TODO Fix: fires twice (use hammer manager?)
        gestures.on('doubletap', (e) => {
            console.debug('doubletap',e)
            dispatch('doubletap')
        })

        gestures.get('pan').set({ direction: Hammer.DIRECTION_ALL})

        gestures.on('panstart', (e) => {
            console.log('pan start')
            dispatch('panstart', { ...canvasPointFromEvent(e), ...e })
        })
        
        gestures.on('panmove', (e) => {
            console.log('pan move')
            dispatch('panmove', { ...canvasPointFromEvent(e), ...e }) 
        })

        gestures.on('panend pinchend pancancel pinchcancel', () => {
            console.log('END')
            dispatch('end')
        })
    })

    // TODO Shortpress to enable making the brush size bigger and smaller

    function canvasPointFromEvent(e: HammerInput) {
        const rect = canvas.getBoundingClientRect()        
        const { x, y } = e.center

        return {
            canvasX: (x - rect.left) / $zoom,
            canvasY: (y - rect.top) / $zoom,
        }
    }
</script>

<div bind:this={target}></div>

<style>
    div {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
</style>