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

    function setupHammer() {
        const gestures = new Hammer(canvas)

        gestures
            .get('pinch')
            .set({ enable: true })

        gestures.on('pinch pinchstart pinchend', ({ scale, type }) => {
            console.log('pinch', type, scale)
            dispatch(type, { scale })
        })
    }
</script>

