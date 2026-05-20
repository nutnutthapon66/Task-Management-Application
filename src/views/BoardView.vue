<template>
  <div class="board-view">
    <section class="board-view__hero">
      <div>
        <p class="board-view__eyebrow">Task Management</p>
        <h1 class="board-view__title">จัดการงานให้ชัดเจน ทุกขั้นตอน</h1>
        <p class="board-view__subtitle">
          สร้าง จัดลำดับ และติดตามงานผ่าน Kanban Board — Todo, In Progress, Done
        </p>
      </div>

      <div class="board-view__stats">
        <StatCard label="Total" :value="totalTasks" />
        <StatCard label="In Progress" :value="inProgressTasks" color="#6366f1" />
        <StatCard label="Done" :value="doneTasks" color="#10b981" />
      </div>
    </section>

    <div class="board-view__toolbar">
      <KanbanToolbar
        :filters="store.filters"
        :task-counts="taskCounts"
        @update:filters="store.setFilters"
        @new-task="handleCreateTask"
        @reset="handleResetFilters"
      />
    </div>

    <!-- Error Banner -->
    <v-alert
      v-if="store.error"
      type="error"
      variant="tonal"
      closable
      class="board-view__alert"
      @click:close="handleCloseError">
      {{ store.error }}
    </v-alert>

    <div class="board-view__board">
      <div class="board-view__columns">
        <KanbanColumn
          v-for="col in COLUMNS"
          :key="col"
          :status="col"
          :tasks="store.tasksByStatus[col]"
          :loading="store.loading"
          @add-task="handleAddTask"
          @edit-task="openEdit"
          @delete-task="confirmDelete"
          @task-moved="onTaskMoved"
          @tasks-reordered="onTasksReordered"
        />
      </div>
    </div>

    <!-- Task Dialog -->
    <TaskDialog
      v-model="dialogOpen"
      :task="editingTask"
      @save="onSave"
    />

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      v-model="deleteDialogOpen"
      :title="`Delete &quot;${deletingTask?.title}&quot;?`"
      @confirm="onDeleteConfirmed"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import KanbanColumn from '@/components/kanban/KanbanColumn.vue'
import KanbanToolbar from '@/components/kanban/KanbanToolbar.vue'
import TaskDialog from '@/components/tasks/TaskDialog.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { useTaskStore } from '@/stores/useTaskStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import type { Task, TaskFormData } from '@/models'
import { TaskStatus } from '@/models'

const COLUMNS: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]

const store = useTaskStore()
const notify = useNotificationStore()

const dialogOpen = ref<boolean>(false)
const editingTask = ref<Task | null>(null)
const defaultStatus = ref<TaskStatus>(TaskStatus.TODO)

const deleteDialogOpen = ref<boolean>(false)
const deletingTask = ref<Task | null>(null)
const deleteLoading = ref<boolean>(false)

const totalTasks = computed(() => store.tasks.length)
const inProgressTasks = computed(() => store.tasksByStatus[TaskStatus.IN_PROGRESS].length)
const doneTasks = computed(() => store.tasksByStatus[TaskStatus.DONE].length)

const taskCounts = computed(() => ({
  all: store.tasks.length,
  [TaskStatus.TODO]: store.tasks.filter((t) => t.status === TaskStatus.TODO).length,
  [TaskStatus.IN_PROGRESS]: store.tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
  [TaskStatus.DONE]: store.tasks.filter((t) => t.status === TaskStatus.DONE).length,
}))

onMounted(() => store.fetchTasks())

function openCreate(status: TaskStatus = TaskStatus.TODO) {
  editingTask.value = null
  defaultStatus.value = status
  dialogOpen.value = true
}

function openEdit(task: Task) {
  editingTask.value = task
  dialogOpen.value = true
}

function confirmDelete(task: Task) {
  deletingTask.value = task
  deleteDialogOpen.value = true
}

async function onSave(payload: TaskFormData) {
  try {
    if (editingTask.value) {
      await store.updateTask(editingTask.value.id, payload)
      notify.success('Task updated successfully')
    } else {
      const finalPayload = { ...payload, status: payload.status || defaultStatus.value }
      await store.createTask(finalPayload)
      notify.success('Task created successfully')
    }
    dialogOpen.value = false
    editingTask.value = null
  } catch {
    notify.error(editingTask.value ? 'Failed to update task' : 'Failed to create task')
  }
}

async function onDeleteConfirmed() {
  if (!deletingTask.value) return
  deleteLoading.value = true
  try {
    await store.deleteTask(deletingTask.value.id)
    notify.success(`"${deletingTask.value.title}" deleted`)
    deleteDialogOpen.value = false
    deletingTask.value = null
  } catch {
    notify.error('Failed to delete task')
  } finally {
    deleteLoading.value = false
  }
}

async function onTaskMoved(taskId: number, newStatus: TaskStatus, newOrder: number) {
  try {
    await store.moveTask(taskId, newStatus, newOrder)
  } catch {
    notify.error('Failed to move task — please try again')
    await store.fetchTasks()
  }
}

async function onTasksReordered(updates: { id: number; order: number }[]) {
  try {
    await Promise.all(updates.map((u) => store.reorderTask(u.id, u.order)))
  } catch {
    // silent — reorder failures don't need to bother the user
  }
}

function handleCreateTask() {
  openCreate()
}

function handleAddTask(status: TaskStatus) {
  openCreate(status)
}

function handleResetFilters() {
  store.resetFilters()
}

function handleCloseError() {
  store.error = null
}

function handleDeleteCancel() {
  deletingTask.value = null
}
</script>

<style scoped>
.board-view {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 14px 28px;
  color: var(--app-text);
}

.board-view__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, 1fr);
  align-items: center;
  gap: 24px;
  padding: 8px 4px 22px;
}

.board-view__eyebrow {
  margin: 0 0 8px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--app-accent);
}

.board-view__title {
  max-width: 640px;
  margin: 0;
  font-size: clamp(1.7rem, 2.8vw, 2.75rem);
  line-height: 1.06;
  letter-spacing: -0.04em;
  color: var(--app-text);
}

.board-view__subtitle {
  max-width: 520px;
  margin: 10px 0 0;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--app-muted);
}

.board-view__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.board-view__toolbar {
  flex-shrink: 0;
  margin-bottom: 16px;
}

.board-view__board {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  padding-bottom: 8px;
}

.board-view__alert {
  margin: 0 0 14px;
  border-radius: 16px;
}

.board-view__columns {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  min-width: fit-content;
  height: 100%;
}

@media (max-width: 768px) {
  .board-view {
    padding: 16px 10px 20px;
  }

  .board-view__hero {
    grid-template-columns: 1fr;
    padding: 4px 2px 14px;
  }

  .board-view__stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .board-view__columns {
    flex-direction: column;
    min-width: unset;
    gap: 12px;
  }
}
</style>
