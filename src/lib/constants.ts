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


export const TOOL_SHORTCUTS: Record<string, ToolMode> = {
    a: 'brush',
    s: 'fill',
    d: 'autoLine',
    f: 'move',
}

export const COLOR_SHORTCUTS: Record<number, PathType> = {
    '1': 'empty',
    '2': 'road',
    '3': 'undrivable',
    '4': 'ego',
    '5': 'lane markings',
    '6': 'movable',
}