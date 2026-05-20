<template>
  <v-card
    class="task-card mb-3 cursor-grab"
    :class="{ 'task-card--dragging': isDragging }"
    @mousedown="handleMouseDown">
    <v-card-text class="task-card__body">
      <div class="task-card__topline">
        <v-chip
          :color="priorityColor"
          size="x-small"
          variant="tonal"
          :prepend-icon="priorityIcon"
          class="task-card__priority">
          {{ PRIORITY_LABELS[task.priority] }}
        </v-chip>
        <span class="task-card__date">{{ formattedDate }}</span>
      </div>

      <div class="d-flex align-start justify-space-between mb-2">
        <p class="task-card__title flex-1 mr-2">
          {{ task.title }}
        </p>
        <div class="d-flex gap-1">
          <v-btn
            icon="mdi-pencil-outline"
            size="x-small"
            variant="text"
            class="task-card__action"
            @click.stop="handleEdit"
          />
          <v-btn
            icon="mdi-delete-outline"
            size="x-small"
            variant="text"
            color="error"
            class="task-card__action"
            @click.stop="handleDelete"
          />
        </div>
      </div>

      <p
        v-if="task.description"
        class="task-card__desc">
        {{ task.description }}
      </p>

      <div class="task-card__footer">
        <span class="task-card__status-dot" :style="{ backgroundColor: stripeColor }" />
        <span class="task-card__footer-copy">Ready to move</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import dayjs from '@/plugins/dayjs'
import { ref, computed } from 'vue'
import type { Task } from '@/models'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '@/models'

interface Props {
  task: Task
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [task: Task]
}>()

const isDragging = ref(false)

const priorityColor = computed(() => PRIORITY_COLORS[props.task.priority])

const stripeColorMap: Record<string, string> = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
}
const stripeColor = computed(() => stripeColorMap[priorityColor.value] ?? '#6366f1')

const priorityIcon = computed(() => {
  const map: Record<string, string> = {
    low: 'mdi-arrow-down',
    medium: 'mdi-minus',
    high: 'mdi-arrow-up',
  }
  return map[props.task.priority]
})

const formattedDate = computed(() => {
  return dayjs(props.task.createdAt).format('MMM D')
})

function handleMouseDown() {
  isDragging.value = false
}

function handleEdit() {
  emit('edit', props.task)
}

function handleDelete() {
  emit('delete', props.task)
}
</script>

<style scoped>
.task-card {
  border: 1px solid var(--app-border);
  background: var(--app-surface-strong);
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.15s;
}
.task-card:hover {
  border-color: rgba(37, 89, 214, 0.2);
  box-shadow: 0 12px 30px rgba(25, 39, 62, 0.08) !important;
  transform: translateY(-2px);
}
.task-card--dragging {
  opacity: 0.6;
  box-shadow: 0 14px 34px rgba(25, 39, 62, 0.18) !important;
  transform: rotate(0.8deg);
}

.task-card__body {
  padding: 16px !important;
}

.task-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.task-card__date {
  font-size: 0.74rem;
  color: var(--app-muted);
}

.task-card__title {
  margin: 0;
  font-size: 0.96rem;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: -0.02em;
  word-break: break-word;
}
.task-card__desc {
  margin: 0 0 14px;
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--app-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.task-card__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--app-border);
}

.task-card__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.task-card__footer-copy {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--app-muted);
}

.task-card__action {
  opacity: 0;
  transition: opacity 0.15s;
}
.task-card:hover .task-card__action {
  opacity: 1;
}
.cursor-grab {
  cursor: grab;
}
</style>
