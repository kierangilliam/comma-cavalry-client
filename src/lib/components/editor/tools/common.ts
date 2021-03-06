import type { ToolRenderer } from '@lib/mask-renderer/ToolRenderer'
import type { Path, ToolMode } from '@lib/types'
import { getContext } from 'svelte'
import { get, Writable } from 'svelte/store'
import { brushSize, brushType, toolMode } from '../state'

export type BrushEvent = 'brushStart' | 'brushMove' | 'brushEnd'
export type MoveEvent = 'zoomMobile' | 'zoomTrackPad' | 'zoomMouseWheel' | 'panMove' | 'panEnd'
export type FillEvent = 'fill'
export type AutoLineEvent = 'autoLineStart' | 'autoLineMove' | 'autoLineEnd'
export type UndoEvent = 'undo'

export type ToolEventType = BrushEvent | MoveEvent | FillEvent | AutoLineEvent | UndoEvent

export const TOOL_COORDINATOR_CONTEXT = 'tool coordinator'

export type ToolEvent = {
    type: ToolEventType
    canvasX: number
    canvasY: number
    windowX: number
    windowY: number
} & Omit<HammerInput, 'destroy' | 'init' | 'handler'>

export const listenToEvents = <T extends string>(
    mode: ToolMode, callbacks: Record<T, (e?: ToolEvent) => void>
) => {
    const { eventStream }: { eventStream: Writable<ToolEvent> } = getContext(TOOL_COORDINATOR_CONTEXT)

    eventStream.subscribe(e => {
        if (e !== null && get(toolMode) === mode) {
            const callback = callbacks[e.type]

            if (callback) {
                callback(e)
            } else {
                console.warn('No callback implemented for', e.type)
            }
        }
    })
}

export const getSinglePointPaths = (paths: Path[]) => {
    return paths.filter(({ points, mode }) =>
        points.length > 1 || mode === 'fill'
    )
}

interface CreateNewPathOpts {
    x: number
    y: number
    renderer: ToolRenderer
}

export const createNewPath = ({ renderer, x, y }: CreateNewPathOpts): Path => {
    renderer.beginPath(x, y)

    return {
        type: get(brushType),
        size: get(brushSize),
        mode: get(toolMode),
        points: [{ x, y }],
    }
}