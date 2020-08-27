import type { Path, PathType, Point } from '@lib/types'

export interface DrawPointsOpts {
    points: Point[]
    size: number
    type: PathType
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

export type DrawPathOpts = Path
