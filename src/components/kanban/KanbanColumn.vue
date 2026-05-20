<template>
  <div class="kanban-column d-flex flex-column">
    <div class="kanban-column__header">
      <div class="kanban-column__heading">
        <span class="kanban-column__dot" :style="{ background: dotColor }" />
        <div>
          <p class="kanban-column__label">{{ STATUS_LABELS[status] }}</p>
          <span class="kanban-column__hint">{{ columnHint }}</span>
        </div>
      </div>
      <div class="kanban-column__header-end">
        <span class="kanban-column__count">{{ tasks.length }}</span>
        <button
          class="kanban-column__add"
          :title="`Add task to ${STATUS_LABELS[status]}`"
          @click="emit('addTask', status)">
          <v-icon icon="mdi-plus" size="16" />
        </button>
      </div>
    </div>

    <TaskList
      :tasks="tasks"
      :status="status"
      :loading="loading"
      class="kanban-column__list flex-1"
      @task-moved="(id, s, o) => emit('taskMoved', id, s, o)"
      @tasks-reordered="(u) => emit('tasksReordered', u)"
      @edit-task="(t) => emit('editTask', t)"
      @delete-task="(t) => emit('deleteTask', t)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TaskList from '@/components/tasks/TaskList.vue'
import type { Task } from '@/models'
import { TaskStatus, STATUS_LABELS } from '@/models'

interface Props {
  status: TaskStatus
  tasks: Task[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { loading: false })
const emit = defineEmits<{
  addTask: [status: TaskStatus]
  editTask: [task: Task]
  deleteTask: [task: Task]
  taskMoved: [taskId: number, newStatus: TaskStatus, newOrder: number]
  tasksReordered: [updates: { id: number; order: number }[]]
}>()

const dotColorMap: Record<TaskStatus, string> = {
  [TaskStatus.TODO]:        '#94a3b8',
  [TaskStatus.IN_PROGRESS]: '#6366f1',
  [TaskStatus.DONE]:        '#10b981',
}
const dotColor = computed(() => dotColorMap[props.status])

const columnHint = computed(() => {
  if (props.status === TaskStatus.TODO) return 'Planned next'
  if (props.status === TaskStatus.IN_PROGRESS) return 'Active focus'
  return 'Completed work'
})
</script>

<style scoped>
.kanban-column {
  min-width: 300px;
  max-width: 340px;
  width: 100%;
  flex: 1;
  padding: 16px 14px;
  border: 1px solid var(--app-border-strong);
  border-radius: 24px;
  background: var(--app-surface);
  backdrop-filter: blur(20px) saturate(140%);
  box-shadow: var(--app-shadow);
}

.kanban-column__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 0 2px;
}

.kanban-column__heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kanban-column__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 12%, transparent);
}

.kanban-column__label {
  margin: 0 0 1px;
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--app-text);
}

.kanban-column__hint {
  font-size: 0.70rem;
  color: var(--app-muted);
  font-weight: 500;
}

.kanban-column__header-end {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kanban-column__count {
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--app-surface-strong);
  border: 1px solid var(--app-border-strong);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--app-muted);
}

.kanban-column__add {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid var(--app-border-strong);
  background: var(--app-surface-strong);
  color: var(--app-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.kanban-column__add:hover {
  background: var(--app-accent-subtle);
  border-color: color-mix(in srgb, var(--app-accent) 25%, transparent);
  color: var(--app-accent);
}

@media (max-width: 768px) {
  .kanban-column {
    min-width: unset;
    max-width: 100%;
    padding: 14px 12px;
    border-radius: 20px;
  }
}
</style>
