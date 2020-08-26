<script lang='ts'>
    import type { FillRenderer } from '@lib/mask-renderer'
    import { createNewPath, listenToEvents } from './common'
    import type { ToolEvent, FillEvent } from './common'
    import { brushType } from '../state'
    import { getColor } from '../utils'
    import type { EditorContext } from '@lib/types'
    import { getContext } from 'svelte'

    export let renderer: FillRenderer
    
    const { paths } = getContext<EditorContext>('editor')

    listenToEvents<FillEvent>('fill', {
        fill: ({ canvasX, canvasY }: ToolEvent) => {
            const path = createNewPath({ x: canvasX, y: canvasY, renderer })
            const color = getColor($brushType)

            renderer.drawPath({ color, ...path })
            $paths.push(path)
        }
    })
</script>