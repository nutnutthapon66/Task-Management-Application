<template>
  <draggable
    :list="localTasks"
    group="tasks"
    item-key="id"
    class="task-list"
    :class="{ 'task-list--empty': !tasks.length }"
    ghost-class="task-ghost"
    chosen-class="task-chosen"
    drag-class="task-drag"
    :animation="200"
    @change="onChange">
    <template #item="{ element }">
      <TaskItem
        :task="element"
        @edit="(t) => emit('editTask', t)"
        @delete="(t) => emit('deleteTask', t)"
      />
    </template>

    <template #footer>
      <template v-if="loading">
        <TaskCardSkeleton v-for="n in 3" :key="`sk-${n}`" />
      </template>

      <div v-else-if="!tasks.length" class="task-list__empty">
        <v-icon icon="mdi-clipboard-text-outline" size="32" color="grey-lighten-1" />
        <p class="task-list__empty-title">Nothing here yet</p>
        <p class="task-list__empty-copy">Drop a task here or add a new one.</p>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import TaskItem from '@/components/tasks/TaskItem.vue'
import TaskCardSkeleton from '@/components/tasks/TaskCardSkeleton.vue'
import type { Task } from '@/models'
import { TaskStatus } from '@/models'

interface Props {
  tasks: Task[]
  status: TaskStatus
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { loading: false })
const emit = defineEmits<{
  taskMoved: [taskId: number, newStatus: TaskStatus, newOrder: number]
  tasksReordered: [updates: { id: number; order: number }[]]
  editTask: [task: Task]
  deleteTask: [task: Task]
}>()

const localTasks = ref<Task[]>([])

watch(
  () => props.tasks,
  (tasks) => { localTasks.value = [...tasks] },
  { immediate: true, deep: true },
)

interface DraggableChange {
  added?: { element: Task; newIndex: number }
  removed?: { element: Task; oldIndex: number }
  moved?: { element: Task; oldIndex: number; newIndex: number }
}

function onChange(evt: DraggableChange) {
  if (evt.added) {
    const { element, newIndex } = evt.added
    emit('taskMoved', element.id, props.status, newIndex)
  } else if (evt.moved) {
    const reordered = localTasks.value.map((t, i) => ({ id: t.id, order: i }))
    emit('tasksReordered', reordered)
  }
}
</script>

<style scoped>
.task-list {
  min-height: 420px;
  padding: 8px 2px 2px;
  border-radius: 20px;
  transition: background-color 0.2s, border-color 0.2s;
}

.task-list--empty {
  border: 1px dashed var(--app-border-strong);
}

.task-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  padding: 32px 18px;
  pointer-events: none;
  text-align: center;
}

.task-list__empty-title {
  margin: 12px 0 4px;
  font-size: 0.92rem;
  font-weight: 700;
}

.task-list__empty-copy {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--app-muted);
}

:deep(.task-ghost) {
  opacity: 0.35;
  background: rgba(37, 89, 214, 0.08);
  border-radius: 20px;
}

:deep(.task-chosen) {
  cursor: grabbing;
}

:deep(.task-drag) {
  opacity: 0.9;
  box-shadow: 0 20px 48px rgba(25, 39, 62, 0.18) !important;
  transform: rotate(0.5deg);
}

@media (max-width: 768px) {
  .task-list {
    min-height: 120px;
  }
}
</style>
