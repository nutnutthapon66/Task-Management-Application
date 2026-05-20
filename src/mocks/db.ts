import dayjs from '@/plugins/dayjs'
import type { Task } from '@/models'
import { TaskStatus, TaskPriority } from '@/models'

let nextId = 10

const seed: Task[] = [
  {
    id: 1,
    title: 'Define task categories and labels',
    description: 'Agree on a standard set of categories and color-coded labels for all tasks.',
    status: TaskStatus.DONE,
    priority: TaskPriority.HIGH,
    order: 0,
    createdAt: dayjs().subtract(5, 'day').toISOString(),
  },
  {
    id: 2,
    title: 'Set up user roles and permissions',
    description: 'Configure admin, member, and viewer roles with appropriate access levels.',
    status: TaskStatus.DONE,
    priority: TaskPriority.HIGH,
    order: 1,
    createdAt: dayjs().subtract(4, 'day').toISOString(),
  },
  {
    id: 3,
    title: 'Implement task assignment workflow',
    description: 'Allow tasks to be assigned to team members with email notifications on change.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    order: 0,
    createdAt: dayjs().subtract(3, 'day').toISOString(),
    dueDate: dayjs().add(1, 'day').toISOString(),
  },
  {
    id: 4,
    title: 'Build recurring task scheduler',
    description: 'Support daily, weekly, and monthly recurrence rules for repeating tasks.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    order: 1,
    createdAt: dayjs().subtract(2, 'day').toISOString(),
    dueDate: dayjs().add(3, 'day').toISOString(),
  },
  {
    id: 5,
    title: 'Add task comment threads',
    description: 'Enable team members to leave comments and replies directly on a task.',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    order: 0,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    dueDate: dayjs().add(5, 'day').toISOString(),
  },
  {
    id: 6,
    title: 'Export tasks to CSV and PDF',
    description: 'Provide one-click export of the current task list with applied filters.',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    order: 1,
    createdAt: dayjs().subtract(6, 'hour').toISOString(),
    dueDate: dayjs().add(7, 'day').toISOString(),
  },
  {
    id: 7,
    title: 'Integrate calendar view',
    description: 'Display tasks on a monthly calendar based on their due dates.',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    order: 2,
    createdAt: dayjs().subtract(3, 'hour').toISOString(),
  },
  {
    id: 8,
    title: 'Send overdue task reminders',
    description: 'Automatically notify assignees when a task passes its due date without completion.',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    order: 3,
    createdAt: dayjs().subtract(1, 'hour').toISOString(),
    dueDate: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    id: 9,
    title: 'Dashboard analytics and progress report',
    description: 'Show completion rates, workload distribution, and trend charts per team member.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.LOW,
    order: 2,
    createdAt: dayjs().toISOString(),
    dueDate: dayjs().add(2, 'day').toISOString(),
  },
]

export const db = {
  tasks: [...seed] as Task[],

  getAll(): Task[] {
    return [...this.tasks].sort((a, b) => a.order - b.order)
  },

  getById(id: number): Task | undefined {
    return this.tasks.find((t) => t.id === id)
  },

  create(payload: { title: string; description: string; status: TaskStatus; priority: TaskPriority }): Task {
    const sameStatus = this.tasks.filter((t) => t.status === payload.status)
    const maxOrder = sameStatus.length ? Math.max(...sameStatus.map((t) => t.order)) + 1 : 0
    const task: Task = {
      id: nextId++,
      ...payload,
      order: maxOrder,
      createdAt: dayjs().toISOString(),
    }
    this.tasks.push(task)
    return task
  },

  update(id: number, payload: Partial<Task>): Task | undefined {
    const idx = this.tasks.findIndex((t) => t.id === id)
    if (idx === -1) return undefined
    this.tasks[idx] = { ...this.tasks[idx], ...payload }
    return this.tasks[idx]
  },

  delete(id: number): boolean {
    const idx = this.tasks.findIndex((t) => t.id === id)
    if (idx === -1) return false
    this.tasks.splice(idx, 1)
    return true
  },
}
