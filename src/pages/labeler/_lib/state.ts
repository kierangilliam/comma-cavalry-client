import type { ClassType, Path, Point } from '@lib/types'
import { params } from '@sveltech/routify'
import { quintOut } from 'svelte/easing'
import { tweened } from 'svelte/motion'
import { derived, get, writable } from 'svelte/store'

export const paths = writable<Path[]>([])

export const toolMode = writable<'autoLine' | 'fill' | 'brush' | 'move'>('autoLine')

export const brushSize = writable<number>(10)

export const brushType = writable<ClassType>('road')

export const zoom = tweened<number>(1, {
    duration: 500,
    easing: quintOut,
})

export const overlayOpacity = writable<number>(.5)

export const isTouching = writable<boolean>(false)

export const origin = writable<Point>({ x: -400, y: 0 })

// TODO can i replace canvasPosition using cursor instead?
export const cursor = writable<Point>(null)

export const canvasPosition = tweened<Point>({ x: -400, y: 0 }, {
    duration: 500,
    easing: quintOut,
})

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
    [origin, zoom, canvasPosition],
    ([$origin, $zoom, $canvasPosition]) => {
        return `
            position: absolute;
            transform-origin: ${$origin.x}px ${$origin.y}px;
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

export const reset = () => {
    paths.set([])
    toolMode.set('brush')
    brushSize.set(10)
    brushType.set('road')
    zoom.set(1)
    overlayOpacity.set(.5)
}