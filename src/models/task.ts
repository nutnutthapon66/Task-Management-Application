export { TaskStatus, TaskPriority } from './enums/index'
export {
  taskStatusMap,
  taskStatusColorMap,
  taskStatusOptions,
  formatTaskStatus,
  getTaskStatusColor,
  taskPriorityMap,
  taskPriorityColorMap,
  taskPriorityOrderMap,
  taskPriorityOptions,
  formatTaskPriority,
  getTaskPriorityColor,
} from './enums/index'

import { TaskStatus, TaskPriority, taskPriorityOrderMap } from './enums/index'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  order: number
  createdAt: string
  dueDate?: string
}

export interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
}

export interface TaskFilters {
  search: string
  status: TaskStatus | ''
  priority: TaskPriority | ''
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title'
  sortDir: 'asc' | 'desc'
}

// Backwards-compat aliases so existing imports keep working
export const PRIORITY_ORDER = taskPriorityOrderMap

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'Todo',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'success',
  [TaskPriority.MEDIUM]: 'warning',
  [TaskPriority.HIGH]: 'error',
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'blue-grey',
  [TaskStatus.IN_PROGRESS]: 'primary',
  [TaskStatus.DONE]: 'success',
}
