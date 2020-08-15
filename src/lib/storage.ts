import { get } from 'svelte/store'
import type { Path } from './types'
import { persistent } from './utils'

export const LOCAL_STORAGE_SAVED = 'saved'
const VIEWPORT_VERSION = 0

interface Entry {
    version?: number
    paths?: Path[]
}

export const savedEntries = persistent<Record<string, Entry>>(LOCAL_STORAGE_SAVED, {})

// TODO Add image and mask?
// TODO Remove?
export const getEntry = (id: string): [Path[]] => {
    const saved = get(savedEntries)
    const entry = saved[id]

    return [entry?.paths || []]
}

export const saveEntry = (id: string, { paths }: Omit<Entry, 'version'>) => {
    const saved = get(savedEntries)

    saved[id] = {
        version: VIEWPORT_VERSION,
        paths,
    }

    savedEntries.set(saved)

    console.debug('Saved entry', id)
}

export const deleteEntry = (id: string) => {
    const saved = get(savedEntries)
    delete saved[id]

    savedEntries.set(saved)

    console.debug('Deleted entry', id)
}
