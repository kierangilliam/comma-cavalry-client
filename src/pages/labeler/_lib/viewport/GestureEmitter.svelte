<!-- Fires double tap multi-touch gestures -->

<script lang='ts'>
    import { createEventDispatcher, onMount } from 'svelte'
    import Hammer from 'hammerjs'
    import { zoom } from '../state'

    export let canvas: HTMLCanvasElement

    let target: HTMLElement
    
    const dispatch = createEventDispatcher()    
    
    onMount(() => {
        const gestures = new Hammer.Manager(target)

        const pan = new Hammer.Pan({ direction: Hammer.DIRECTION_ALL })
        const pinch = new Hammer.Pinch({ enable:true })
        const doubletap = new Hammer.Tap({ 
            event: 'doubletap', 
            taps: 2,
            posThreshold: 30,
            interval: 400,
        })

        gestures.add([ doubletap, pinch, pan ])

        gestures.on('pinch pinchstart pinchend', (e) => {
            const { scale, type, deltaX, deltaY } = e

            dispatch(type, { 
                scale, 
                delta: { x: deltaX, y: deltaY },
                ...e,
            })
        })
        
        gestures.on('doubletap', (e) => {
            console.debug('doubletap',e)
            dispatch('doubletap')
        })

        gestures.on('panstart', (e) => {
            console.log('pan start')
            dispatch('panstart', { ...canvasPointFromEvent(e), ...e })
        })
        
        gestures.on('panmove', (e) => {
            dispatch('panmove', { ...canvasPointFromEvent(e), ...e }) 
        })

        gestures.on('panend pinchend pancancel pinchcancel', () => {
            console.log('touch end')
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