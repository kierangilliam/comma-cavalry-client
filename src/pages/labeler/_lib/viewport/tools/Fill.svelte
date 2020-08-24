<script lang='ts'>
    import type { FillRenderer } from '@lib/mask-renderer'
    import { createNewPath, listenToEvents } from './common'
    import type { ToolEvent, FillEvent } from './common'
    import { brushType, paths } from '../../state'
    import { getColor } from '../../utils'

    export let renderer: FillRenderer

    listenToEvents<FillEvent>('fill', {
        fill: ({ canvasX, canvasY }: ToolEvent) => {
            const path = createNewPath({ x: canvasX, y: canvasY, renderer })
            const color = getColor($brushType)

            renderer.drawPath({ color, ...path })
            $paths.push(path)
        }
    })
</script>