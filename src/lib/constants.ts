import type { PathType, ToolMode } from './types'

export const COLORS = {
    white: '#F7F7F7',
    brown: '#655151',
    red: '#EC7A73',
    peach: '#F3D2C1',
    green: '#C5F3C1',
    purple: '#C665DE',
}

export const PATH_COLORS: Record<PathType, string> = {
    empty: COLORS.white,
    road: COLORS.brown,
    undrivable: COLORS.peach,
    ego: COLORS.purple,
    'lane markings': COLORS.red,
    movable: COLORS.green,
}

export const TRUE_PATH_COLORS: Record<PathType, string> = {
    empty: '#ffffff',
    road: '#402020',
    undrivable: '#808060',
    ego: '#cc00ff',
    'lane markings': '#ff0000',
    movable: '#00ff66',
}

export const IMAGE_WIDTH = 1164
export const IMAGE_HEIGHT = 874

// @ts-ignore
export const DEV = __buildEnv__ === 'development'

const KEY_CODES = {
    a: 56,
    s: 83,
    d: 86,
    f: 70,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
}

export const TOOL_SHORTCUTS: Record<number, ToolMode> = {
    [KEY_CODES.a]: 'brush',
    [KEY_CODES.a]: 'fill',
    [KEY_CODES.a]: 'autoLine',
    [KEY_CODES.a]: 'move',
}

export const COLOR_SHORTCUTS: Record<number, PathType> = {
    [KEY_CODES['1']]: 'empty',
    [KEY_CODES['2']]: 'road',
    [KEY_CODES['3']]: 'undrivable',
    [KEY_CODES['4']]: 'ego',
    [KEY_CODES['5']]: 'lane markings',
    [KEY_CODES['6']]: 'movable',
}