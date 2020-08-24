<!-- 
    Handles move events and emits 
    drawing events (brush, autoLine)
    and fill events
-->

<script lang='ts'>
    import { writable } from "svelte/store"
    import { onMount, setContext } from 'svelte'
    import Hammer from 'hammerjs'
    import type { Cursor } from '@lib/types'
    import type { ToolEvent, ToolEventType } from './common'
    import { TOOL_COORDINATOR_CONTEXT } from './common'
    import { zoom, cursor, toolMode, isTouching } from '../../state'
    import { setMode } from '../../utils'
    import { isDesktop } from '@lib/capacitor'

    export let canvas: HTMLCanvasElement    

    type EventDetails = Omit<ToolEvent, 'type'>
    
    const CURSOR_OFFSET = 75
    const eventStream = writable<ToolEvent>(null)

    setContext(TOOL_COORDINATOR_CONTEXT, { eventStream })
    
    let target: HTMLElement

    const emit = (type: ToolEventType, e: EventDetails) => {
        $eventStream = { ...e, type }
    }

    // TODO Longpress to enable making the brush size bigger and smaller

    const onLongPress = () => {
        if (isDesktop) return 

        if ($toolMode === 'move') {
            setMode('last')
        } else {
            setMode('move')
        }
    }

    const onPanStart = (e: EventDetails) => {
        const { canvasX, canvasY, windowX, windowY } = e

        $isTouching = true
        $cursor = cursorFromCanvasPosition(canvasX, canvasY, windowX, windowY)
        
        if ($toolMode === 'brush') {
            emit('brushStart', e)
        } else if ($toolMode === 'autoLine') {
            emit('autoLineStart', e)
        }
    }        
    
    const onPanMove = (e: EventDetails) => {
        const { canvasX, canvasY, windowX, windowY } = e
        $cursor = cursorFromCanvasPosition(canvasX, canvasY, windowX, windowY)

        if ($toolMode === 'brush') {
            emit('brushMove', e)
        } else if ($toolMode === 'autoLine') {
            emit('autoLineMove', e)
        } else if ($toolMode === 'move') {
            emit('panMove', e)
        }
    }

    const onScroll = ({ deltaY }: WheelEvent) => {
        setMode('move')
        // @ts-ignore
        const e: EventDetails = { deltaY }
        emit('zoomDesktop', e)
    }
    
    const onPinch = (e: EventDetails) => {  
        setMode('move')
        emit('zoomMobile', e)
    }  

    const onEnd = () => {                   
        $isTouching = false  

        if ($toolMode === 'move') {
            emit('panEnd', null)
        } else if ($toolMode === 'brush') {
            emit('brushEnd', null)            
        } else if ($toolMode === 'autoLine') {
            emit('autoLineEnd', null)            
        }
    } 

    const onTap = (e: EventDetails) => {
        if ($toolMode === 'fill') {
            emit('fill', e)
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

        return isDesktop 
            ? { x: canvasX, y: canvasY, windowX, windowY }
            : { 
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
        gestures.on('pinch',      e => onPinch(createEventDetails(e)))
        gestures.on('panstart',   e => onPanStart(createEventDetails(e)))
        gestures.on('panmove',    e => onPanMove(createEventDetails(e)))
        gestures.on('panend pinchend pancancel pinchcancel', _ => onEnd())
        
        // Require failure from a double tap for a single
        // tap to register
        let tapStart = Date.now()
        let singletapTimeout = null

        doubletap.recognizeWith(singletap)
        
        gestures.on('doubletap', e => {
            clearTimeout(singletapTimeout)
            emit('undo', createEventDetails(e))
        })

        gestures.on('tap', e => {
            const now = Date.now()

            if (now - tapStart > DOUBLE_TAP_INTERVAL) {
                singletapTimeout = setTimeout(() => {
                    onTap(createEventDetails(e))
                }, DOUBLE_TAP_INTERVAL)
            }

            tapStart = now
        })

        if (isDesktop) {
            target.addEventListener('mousewheel', onScroll)
        }

        function createEventDetails(e: HammerInput): EventDetails {
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

<slot />

<div 
    id='editor-gesture-target'
    bind:this={target}
    on:touchend|preventDefault
></div>

<style>
    #editor-gesture-target {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        touch-action: none;
    }
</style>