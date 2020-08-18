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
    document.documentElement.style.getPropertyValue(`--${name}`)

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