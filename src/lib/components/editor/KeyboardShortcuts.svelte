<script lang='ts'>
    import { isDesktop } from '@lib/capacitor'
    import { TOOL_SHORTCUTS, COLOR_SHORTCUTS } from '@lib/constants'
    import { brushType } from './state'
    import { setMode } from './utils'

    if (isDesktop) {
        window.addEventListener('keyup', ({ key }) => {
            if (TOOL_SHORTCUTS[key]) {
                setMode(TOOL_SHORTCUTS[key])
            } else if (COLOR_SHORTCUTS[key]) {
                $brushType = COLOR_SHORTCUTS[key]
            }
        })
    }    
</script>