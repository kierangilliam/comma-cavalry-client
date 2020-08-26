<script lang='ts'>
    import { zoom, canvasPosition } from '../state'
    import { clamp } from '@lib/utils'
    import { listenToEvents } from './common'
    import type { ToolEvent, MoveEvent } from './common'
    import type { Point } from '@lib/types'

    const MIN_ZOOM = .2
    const MAX_ZOOM = 10
    const SPEED = 5 

    let lastScale = $zoom + SPEED
    let lastDelta: Point = { x: 0, y: 0 }

    const onMove = ({ deltaX, deltaY }: ToolEvent) => {
        // Scale the speed with the zoom level
        const speed = SPEED / $zoom

        const positionFromDelta = {
            x: $canvasPosition.x + ((deltaX - lastDelta.x) * speed),
            y: $canvasPosition.y + ((deltaY - lastDelta.y) * speed),
        }

        $canvasPosition = positionFromDelta

        lastDelta = { x: deltaX, y: deltaY }
    }

    const onZoomMobile = ({ scale }: ToolEvent) => {
        const speed = SPEED * $zoom          
        const newZoom = $zoom + ((scale - lastScale) * speed)
        
        $zoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM)
        lastScale = scale
    }  
    
    const onZoomDesktop = ({ deltaY }: ToolEvent) => {            
        const newZoom = $zoom - (deltaY / 10)
        
        $zoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM)
    }

    const onEnd = () => {
        lastDelta = { x: 0, y: 0 }
        lastScale = 1
    }

    listenToEvents<MoveEvent>('move', {
        panMove: onMove,
        panEnd: onEnd,
        zoomMobile: onZoomMobile,
        zoomDesktop: onZoomDesktop,
    })
</script>