import dayjs from '@/plugins/dayjs'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from '@/stores/useTaskStore'
import type { Task } from '@/models'
import { TaskStatus, TaskPriority } from '@/models'

const mockApi = {
  getAll: vi.fn().mockResolvedValue([]),
  create: vi.fn(),
  update: vi.fn(),
  updateStatus: vi.fn(),
  reorder: vi.fn(),
  remove: vi.fn(),
}

vi.mock('@/resources/provider/Task.provider', () => ({
  default: vi.fn(function () { return mockApi }),
}))

const mockTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Test Task',
  description: 'A test task',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  order: 0,
  createdAt: dayjs().toISOString(),
  ...overrides,
})

describe('useTaskStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockApi.getAll.mockResolvedValue([])
  })

  it('starts with an empty task list', () => {
    const store = useTaskStore()
    expect(store.tasks).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchTasks sets tasks from API', async () => {
    const tasks = [mockTask(), mockTask({ id: 2, title: 'Task 2', status: TaskStatus.DONE })]
    mockApi.getAll.mockResolvedValueOnce(tasks)

    const store = useTaskStore()
    await store.fetchTasks()

    expect(store.tasks).toEqual(tasks)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchTasks sets error on failure', async () => {
    mockApi.getAll.mockRejectedValueOnce(new Error('Network error'))

    const store = useTaskStore()
    await expect(store.fetchTasks()).rejects.toThrow()
    expect(store.error).toBe('Failed to load tasks.')
    expect(store.loading).toBe(false)
  })

  it('createTask appends task to list', async () => {
    const newTask = mockTask({ id: 42 })
    mockApi.create.mockResolvedValueOnce(newTask)

    const store = useTaskStore()
    const result = await store.createTask({
      title: 'Test Task',
      description: 'A test task',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    })

    expect(result).toEqual(newTask)
    expect(store.tasks).toContainEqual(newTask)
  })

  it('updateTask updates the matching task', async () => {
    const original = mockTask({ id: 5 })
    const updated = { ...original, title: 'Updated Title' }
    mockApi.update.mockResolvedValueOnce(updated)

    const store = useTaskStore()
    store.tasks = [original]
    await store.updateTask(5, { title: 'Updated Title' })

    expect(store.tasks[0].title).toBe('Updated Title')
  })

  it('deleteTask removes the task by id', async () => {
    mockApi.remove.mockResolvedValueOnce(undefined)

    const store = useTaskStore()
    store.tasks = [mockTask({ id: 3 }), mockTask({ id: 4 })]
    await store.deleteTask(3)

    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].id).toBe(4)
  })

  it('tasksByStatus groups tasks correctly', () => {
    const store = useTaskStore()
    store.tasks = [
      mockTask({ id: 1, status: TaskStatus.TODO, order: 0 }),
      mockTask({ id: 2, status: TaskStatus.IN_PROGRESS, order: 0 }),
      mockTask({ id: 3, status: TaskStatus.DONE, order: 0 }),
      mockTask({ id: 4, status: TaskStatus.TODO, order: 1 }),
    ]

    expect(store.tasksByStatus[TaskStatus.TODO]).toHaveLength(2)
    expect(store.tasksByStatus[TaskStatus.IN_PROGRESS]).toHaveLength(1)
    expect(store.tasksByStatus[TaskStatus.DONE]).toHaveLength(1)
  })

  it('filteredTasks filters by search string', () => {
    const store = useTaskStore()
    store.tasks = [
      mockTask({ id: 1, title: 'Fix login bug' }),
      mockTask({ id: 2, title: 'Add dashboard' }),
    ]
    store.setFilters({ search: 'login' })

    expect(store.filteredTasks).toHaveLength(1)
    expect(store.filteredTasks[0].id).toBe(1)
  })

  it('filteredTasks filters by priority', () => {
    const store = useTaskStore()
    store.tasks = [
      mockTask({ id: 1, priority: TaskPriority.HIGH }),
      mockTask({ id: 2, priority: TaskPriority.LOW }),
      mockTask({ id: 3, priority: TaskPriority.HIGH }),
    ]
    store.setFilters({ priority: TaskPriority.HIGH })

    expect(store.filteredTasks).toHaveLength(2)
  })

  it('resetFilters restores defaults', () => {
    const store = useTaskStore()
    store.setFilters({ search: 'foo', priority: TaskPriority.HIGH, sortBy: 'title' })
    store.resetFilters()

    expect(store.filters.search).toBe('')
    expect(store.filters.priority).toBe('')
    expect(store.filters.sortBy).toBe('createdAt')
    expect(store.filters.sortDir).toBe('desc')
  })

  it('moveTask updates task status optimistically', async () => {
    mockApi.updateStatus.mockResolvedValueOnce(mockTask())

    const store = useTaskStore()
    const task = mockTask({ id: 1, status: TaskStatus.TODO })
    store.tasks = [task]

    await store.moveTask(1, TaskStatus.DONE, 0)

    expect(store.tasks[0].status).toBe(TaskStatus.DONE)
  })
})
