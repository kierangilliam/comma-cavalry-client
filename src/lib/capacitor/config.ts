import { Plugins } from '@capacitor/core'
import { isNative } from './state'
const { Keyboard } = Plugins

export function setup() {
    if (isNative) {
        Keyboard.setAccessoryBarVisible({ isVisible: true })
    }
}