<template>
  <div class="kanban-toolbar">
    <TaskFilter
      :filters="filters"
      :task-counts="taskCounts"
      class="kanban-toolbar__fields"
      @update:filters="handleFiltersUpdate">
      <template #actions>
        <div class="kanban-toolbar__actions">
          <v-btn
            v-if="hasActiveFilters"
            variant="text"
            size="small"
            class="kanban-toolbar__secondary"
            prepend-icon="mdi-filter-off"
            @click="handleReset">
            Reset
          </v-btn>
          <v-btn
            color="primary"
            class="kanban-toolbar__primary"
            prepend-icon="mdi-plus"
            @click="handleNewTask">
            New Task
          </v-btn>
        </div>
      </template>
    </TaskFilter>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TaskFilter from '@/components/tasks/TaskFilter.vue'
import type { TaskFilters } from '@/models'
import { TaskStatus } from '@/models'

interface Props {
  filters: TaskFilters
  taskCounts?: Partial<Record<TaskStatus | 'all', number>>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: Partial<TaskFilters>]
  newTask: []
  reset: []
}>()

const hasActiveFilters = computed(
  () =>
    !!props.filters.search ||
    !!props.filters.status ||
    !!props.filters.priority ||
    props.filters.sortBy !== 'createdAt' ||
    props.filters.sortDir !== 'desc',
)

function handleFiltersUpdate(partial: Partial<TaskFilters>) {
  emit('update:filters', partial)
}

function handleReset() {
  emit('reset')
}

function handleNewTask() {
  emit('newTask')
}
</script>

<style scoped>
.kanban-toolbar {
  width: 100%;
  padding: 16px;
  border: 1px solid var(--app-border);
  border-radius: 28px;
  background: var(--app-surface);
  backdrop-filter: blur(16px);
  box-shadow: var(--app-shadow);
}

.kanban-toolbar__fields {
  width: 100%;
}

.kanban-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

.kanban-toolbar__toggle {
  border: 1px solid var(--app-border);
  border-radius: 16px;
  background: var(--app-surface-strong);
}

.kanban-toolbar__secondary {
  color: var(--app-muted);
}

.kanban-toolbar__primary {
  min-width: 128px;
}

:deep(.kanban-toolbar .v-field) {
  border-radius: 18px;
  background: var(--app-surface-strong);
}

:deep(.kanban-toolbar .v-field__outline) {
  --v-field-border-opacity: 1;
  color: var(--app-border-strong);
}

@media (max-width: 768px) {
  .kanban-toolbar {
    padding: 14px;
    border-radius: 22px;
  }

  .kanban-toolbar__fields,
  .kanban-toolbar__actions {
    width: 100%;
  }

  .kanban-toolbar__search,
  .kanban-toolbar__select {
    min-width: 100%;
  }
}
</style>
