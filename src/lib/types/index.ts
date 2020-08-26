import type { Writable } from 'svelte/store';

export * from './__generated__';

export type Point = { x: number, y: number }

export type Cursor = Point & { windowX: number, windowY: number }

export type PathType =
    'empty'
    | 'road'
    | 'lane markings'
    | 'undrivable'
    | 'movable'
    | 'ego'

export interface Path {
    type: PathType
    mode: DrawingMode
    points: Point[]
    size: number
}

export type User = { name: string, email: string }

export type DrawingMode = 'brush' | 'fill' | 'autoLine'

export type ToolMode = DrawingMode | 'move'

export interface EditorContext {
    paths: Writable<Path[]>
}

// TODO Rename?
// Used when working on a one-off mask
export interface Entry {
    version?: number
    paths?: Path[]
    archived?: boolean
}

// Used when reviewing pull requests
// and working with multiple masks
export interface PREntry {
    version?: number
    masks?: {
        id: string
        paths?: Path[]
    }[]
}

export interface GitInfo {
    username: string
    // Authorization token
    token: string
    // Personal repo
    repo: string
    // Branch to commit to
    branch: string
}
