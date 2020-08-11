import type { ClassType } from '@lib/types'
import { params } from '@sveltech/routify'
import { derived, get, writable } from 'svelte/store'

export type Point = { x: number, y: number }

export interface Path {
    type: ClassType
    points: Point[]
    size: number
}

export const paths = writable<Path[]>([])

export const toolMode = writable<'fill' | 'brush' | 'move'>('brush')

export const brushSize = writable<number>(10)

export const brushType = writable<ClassType>('road')

export const zoom = writable<number>(1)

export const overlayOpacity = writable<number>(.5)

export const dirty = derived(
    paths,
    ($paths) => {
        const pathsString = JSON.stringify($paths)
        const saved = JSON.parse(localStorage.getItem('saved'))
        const { id } = get(params)
        const savedPathsString = JSON.stringify(
            saved
                ? saved[id]?.paths || []
                : []
        )

        return savedPathsString !== pathsString
    }
)