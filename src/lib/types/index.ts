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
