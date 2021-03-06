import { get } from 'svelte/store'
import type { Entry, GitInfo } from './types'
import { persistent } from './utils'

const LOCAL_STORAGE_ENTRIES = 'saved'
const VIEWPORT_VERSION = 0

export const savedEntries = persistent<Record<string, Entry>>(LOCAL_STORAGE_ENTRIES, {})

export const git = persistent<GitInfo>('git', null)

export const getEntry = (id: string): Entry => {
    const saved = get(savedEntries)
    const entry = saved[id]

    return {
        version: entry?.version || -1,
        paths: entry?.paths || [],
        archived: entry?.archived || false,
    }
}

export const saveEntry = (id: string, { paths, archived }: Omit<Entry, 'version'>) => {
    const saved = get(savedEntries)

    saved[id] = {
        version: VIEWPORT_VERSION,
        paths,
        archived,
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

export const archiveEntry = (id: string) => {
    const saved = get(savedEntries)

    saved[id].archived = true
    savedEntries.set(saved)

    console.debug('Archived entry', id)
}
