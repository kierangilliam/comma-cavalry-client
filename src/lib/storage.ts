import type { Path } from './types'

export const LOCAL_STORAGE_SAVED = 'saved'

interface Entry {
    version?: number
    paths?: Path[]
}

export const getSaved = (): Record<string, Entry> => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_SAVED)) || {}
}

// TODO Add image and mask?
export const getEntry = (id: string): [Path[]] => {
    const saved = getSaved()
    const entry = saved[id]

    return [entry?.paths || []]
}
