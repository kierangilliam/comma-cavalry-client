export * from './__generated__';

export type Point = { x: number, y: number }

export type ClassType =
    'empty'
    | 'road'
    | 'lane markings'
    | 'undrivable'
    | 'movable'
    | 'ego'

export interface Path {
    type: ClassType
    points: Point[]
    size: number
}

export type User = { name: string, email: string }

export type ToolMode = 'brush' | 'move' | 'fill' | 'autoLine'