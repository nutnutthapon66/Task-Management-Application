import dayjs from '@/plugins/dayjs'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import TaskProvider from '@/resources/provider/Task.provider'
import type { Task, TaskFormData, TaskFilters } from '@/models'
import { TaskStatus, PRIORITY_ORDER } from '@/models'

export const useTaskStore = defineStore('tasks', () => {
  const tasksApi = new TaskProvider()
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = ref<TaskFilters>({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
  })

  const shouldUseManualOrder = computed(
    () => filters.value.sortBy === 'createdAt' && filters.value.sortDir === 'desc',
  )

  // Filtered + sorted tasks
  const filteredTasks = computed(() => {
    let result = [...tasks.value]

    if (filters.value.search.trim()) {
      const q = filters.value.search.trim().toLowerCase()
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      )
    }

    if (filters.value.status) {
      result = result.filter((t) => t.status === filters.value.status)
    }

    if (filters.value.priority) {
      result = result.filter((t) => t.priority === filters.value.priority)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (filters.value.sortBy === 'priority') {
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      } else if (filters.value.sortBy === 'title') {
        cmp = a.title.localeCompare(b.title)
      } else if (filters.value.sortBy === 'dueDate') {
        // tasks without dueDate go last
        const aVal = a.dueDate ? dayjs(a.dueDate).valueOf() : Infinity
        const bVal = b.dueDate ? dayjs(b.dueDate).valueOf() : Infinity
        cmp = aVal - bVal
      } else {
        cmp = dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
      }
      return filters.value.sortDir === 'asc' ? cmp : -cmp
    })

    return result
  })

  const tasksByStatus = computed(() => {
    const map: Record<TaskStatus, Task[]> = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    }
    for (const task of filteredTasks.value) {
      map[task.status].push(task)
    }

    // Preserve drag-and-drop order for the default board view.
    // Alternative sort modes should keep the order produced by filteredTasks.
    if (shouldUseManualOrder.value) {
      for (const col of Object.values(TaskStatus)) {
        map[col].sort((a, b) => a.order - b.order)
      }
    }

    return map
  })

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await tasksApi.getAll()
    } catch (e) {
      error.value = 'Failed to load tasks.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload: TaskFormData): Promise<Task> {
    const data = await tasksApi.create(payload)
    tasks.value.push(data)
    return data
  }

  async function updateTask(id: number, payload: Partial<TaskFormData>): Promise<Task> {
    const data = await tasksApi.update(id, payload)
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx !== -1) tasks.value[idx] = data
    return data
  }

  async function moveTask(id: number, status: TaskStatus, order: number): Promise<void> {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      task.status = status
      task.order = order
    }
    await tasksApi.updateStatus(id, status, order)
  }

  async function reorderTask(id: number, order: number): Promise<void> {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.order = order
    await tasksApi.reorder(id, order)
  }

  async function deleteTask(id: number): Promise<void> {
    await tasksApi.remove(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function setFilters(partial: Partial<TaskFilters>) {
    filters.value = { ...filters.value, ...partial }
  }

  function resetFilters() {
    filters.value = { search: '', status: '', priority: '', sortBy: 'createdAt', sortDir: 'desc' }
  }

  return {
    tasks,
    loading,
    error,
    filters,
    filteredTasks,
    tasksByStatus,
    fetchTasks,
    createTask,
    updateTask,
    moveTask,
    reorderTask,
    deleteTask,
    setFilters,
    resetFilters,
  }
})
