export const TaskPriority = {
  LOW:    'LOW',
  MEDIUM: 'MEDIUM',
  HIGH:   'HIGH',
} as const

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority]
export type TaskPriorityKey = keyof typeof TaskPriority

export const taskPriorityMap: Record<TaskPriority, string> = {
  [TaskPriority.LOW]:    'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]:   'High',
}

export const taskPriorityColorMap: Record<TaskPriority, string> = {
  [TaskPriority.LOW]:    'success',
  [TaskPriority.MEDIUM]: 'warning',
  [TaskPriority.HIGH]:   'error',
}

export const taskPriorityOrderMap: Record<TaskPriority, number> = {
  [TaskPriority.HIGH]:   3,
  [TaskPriority.MEDIUM]: 2,
  [TaskPriority.LOW]:    1,
}

export const taskPriorityOptions: { title: string; value: TaskPriority }[] = [
  { title: 'Low',    value: TaskPriority.LOW },
  { title: 'Medium', value: TaskPriority.MEDIUM },
  { title: 'High',   value: TaskPriority.HIGH },
]

export function formatTaskPriority(priority: TaskPriority): string {
  return taskPriorityMap[priority] || ''
}

export function getTaskPriorityColor(priority: TaskPriority): string {
  return taskPriorityColorMap[priority] || 'default'
}
