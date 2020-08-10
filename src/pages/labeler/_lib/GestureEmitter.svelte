<!-- Fires double tap multi-touch gestures -->

<script lang='ts'>
    import { createEventDispatcher } from 'svelte'

    export let canvas: HTMLCanvasElement

    const dispatch = createEventDispatcher()
    const DOUBLE_CLICK_THRESHOLD = 500

    let lastTouch = 0
    // let lastTouchEvent: TouchEvent

    canvas.addEventListener('touchstart', (e: TouchEvent) => {
        const now = Date.now()

        if (Math.abs(now - lastTouch) <= DOUBLE_CLICK_THRESHOLD) {
            dispatch('doubletap')
            lastTouch = 0
            return
        }         
        
        if (e.touches.length === 1) {
            dispatch('singlestart', { e })
        } else {
            console.log('doublestart')
            dispatch('doublestart', { e })
        }

        lastTouch = now
        // lastTouchEvent = e
    })

    canvas.addEventListener('touchmove', (e: TouchEvent) => {
        const details = { e } //, eStart: lastTouchEvent }

        if (e.touches.length === 1) {
            dispatch('singlemove', details)
        } else {
            console.log('doublemove')
            dispatch('doublemove', details)
        } 
    })

    canvas.addEventListener('touchend', (e: TouchEvent) => {
        dispatch('end')
    })
</script>

