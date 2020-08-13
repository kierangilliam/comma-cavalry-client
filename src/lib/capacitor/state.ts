import { Capacitor, Plugins } from '@capacitor/core'
import { wait } from '@lib/utils'
import { readable } from 'svelte/store'
const { Device, Keyboard } = Plugins

type Platforms = 'android' | 'unknown' | 'ios' | 'electron' | 'web'

export const isNative = Capacitor.isNative

export const platform = readable<Platforms>('unknown', function start(set) {
    (async () => {
        const { platform } = await Device.getInfo()

        set(platform)
    })()
})

export const keyboard = readable({
    visible: false,
    height: 0,
}, function start(set) {
    if (!isNative) return

    Keyboard.addListener('keyboardWillShow', async (info) => {
        set({
            visible: true,
            height: info.keyboardHeight,
        })

        if (document.activeElement) {
            // Wait for padding to be applied to view (TODO doesn't really work)
            await wait(150)
            document.activeElement.scrollTo(window.innerHeight / 2, 0)
        }
    })

    Keyboard.addListener('keyboardWillHide', () => {
        set({
            visible: false,
            height: 0,
        })
    })
})
