<!-- Fires double tap multi-touch gestures -->

<script lang='ts'>
    import { createEventDispatcher } from 'svelte'
    import Hammer from 'hammerjs'

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

    canvas.addEventListener('touchstart', (e: TouchEvent) => {        
        if (e.touches.length === 1) {
            dispatch('singlestart', { e })
        }

        lastTouchEvent = e
    }, false)

    canvas.addEventListener('touchmove', (e: TouchEvent) => {
        if (
            e.touches.length === 1
            // Not a pinch event
            // Prevents firing an event after pinching and one finger leaves the screen
            && (!lastTouchEvent || lastTouchEvent.touches.length <= 1)
        ) {
            console.log('single move')
            dispatch('singlemove', { e })
        }
    })

    canvas.addEventListener('touchend', (e: TouchEvent) => {
        dispatch('end', { e })
    })
</script>

