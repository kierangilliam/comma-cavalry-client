import type { Path, Point } from '@lib/types'

export interface DrawPointsOpts {
    color: string
    points: Point[]
    size: number
}

export interface DrawPathsOpts {
    paths: Path[],
    truePathColors?: boolean,
    mask?: ImageData,
}

export interface ToPngOpts {
    paths: Path[],
    truePathColors?: boolean,
}

export type DrawPathOpts = Omit<Path, 'type'> & { color: string }
