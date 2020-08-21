import { Writable, writable } from "svelte/store"

export const wait = async (ms: number) =>
    new Promise(res => setTimeout(() => res(), ms))

export const clamp = (value: number, min: number, max: number): number => {
    if (value < min) return min
    if (value > max) return max
    return value
}

/**
 * Persist a writable Svelte store to local storage
 */
export const persistent = <T>(key: string, initialValue: T): Writable<T> => {
    let value = initialValue

    try {
        const json = localStorage.getItem(key)
        if (json) {
            value = JSON.parse(json)
        }
    } catch (err) {
        console.error(err)
    }

    const state = writable(value)

    state.subscribe(($value): void => {
        localStorage.setItem(key, JSON.stringify($value))
    })

    return state
}

export const setCSSVar = ([name, value]: [string, string]) =>
    document.documentElement.style.setProperty(`--${name}`, value)

export const getCSSVar = (name: string) =>
    getComputedStyle(document.body).getPropertyValue(`--${name}`)

export const getCSSVarPx = (name: string) =>
    parseInt(getCSSVar(name).split('px')[0])

// TODO Terrible name
export const waitForEvent = <S>(Constructor: any, props: any, successEvent: string, errorEvent: string): Promise<S> => {
    return new Promise((resolve, reject) => {
        const element = new Constructor({
            target: document.body,
            props,
        })

        element.$on(successEvent, ({ detail }: CustomEvent<S>) => {
            resolve({ ...detail })
            element.$destroy()
        })

        element.$on(errorEvent, ({ detail }: CustomEvent<any>) => {
            console.log('ERROR EVENT', detail)
            reject({ ...detail })
            element.$destroy()
        })
    })
}

export async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = url

    return new Promise(resolve => {
        image.onload = () => resolve(image)
        image.onerror = (e) =>
            console.error('Filter: Could not load ', url)
    })
}

interface CopyImageDataOpts {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    image: CanvasImageSource
}

export const copyImageData = ({ ctx, x, y, image }: CopyImageDataOpts): ImageData => {
    ctx.drawImage(image, x, y, image.width as number, image.height as number)
    return ctx.getImageData(x, y, image.width as number, image.height as number)
}

interface RenderImageDataOpts {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    canvas: HTMLCanvasElement
    imageData: ImageData
}

export const renderImageData = ({ imageData, canvas, ctx, x, y }: RenderImageDataOpts) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.putImageData(imageData, x, y)
}
