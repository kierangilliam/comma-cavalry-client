<script lang='ts'>
    import type { BrushRenderer } from '@lib/editor-renderer'
    import { cursor, paths, brushSize, brushType } from '../../state'
    import { removeSinglePointPaths, listenToEvents, createNewPath } from './common'
    import type { BrushEvent } from './common'
    import { getColor } from '../../utils'
    
    export let renderer: BrushRenderer

    const startNewPathFromCursor = () => {
        const path = createNewPath({ x: $cursor.x, y: $cursor.y, renderer }) 
        const color = getColor($brushType)

        renderer.drawPoints({ ...path, color })

        $paths.push(path)
    }

    const addPointToLastPath = () => {
        // TODO Check if I can remove this guard
        if ($paths.length == 0) {
            return
        }

        const { x, y } = $cursor

        $paths[$paths.length - 1].points.push({ x, y })

        renderer.drawLine({ x, y, size: $brushSize })
    } 

    const handleBrushEnd = () => {
        removeSinglePointPaths()
        renderer.finishPath()
    }

    listenToEvents<BrushEvent>('brush', {
        brushStart: startNewPathFromCursor,
        brushMove: addPointToLastPath,
        brushEnd: handleBrushEnd,
    })
</script>