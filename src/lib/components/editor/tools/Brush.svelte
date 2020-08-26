<script lang='ts'>
    import type { BrushRenderer } from '@lib/mask-renderer'
    import { cursor, brushSize, brushType } from '../state'
    import { listenToEvents, createNewPath, getSinglePointPaths } from './common'
    import type { BrushEvent } from './common'
    import { getColor } from '../utils'
    import type { EditorContext, } from '@lib/types'
    import { getContext } from 'svelte'
    
    export let renderer: BrushRenderer

    const { paths } = getContext<EditorContext>('editor')

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
        $paths = getSinglePointPaths($paths)
        renderer.finishPath()
    }

    listenToEvents<BrushEvent>('brush', {
        brushStart: startNewPathFromCursor,
        brushMove: addPointToLastPath,
        brushEnd: handleBrushEnd,
    })
</script>