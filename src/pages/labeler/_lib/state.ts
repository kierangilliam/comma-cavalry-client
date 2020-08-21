import { IMAGE_WIDTH } from '@lib/constants'
import type { Cursor, Path, PathType, Point, ToolMode } from '@lib/types'
import { persistent } from '@lib/utils'
import { params } from '@sveltech/routify'
import { quintOut } from 'svelte/easing'
import { tweened } from 'svelte/motion'
import { derived, get, writable } from 'svelte/store'

const defaults = {
    zoom: window.innerWidth / IMAGE_WIDTH,
    opacity: .5,
    brushType: 'road' as PathType,
    mode: 'brush' as ToolMode,
    brushSize: 10,
    canvasPosition: {
        // Center x in screen
        x: (window.innerWidth / 2) - (IMAGE_WIDTH / 2), y: 0
    },
}

export const paths = writable<Path[]>([])

export const toolMode = writable<ToolMode>(defaults.mode)
export const brushSize = writable<number>(defaults.brushSize)
export const brushType = writable<PathType>(defaults.brushType)

const tweenMotionParams = { duration: 1000, easing: quintOut }
export const zoom = tweened<number>(defaults.zoom, tweenMotionParams)
export const overlayOpacity = writable<number>(defaults.opacity)
export const canvasPosition = tweened<Point>(defaults.canvasPosition, tweenMotionParams)

export const cursor = writable<Cursor>(null)
export const isTouching = writable<boolean>(false)

export const showTutorial = persistent('showEditorTutorial', true)

// Canny parameters
export const highThreshold = writable<number>(50)
export const lowThreshold = writable<number>(10)
export const blurRadius = writable<number>(.5)

// Dirty - Have changes been saved?
export const dirty = derived(
    paths,
    ($paths) => {
        const pathsString = JSON.stringify($paths)
        const saved = JSON.parse(localStorage.getItem('saved'))
        const { id } = get(params)
        const savedPathsString = JSON.stringify(
            saved
                ? saved[id]?.paths || []
                : []
        )

        return savedPathsString !== pathsString
    }
)

export const imageStyle = derived(
    [zoom, canvasPosition],
    ([$zoom, $canvasPosition]) => {
        const originX = (window.innerWidth / 2) - $canvasPosition.x
        const originY = (window.innerHeight / 2) - $canvasPosition.y
        return `
            position: absolute;
            transform-origin: ${originX}px ${originY}px;
            transform: scale(${$zoom});
            top: ${$canvasPosition.y}px;
            left: ${$canvasPosition.x}px;
        `
    }
)

export const canvasStyle = derived(
    [imageStyle, overlayOpacity],
    ([$imageStyle, $overlayOpacity]) => {
        return $imageStyle + `opacity: ${$overlayOpacity};`
    }
)

export const resetState = () => {
    paths.set([])
    toolMode.set(defaults.mode)
    brushSize.set(defaults.brushSize)
    brushType.set(defaults.brushType)
    zoom.set(defaults.zoom)
    overlayOpacity.set(defaults.opacity)
}