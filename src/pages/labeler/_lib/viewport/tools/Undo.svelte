<script lang='ts'>
    import { TOOL_COORDINATOR_CONTEXT } from './common'
    import type { ToolEvent } from './common'
    import type { Writable } from 'svelte/store'
    import { getContext } from 'svelte'
    import type { EditorContext } from '@lib/types'

    const { paths } = getContext<EditorContext>('editor')
    const { eventStream }: { eventStream: Writable<ToolEvent> } = getContext(TOOL_COORDINATOR_CONTEXT)

    eventStream.subscribe(e => {
        if (e !== null && e.type === 'undo') {
            $paths.pop()

            // Trigger state refresh
            $paths = $paths
        }
    })
</script>