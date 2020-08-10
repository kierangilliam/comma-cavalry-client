<!-- Fires double tap multi-touch gestures -->

<script lang='ts'>
    import { createEventDispatcher } from 'svelte'
    import Hammer from 'hammerjs'

    export let canvas: HTMLCanvasElement

    const dispatch = createEventDispatcher()    
    const gestures = setupHammer()
    const DOUBLE_CLICK_THRESHOLD = 500

    let lastTouch = 0
    // let lastTouchEvent: TouchEvent

    canvas.addEventListener('touchstart', (e: TouchEvent) => {
        const now = Date.now()

        // TODO Should account for a tap distance to be smaller than 25ish px
        if (Math.abs(now - lastTouch) <= DOUBLE_CLICK_THRESHOLD) {
            dispatch('doubletap')
            lastTouch = 0
            return
        }         
        
        if (e.touches.length === 1) {
            dispatch('singlestart', { e })
        }

        lastTouch = now
        // lastTouchEvent = e
    })

    canvas.addEventListener('touchmove', (e: TouchEvent) => {
        const details = { e } //, eStart: lastTouchEvent }

        if (e.touches.length === 1) {
            dispatch('singlemove', details)
        }
    })

    canvas.addEventListener('touchend', (e: TouchEvent) => {
        dispatch('touchend')
    })

    function setupHammer() {
        const gestures = new Hammer(canvas)

        gestures
            .get('pinch')
            .set({ enable: true })

        gestures.on('pinch pinchstart pinchend', ({ scale, type, deltaX, deltaY }) => {
            dispatch(type, { 
                scale, 
                delta: { x: deltaX, y: deltaY },
            })
        })
    }
</script>

