<script lang='ts'>
    import { TOOL_COORDINATOR_CONTEXT } from './common'
    import type { ToolEvent } from './common'
    import { undo } from '../../utils'
    import type { Writable } from 'svelte/store'
    import { getContext } from 'svelte'

    const { eventStream }: { eventStream: Writable<ToolEvent> } = getContext(TOOL_COORDINATOR_CONTEXT)

    eventStream.subscribe(e => {
        if (e !== null && e.type === 'undo') {
            undo()
        }
    })
</script>