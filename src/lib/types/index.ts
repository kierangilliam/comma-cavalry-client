export * from './__generated__';

export type Point = { x: number, y: number }

export type PathType =
    'empty'
    | 'road'
    | 'lane markings'
    | 'undrivable'
    | 'movable'
    | 'ego'

export interface Path {
    type: PathType
    mode: Omit<ToolMode, 'move'>
    points: Point[]
    size: number
}

export type User = { name: string, email: string }

export type ToolMode = 'brush' | 'move' | 'fill' | 'autoLine'