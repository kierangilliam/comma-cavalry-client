import { PATH_COLORS } from '@lib/constants'
import type { ClassType } from '@lib/types'
import { params } from '@sveltech/routify'
import { get } from 'svelte/store'
import { Path, paths, toolMode } from './state'

const LOCAL_STORAGE_SAVED = 'saved'
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

const getSavedFromLocalStorage = (): [string, { version?: number, paths?: Path[] }] => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_SAVED)) || {}
}

export const save = () => {
    console.debug('Save')
    const { id } = get(params)
    const saved = getSavedFromLocalStorage()

    saved[id] = {
        version: VIEWPORT_VERSION,
        paths: get(paths),
    }

    localStorage.setItem(LOCAL_STORAGE_SAVED, JSON.stringify(saved))

    // Trigger state refresh so that derived 'dirty' updates
    paths.set(get(paths))
}

// TODO Add image and mask?
export const getSaved = (id: string): [Path[]] => {
    const saved = getSavedFromLocalStorage()
    const entry = saved[id]

    return [entry?.paths || []]
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