import type { ClassType } from './state'

export const COLORS: Record<ClassType, string> = {
    empty: '#fff',
    road: '#0f0',
    undrivable: '#000',
    ego: '#ffa',
    'lane markings': '#00f',
    movable: '#f00',
}

export const getColor = (type: ClassType): string => {
    return COLORS[type]
}