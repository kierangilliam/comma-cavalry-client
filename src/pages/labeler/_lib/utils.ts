import { get } from 'svelte/store'
import { ClassType, paths, toolMode } from './state'

export const COLORS: Record<ClassType, string> = {
    empty: '#fff',
    road: '#0f0',
    undrivable: '#000',
    ego: '#ffa',
    'lane markings': '#00f',
    movable: '#f00',
}

export const getColor = (type: ClassType): string => {
    return COLORS[type]
}

export const undo = () => {
    console.debug('Undo')
    const _paths = get(paths)

    _paths.pop()
    paths.set(_paths)
}

export const setMode = (() => {
    let lastPaintTool: 'brush' | 'fill' = 'brush'

    return (mode: 'brush' | 'move' | 'fill' | 'last') => {
        const tmp = get(toolMode)
        console.debug('Set mode', mode, 'last:', lastPaintTool)

        mode === 'last'
            ? toolMode.set(lastPaintTool)
            : toolMode.set(mode)

        lastPaintTool = tmp === 'brush' || tmp === 'fill'
            ? tmp
            : lastPaintTool
    }
})()