import { writable } from 'svelte/store'

interface ViewportSettings {
    overlayOpacity: number
    zoom: number
}

interface ToolSettings {
    mode: 'fill' | 'brush' | 'move'
    brushSize: number
    brushType: ClassType
}

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

export const tool = writable<ToolSettings>({
    mode: 'brush',
    brushSize: 10,
    brushType: 'road',
})

export const viewport = writable<ViewportSettings>({
    zoom: 1,
    overlayOpacity: .5,
})