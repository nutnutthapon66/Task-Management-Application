import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '@/stores/useNotificationStore'

describe('useNotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with no notifications', () => {
    const store = useNotificationStore()
    expect(store.notifications).toEqual([])
  })

  it('push adds a notification', () => {
    const store = useNotificationStore()
    store.push('Hello world', 'success')
    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0].message).toBe('Hello world')
    expect(store.notifications[0].type).toBe('success')
  })

  it('remove deletes a notification by id', () => {
    const store = useNotificationStore()
    store.push('A', 'info')
    store.push('B', 'error')
    const id = store.notifications[0].id
    store.remove(id)
    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0].message).toBe('B')
  })

  it('success helper sets type to success', () => {
    const store = useNotificationStore()
    store.success('Done!')
    expect(store.notifications[0].type).toBe('success')
  })

  it('error helper sets type to error', () => {
    const store = useNotificationStore()
    store.error('Oops')
    expect(store.notifications[0].type).toBe('error')
  })

  it('each notification gets a unique id', () => {
    const store = useNotificationStore()
    store.push('A', 'info')
    store.push('B', 'info')
    const ids = store.notifications.map((n) => n.id)
    expect(new Set(ids).size).toBe(2)
  })
})
