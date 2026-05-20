export const TaskStatus = {
  TODO:        'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE:        'DONE',
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]
export type TaskStatusKey = keyof typeof TaskStatus

export const taskStatusMap: Record<TaskStatus, string> = {
  [TaskStatus.TODO]:        'Todo',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]:        'Done',
}

export const taskStatusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.TODO]:        'blue-grey',
  [TaskStatus.IN_PROGRESS]: 'primary',
  [TaskStatus.DONE]:        'success',
}

export const taskStatusOptions: { title: string; value: TaskStatus }[] = [
  { title: 'Todo',        value: TaskStatus.TODO },
  { title: 'In Progress', value: TaskStatus.IN_PROGRESS },
  { title: 'Done',        value: TaskStatus.DONE },
]

export function formatTaskStatus(status: TaskStatus): string {
  return taskStatusMap[status] || ''
}

export function getTaskStatusColor(status: TaskStatus): string {
  return taskStatusColorMap[status] || 'default'
}
