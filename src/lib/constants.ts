import type { ClassType } from './types'

export const COLORS = {
    white: '#F7F7F7',
    brown: '#655151',
    red: '#EC7A73',
    peach: '#F3D2C1',
    green: '#C5F3C1',
    purple: '#C665DE',
}

export const PATH_COLORS: Record<ClassType, string> = {
    empty: COLORS.white,
    road: COLORS.brown,
    undrivable: COLORS.peach,
    ego: COLORS.purple,
    'lane markings': COLORS.red,
    movable: COLORS.green,
}

export const IMAGE_WIDTH = 1164
export const IMAGE_HEIGHT = 874

// @ts-ignore
export const DEV = __buildEnv__ === 'development'