import { params } from '@sveltech/routify'
import { get } from 'svelte/store'
import { ClassType, paths, toolMode } from './state'

const LOCAL_STORAGE_SAVED = 'saved'
const VIEWPORT_VERSION = 0

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

export const save = () => {
    console.debug('Save')
    const { id } = get(params)
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SAVED)) || {}

    saved[id] = {
        version: VIEWPORT_VERSION,
        paths: get(paths),
    }

    localStorage.setItem(LOCAL_STORAGE_SAVED, JSON.stringify(saved))

    // Trigger state refresh so that derived 'dirty' updates
    paths.set(get(paths))
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