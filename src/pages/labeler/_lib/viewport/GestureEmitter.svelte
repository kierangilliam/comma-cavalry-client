<!-- Fires double tap multi-touch gestures -->

<script lang='ts'>
    import { createEventDispatcher } from 'svelte'
    import Hammer from 'hammerjs'

    export let canvas: HTMLCanvasElement

    const dispatch = createEventDispatcher()    
    const gestures = new Hammer(canvas)
    const DOUBLE_TAP_THRESHOLD_MS = 500
    const DOUBLE_TAP_THRESHOLD_DIST = 7.5

    let lastTouchTime = 0
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

    canvas.addEventListener('touchstart', (e: TouchEvent) => {
        const now = Date.now()

        console.log(e)

        if (withinDoubleTapThreshold(e, now)) {
            dispatch('doubletap')
            lastTouchTime = 0
            lastTouchEvent = null
            return
        }         
        
        if (e.touches.length === 1) {
            dispatch('singlestart', { e })
        }

        lastTouchTime = now
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

    function withinDoubleTapThreshold(event: TouchEvent, now: number): boolean {        
        if (!lastTouchEvent || event.touches.length !== 1) {
            return false
        }

        const cx = (e: TouchEvent) => e.touches.item(0).clientX
        const cy = (e: TouchEvent) => e.touches.item(0).clientY
        const withinTimeThreshold = Math.abs(now - lastTouchTime) <= DOUBLE_TAP_THRESHOLD_MS
        const withinXThreshold = Math.abs(cx(lastTouchEvent) - cx(event)) <= DOUBLE_TAP_THRESHOLD_DIST
        const withinYThreshold = Math.abs(cy(lastTouchEvent) - cy(event)) <= DOUBLE_TAP_THRESHOLD_DIST

        return withinTimeThreshold
            && withinXThreshold
            && withinYThreshold
    }
</script>

