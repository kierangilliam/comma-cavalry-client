import {
    HapticsImpactStyle,
    HapticsNotificationType, Plugins
} from '@capacitor/core'
import { isNative } from './state'

const { Haptics: CapacitorHaptics } = Plugins

CapacitorHaptics.selectionStart()

function notify(type: HapticsNotificationType) {
    if (!isNative) {
        console.debug('Buzz!', type)
        return
    }

    CapacitorHaptics.notification({ type })
}

function vibrate(style: HapticsImpactStyle) {
    if (!isNative) {
        console.debug('Buzz!', style)
        return
    }

    CapacitorHaptics.impact({ style })
    CapacitorHaptics.vibrate()
}

export module Haptics {
    export function success() {
        notify(HapticsNotificationType.SUCCESS)
    }

    export function error() {
        notify(HapticsNotificationType.ERROR)
    }

    export function warning() {
        notify(HapticsNotificationType.WARNING)
    }

    export function select() {
        CapacitorHaptics.selectionChanged()
    }

    export function heavy() {
        vibrate(HapticsImpactStyle.Heavy)
    }

    export function medium() {
        vibrate(HapticsImpactStyle.Medium)
    }

    export function light() {
        vibrate(HapticsImpactStyle.Light)
    }
}