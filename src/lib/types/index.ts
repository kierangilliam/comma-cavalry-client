// import Hammer from 'hammerjs'

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

export type GestureEvent = {
    // @ts-ignore
    detail: Omit<HammerInput, 'destroy' | 'init' | 'handler'> & { canvasX: number, canvasY: number }
}