import Confirmation from './components/notifications/Confirmation.svelte'
import Notification from './components/notifications/Notification.svelte'
import { waitForEvent } from './utils'

const confirm = async (question: string): Promise<boolean> => {
    try {
        await waitForEvent(Confirmation, { question }, 'confirmed', 'denied')
        return true
    } catch {
        return false
    }
}

const success = (title: string, body?: string) => {
    createNotification(title, body, 'var(--primary)')
}

const error = (title: string, body: string) => {
    createNotification(title, body, 'var(--red)')
}

const createNotification = (title: string, body: string, color: string) => {
    const element = new Notification({
        target: document.body,
        props: { title, body, color },
        intro: true,
    })

    element.$on('inactive', _ => { element.$destroy() })
}

export const notifications = {
    confirm,
    success,
    error,
}