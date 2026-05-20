import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: number
  message: string
  type: NotificationType
  timeout?: number
}

let uid = 0

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  function push(message: string, type: NotificationType = 'info', timeout = 3500) {
    const id = uid++
    notifications.value.push({ id, message, type, timeout })
    setTimeout(() => remove(id), timeout)
  }

  function remove(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  const success = (msg: string) => push(msg, 'success')
  const error = (msg: string) => push(msg, 'error', 5000)
  const info = (msg: string) => push(msg, 'info')
  const warning = (msg: string) => push(msg, 'warning')

  return { notifications, push, remove, success, error, info, warning }
})
