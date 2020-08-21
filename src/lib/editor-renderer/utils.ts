import { PATH_COLORS, TRUE_PATH_COLORS } from '@lib/constants'
import type { PathType } from '@lib/types'

export const getColor = (type: PathType, truePathColor = false): string => {
    return truePathColor
        ? TRUE_PATH_COLORS[type]
        : PATH_COLORS[type]
}