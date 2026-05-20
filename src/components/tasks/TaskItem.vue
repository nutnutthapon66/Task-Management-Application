<template>
  <div
    class="task-item cursor-grab"
    :class="{ 'task-item--dragging': isDragging }"
    @mousedown="isDragging = false">
    <div class="task-item__body">

      <!-- Top row: priority chip + date -->
      <div class="task-item__topline">
        <span class="task-item__priority" :class="`task-item__priority--${task.priority}`">
          <v-icon :icon="priorityIcon" size="11" />
          {{ PRIORITY_LABELS[task.priority] }}
        </span>

        <div class="task-item__meta">
          <span v-if="task.dueDate" class="task-item__due" :class="{ 'task-item__due--overdue': isOverdue }">
            <v-icon icon="mdi-calendar-outline" size="11" />
            {{ formattedDue }}
          </span>
          <span class="task-item__created">{{ formattedCreated }}</span>
        </div>
      </div>

      <!-- Title + actions -->
      <div class="task-item__main">
        <p class="task-item__title">{{ task.title }}</p>
        <div class="task-item__actions">
          <button class="task-item__btn" title="Edit" @click.stop="emit('edit', task)">
            <v-icon icon="mdi-pencil-outline" size="14" />
          </button>
          <button class="task-item__btn task-item__btn--danger" title="Delete" @click.stop="emit('delete', task)">
            <v-icon icon="mdi-delete-outline" size="14" />
          </button>
        </div>
      </div>

      <!-- Description -->
      <p v-if="task.description" class="task-item__desc">{{ task.description }}</p>

    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from '@/plugins/dayjs'
import { ref, computed } from 'vue'
import type { Task } from '@/models'
import { TaskPriority, PRIORITY_LABELS } from '@/models'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [task: Task]
}>()

const isDragging = ref(false)

const priorityIcon = computed(() => {
  const map: Record<TaskPriority, string> = {
    [TaskPriority.LOW]:    'mdi-arrow-down',
    [TaskPriority.MEDIUM]: 'mdi-minus',
    [TaskPriority.HIGH]:   'mdi-arrow-up',
  }
  return map[props.task.priority]
})

const formattedCreated = computed(() => dayjs(props.task.createdAt).format('MMM D'))
const formattedDue = computed(() => props.task.dueDate ? dayjs(props.task.dueDate).format('MMM D') : '')
const isOverdue = computed(() =>
  !!props.task.dueDate && dayjs(props.task.dueDate).isBefore(dayjs(), 'day'),
)
</script>

<style scoped>
.task-item {
  border-radius: 16px;
  border: 1px solid var(--app-border-strong);
  background: var(--app-surface-strong);
  box-shadow: var(--app-shadow-sm);
  transition: border-color 0.18s, box-shadow 0.18s, transform 0.15s;
  margin-bottom: 10px;
  overflow: hidden;
}
.task-item:hover {
  border-color: color-mix(in srgb, var(--app-accent) 30%, transparent);
  box-shadow: var(--app-shadow);
  transform: translateY(-2px);
}
.task-item:hover .task-item__actions {
  opacity: 1;
}
.task-item--dragging {
  opacity: 0.55;
  box-shadow: var(--app-shadow-lg) !important;
  transform: rotate(1deg) scale(1.02);
}

/* Body */
.task-item__body {
  padding: 14px 14px 13px;
}

/* Top line */
.task-item__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.task-item__priority {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px 2px 6px;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
}
.task-item__priority--LOW {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border-color: rgba(16, 185, 129, 0.2);
}
.task-item__priority--MEDIUM {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.2);
}
.task-item__priority--HIGH {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border-color: rgba(239, 68, 68, 0.2);
}

.task-item__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-item__due {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.69rem;
  font-weight: 600;
  color: var(--app-muted);
}
.task-item__due--overdue {
  color: #dc2626;
}

.task-item__created {
  font-size: 0.69rem;
  color: var(--app-muted-light);
}

/* Main */
.task-item__main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
}

.task-item__title {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: var(--app-text);
  word-break: break-word;
  flex: 1;
}

.task-item__actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.task-item__btn {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--app-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.task-item__btn:hover {
  background: var(--app-accent-subtle);
  color: var(--app-accent);
}
.task-item__btn--danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* Description */
.task-item__desc {
  margin: 8px 0 0;
  font-size: 0.80rem;
  line-height: 1.65;
  color: var(--app-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cursor-grab {
  cursor: grab;
}
</style>
