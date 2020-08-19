<!-- 
    Handles move events and emits 
    drawing events (brush, autoLine)
    and fill events
-->

<script lang='ts'>
    import { createEventDispatcher, onMount } from 'svelte'
    import Hammer from 'hammerjs'
    import type { Point, Cursor } from '@lib/types'
    import { zoom, cursor, toolMode, canvasPosition, isTouching } from '../state'
    import { setMode, isDrawingMode } from '../utils'

    export let canvas: HTMLCanvasElement

    type GestureEvent = Omit<HammerInput, 'destroy' | 'init' | 'handler'> 
        & { canvasX: number, canvasY: number, windowX: number, windowY: number }
    
    const dispatch = createEventDispatcher()    
    const MIN_ZOOM = .2
    const MAX_ZOOM = 10
    const SPEED = 5 
    const CURSOR_OFFSET = 75
    
    let target: HTMLElement
    let lastScale = $zoom        
    let lastDelta: Point = { x: 0, y: 0 }

    // TODO Longpress to enable making the brush size bigger and smaller

    const onLongPress = () => {
        if ($toolMode === 'move') {
            setMode('last')
        } else {
            setMode('move')
        }
    }

    const onPanStart = ({ canvasX, canvasY, windowX, windowY }: GestureEvent) => {
        $isTouching = true
        $cursor = cursorFromCanvasPosition(canvasX, canvasY, windowX, windowY)
        
        if (isDrawingMode($toolMode)) {
            dispatch('drawstart')
        }
    }        
    
    const onPanMove = ({ canvasX, canvasY, windowX, windowY, deltaX, deltaY }: GestureEvent) => {
        $cursor = cursorFromCanvasPosition(canvasX, canvasY, windowX, windowY)

        if (isDrawingMode($toolMode)) {
            dispatch('drawmove')
        } 
        
        else if ($toolMode === 'move') {
            // Scale the speed with the zoom level
            const speed = SPEED / $zoom

            const positionFromDelta = {
                x: $canvasPosition.x + ((deltaX - lastDelta.x) * speed),
                y: $canvasPosition.y + ((deltaY - lastDelta.y) * speed),
            }

            $canvasPosition = positionFromDelta
        }        

        lastDelta = { x: deltaX, y: deltaY }
    }
    
    const onPinch = ({ scale }: GestureEvent) => {            
        const newZoom = $zoom + ((scale - lastScale) * SPEED)
        
        $zoom = newZoom < MIN_ZOOM 
            ? $zoom
            : Math.min(MAX_ZOOM, newZoom)

        lastScale = scale
    }  

    const onEnd = () => {                   
        $isTouching = false
        lastDelta = { x: 0, y: 0 }
        lastScale = 1

        if (isDrawingMode($toolMode)) {
            dispatch('drawend')            
        }
    } 

    const onTap = ({ canvasX, canvasY }: GestureEvent) => {
        if ($toolMode === 'fill') {
            dispatch('fill', { x: canvasX, y: canvasY })
        }
    }
    
    /**
     * Calculate a y offset to lift returned value 
     * a consistent height above finger, despite the 
     * zoom level
     */  
     const cursorFromCanvasPosition = (canvasX: number, canvasY: number, windowX, windowY): Cursor => {        
        const { innerHeight } = window
        const { height: canvasHeight, top } = canvas.getBoundingClientRect()        
        const yDiff = (innerHeight - canvasHeight) / 2
        const scale = innerHeight / canvasHeight
        const offset = (CURSOR_OFFSET * scale) + ((scale / Math.abs(yDiff)) * CURSOR_OFFSET)
        const canvasYWithOffset = canvasY - offset

        return { 
            x: canvasX, 
            y: canvasYWithOffset,
            windowX,
            windowY: top + (canvasYWithOffset * $zoom),
        }
    }

    onMount(() => {
        const DOUBLE_TAP_INTERVAL = 300
        const gestures = new Hammer.Manager(target)
        const pan = new Hammer.Pan({ direction: Hammer.DIRECTION_ALL })
        const pinch = new Hammer.Pinch({ enable:true })
        const longpress = new Hammer.Press({ event: 'longpress', time: 500 })
        const singletap = new Hammer.Tap({ event: 'tap', taps: 1 })
        const doubletap = new Hammer.Tap({ 
            event: 'doubletap', 
            taps: 2,
            posThreshold: 30,
            interval: DOUBLE_TAP_INTERVAL,
        })

        gestures.add([singletap, doubletap, pinch, pan, longpress])        

        gestures.on('longpress',  _ => onLongPress())
        gestures.on('pinchstart', _ => setMode('move'))
        gestures.on('pinch',      e => onPinch(createEvent(e)))
        gestures.on('panstart',   e => onPanStart(createEvent(e)))
        gestures.on('panmove',    e => onPanMove(createEvent(e)))
        gestures.on('panend pinchend pancancel pinchcancel', _ => onEnd())
        
        // Require failure from a double tap for a single
        // tap to register
        let tapStart = Date.now()
        let singletapTimeout = null

        doubletap.recognizeWith(singletap)
        
        gestures.on('doubletap', e => {
            clearTimeout(singletapTimeout)
            dispatch('doubletap', createEvent(e))
        })

        gestures.on('tap', e => {
            const now = Date.now()

            if (now - tapStart > DOUBLE_TAP_INTERVAL) {
                singletapTimeout = setTimeout(() => {
                    onTap(createEvent(e))
                }, DOUBLE_TAP_INTERVAL)
            }

            tapStart = now
        })

        function createEvent(e: HammerInput): GestureEvent {
            const rect = canvas.getBoundingClientRect()        
            const { x, y } = e.center

            return {
                ...e,
                canvasX: (x - rect.left) / $zoom,
                canvasY: (y - rect.top) / $zoom,
                windowX: x,
                windowY: y,
            }
        }
    })
</script>

<div 
    id='editor-gesture-target'
    bind:this={target}
></div>

<style>
    #editor-gesture-target {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
</style>