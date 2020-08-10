<!-- Fires double tap multi-touch gestures -->

<script lang='ts'>
    import { createEventDispatcher } from 'svelte'
    import Hammer from 'hammerjs'

    export let canvas: HTMLCanvasElement

    const dispatch = createEventDispatcher()    
    const gestures = new Hammer(canvas)
    const DOUBLE_TAP_THRESHOLD_MS = 500
    const DOUBLE_TAP_THRESHOLD_DIST = 25

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
    })

    canvas.addEventListener('touchmove', (e: TouchEvent) => {
        const details = { e }

        if (e.touches.length === 1) {
            dispatch('singlemove', details)
        }
    })

    canvas.addEventListener('touchend', (e: TouchEvent) => {
        dispatch('touchend')
    })

    function withinDoubleTapThreshold(event: TouchEvent, now: number) {        
        const withinTimeThreshold = Math.abs(now - lastTouchTime) <= DOUBLE_TAP_THRESHOLD_MS
        const cx = (e?: TouchEvent) => e?.touches[0]?.clientX
        const cy = (e?: TouchEvent) => e?.touches[0]?.clientY

        return withinTimeThreshold
            && Math.abs(cx(lastTouchEvent) - cx(event)) <= DOUBLE_TAP_THRESHOLD_DIST
            && Math.abs(cy(lastTouchEvent) - cy(event)) <= DOUBLE_TAP_THRESHOLD_DIST
    }
</script>

