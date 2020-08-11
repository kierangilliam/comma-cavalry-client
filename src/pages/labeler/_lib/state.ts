import type { ClassType, Path } from '@lib/types'
import { params } from '@sveltech/routify'
import { derived, get, writable } from 'svelte/store'

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

export const reset = () => {
    paths.set([])
    toolMode.set('brush')
    brushSize.set(10)
    brushType.set('road')
    zoom.set(1)
    overlayOpacity.set(.5)
}