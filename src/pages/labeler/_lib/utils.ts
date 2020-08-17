import { Haptics } from '@lib/capacitor'
import { PATH_COLORS, TRUE_PATH_COLORS } from '@lib/constants'
import { saveEntry } from '@lib/storage'
import type { ClassType, ToolMode } from '@lib/types'
import { params } from '@sveltech/routify'
import { get } from 'svelte/store'
import { paths, toolMode } from './state'

export const getColor = (type: ClassType, truePathColor = false): string => {
    return truePathColor
        ? TRUE_PATH_COLORS[type]
        : PATH_COLORS[type]
}

export const undo = () => {
    console.debug('Undo')
    const _paths = get(paths)

    _paths.pop()
    paths.set(_paths)
}

export const save = () => {
    const { id } = get(params)

    saveEntry(id, { paths: get(paths) })
    Haptics.success()

    // Trigger state refresh so that derived 'dirty' updates
    paths.set(get(paths))
}

export const setMode = (() => {
    let lastTool = get(toolMode)

    return (mode: ToolMode | 'last') => {
        console.debug('Set mode', mode, 'last:', lastTool)

        const tmp = get(toolMode)

        mode === 'last'
            ? toolMode.set(lastTool)
            : toolMode.set(mode)

        lastTool = tmp
    }
})()

export const isDrawingMode = (mode: ToolMode) =>
    mode === 'autoLine' || mode === 'brush' || mode === 'fill'

// export const getPercentEmpty = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
//     const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
//     const { count } = calculate({
//         data: Array.from(data),
//         colors: {
//             empty: hexToRgb(PATH_COLORS.empty)
//         }
//     })

//     function hexToRgb(hex) {
//         var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//         return result ? {
//             r: parseInt(result[1], 16),
//             g: parseInt(result[2], 16),
//             b: parseInt(result[3], 16)
//         } : null;
//     }
// }