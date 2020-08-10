<!-- Fires double tap multi-touch gestures -->

<script lang='ts'>
    import { createEventDispatcher } from 'svelte'
    import Hammer from 'hammerjs'
    import { zoom } from '../state'

    export let canvas: HTMLCanvasElement

    const dispatch = createEventDispatcher()    
    const gestures = new Hammer(canvas)

    let lastTouchEvent: TouchEvent

    gestures
        .get('pinch')
        .set({ enable: true })

    gestures.on('pinch pinchstart pinchend', ({ scale, type, deltaX, deltaY }) => {
        dispatch(type, { 
            scale, 
            delta: { x: deltaX, y: deltaY },
        })
    })
    
    gestures.get('tap').set({
        event: 'doubletap',
        taps: 2,
    })

    gestures.on('doubletap', () => {
        dispatch('doubletap')
    })

    gestures.get('pan').set({ direction: Hammer.DIRECTION_ALL})

    gestures.on('panstart', (e) => {
        console.log('pan start', e)
        dispatch('panstart', { ...pointFromEvent(e) })
    })
    
    gestures.on('panmove', (e) => {
        console.log('pan move', e)
        dispatch('panmove', { ...pointFromEvent(e) }) 
    })

    gestures.on('panend pinchend pancancel pinchcancel', () => {
        console.log('END')
        dispatch('end')
    })

    function pointFromEvent(e: HammerInput) {
        const rect = canvas.getBoundingClientRect()        
        const { x, y } = e.center

        return {
            x: (x - rect.left) / $zoom,
            y: (y - rect.top) / $zoom,
        }
    }
</script>

