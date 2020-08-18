import { Confirmation } from '@lib/components'
import { waitForEvent } from './utils'

const confirm = async (question: string): Promise<boolean> => {
    try {
        await waitForEvent(Confirmation, { question }, 'confirmed', 'denied')
        return true
    } catch {
        return false
    }
}

export const notifications = {
    confirm,
}