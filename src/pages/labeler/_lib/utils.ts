import { PATH_COLORS, TRUE_PATH_COLORS } from '@lib/constants'
import type { PathType, ToolMode } from '@lib/types'
import { get } from 'svelte/store'
import { toolMode } from './state'

// TODO Remove
export const getColor = (type: PathType, truePathColor = false): string => {
    return truePathColor
        ? TRUE_PATH_COLORS[type]
        : PATH_COLORS[type]
}

export const setMode = (() => {
    let lastTool = get(toolMode)

    // 'last' sets the mode to the last paint tool
    return (mode: ToolMode | 'last') => {
        console.debug('Set mode', mode, 'last:', lastTool)

        const tmp = get(toolMode)

        mode === 'last'
            ? toolMode.set(lastTool)
            : toolMode.set(mode)

        lastTool = isPaintMode(tmp) ? tmp : lastTool
    }
})()

export const isPaintMode = (mode: ToolMode) =>
    mode === 'autoLine' || mode === 'brush' || mode === 'fill'

// TODO Remove?
export const isDrawingMode = (mode: ToolMode) =>
    mode === 'autoLine' || mode === 'brush'
