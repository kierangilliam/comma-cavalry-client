<!-- Fires double tap multi-touch gestures -->

<script lang='ts'>
    import { createEventDispatcher, onMount } from 'svelte'
    import Hammer from 'hammerjs'
    import type { GestureEvent } from '@lib/types'
    import { zoom } from '../state'

    export let canvas: HTMLCanvasElement

    let target: HTMLElement
    
    const dispatch = createEventDispatcher()    
    
    onMount(() => {
        const gestures = new Hammer.Manager(target)
        const pan = new Hammer.Pan({ direction: Hammer.DIRECTION_ALL })
        const pinch = new Hammer.Pinch({ enable:true })
        const longpress = new Hammer.Press({ event: 'longpress', time: 500 })
        const doubletap = new Hammer.Tap({ 
            event: 'doubletap', 
            taps: 2,
            posThreshold: 30,
            interval: 400,
        })

        gestures.add([ doubletap, pinch, pan, longpress ])

        gestures.on('longpress', e => {
            console.info('longpress')
            dispatch('longpress', createEvent(e))
        })

        gestures.on('pinch pinchstart pinchend', e => {
            dispatch(e.type, createEvent(e))
        })
        
        gestures.on('doubletap', e => {
            console.info('doubletap')
            dispatch('doubletap', createEvent(e))
        })

        gestures.on('panstart', e => {
            console.info('pan start')
            dispatch('panstart', createEvent(e))
        })
        
        gestures.on('panmove', (e) => {
            dispatch('panmove', createEvent(e)) 
        })

        gestures.on('panend pinchend pancancel pinchcancel', e => {
            console.info('touch end')
            dispatch('end', createEvent(e))
        })
    })

    // TODO Shortpress to enable making the brush size bigger and smaller

    function createEvent(e: HammerInput): GestureEvent['detail'] {
        return { ...e, ...canvasPointFromEvent(e) }
    }

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