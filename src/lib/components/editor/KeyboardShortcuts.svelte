<script lang='ts'>
    import { isDesktop } from '@lib/capacitor'
    import { TOOL_SHORTCUTS, COLOR_SHORTCUTS } from '@lib/constants'
    import { clamp } from '@lib/utils'
    import { brushSize, brushType, overlayOpacity } from './state'
    import { setMode } from './utils'

    if (isDesktop) {
        window.addEventListener('keyup', ({ key }) => {
            if (TOOL_SHORTCUTS[key]) {
                setMode(TOOL_SHORTCUTS[key])
            } else if (COLOR_SHORTCUTS[key]) {
                $brushType = COLOR_SHORTCUTS[key]
            }

            // toggle opacity
            if (key === 'o') {
                if ($overlayOpacity < .5) {
                    $overlayOpacity = 1
                } else {
                    $overlayOpacity = 0
                }
            }
            
            if (key === '[') {
                $overlayOpacity = clamp($overlayOpacity - .1, .1, 1)
            } else if (key === ']') {
                $overlayOpacity = clamp($overlayOpacity + .1, .1, 1)
            }
            
            if (key === '{') {
                $brushSize = clamp($brushSize - 1, 1, 20)
            } else if (key === '}') {
                $brushSize = clamp($brushSize + 1, 1, 20)
            }
        })
    }    
</script>