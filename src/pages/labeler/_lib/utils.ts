import { PATH_COLORS } from '@lib/constants'
import { getSaved, LOCAL_STORAGE_SAVED } from '@lib/storage'
import type { ClassType } from '@lib/types'
import { params } from '@sveltech/routify'
import { get } from 'svelte/store'
import { paths, toolMode } from './state'

const VIEWPORT_VERSION = 0

export const getColor = (type: ClassType): string => {
    return PATH_COLORS[type]
}

export const undo = () => {
    console.debug('Undo')
    const _paths = get(paths)

    _paths.pop()
    paths.set(_paths)
}

export const save = () => {
    console.debug('Save')
    const { id } = get(params)
    const saved = getSaved()

    saved[id] = {
        version: VIEWPORT_VERSION,
        paths: get(paths),
    }

    localStorage.setItem(LOCAL_STORAGE_SAVED, JSON.stringify(saved))

    // Trigger state refresh so that derived 'dirty' updates
    paths.set(get(paths))
}

export const setMode = (() => {
    let lastPaintTool: 'brush' | 'fill' | 'autoLine' = 'autoLine'

    return (mode: 'brush' | 'move' | 'fill' | 'last') => {
        const tmp = get(toolMode)
        console.debug('Set mode', mode, 'last:', lastPaintTool)

        mode === 'last'
            ? toolMode.set(lastPaintTool)
            : toolMode.set(mode)

        lastPaintTool = tmp === 'brush' || tmp === 'fill' || tmp === 'autoLine'
            ? tmp
            : lastPaintTool
    }
})()

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