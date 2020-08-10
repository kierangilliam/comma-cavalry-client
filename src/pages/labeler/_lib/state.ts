import { writable } from 'svelte/store'

export interface Path {
    type: ClassType
    points: { x: number, y: number }[]
    size: number
}

export type ClassType =
    'empty'
    | 'road'
    | 'lane markings'
    | 'undrivable'
    | 'movable'
    | 'ego'

export const paths = writable<Path[]>([])

export const toolMode = writable<'fill' | 'brush' | 'move'>('brush')

export const brushSize = writable<number>(10)

export const brushType = writable<ClassType>('road')

export const zoom = writable<number>(1)

export const overlayOpacity = writable<number>(.5)
