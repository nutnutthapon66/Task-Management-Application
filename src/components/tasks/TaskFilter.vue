<template>
  <div class="task-filter">
    <!-- Status chips with counts -->
    <div class="task-filter__status-row">
      <v-chip
        v-for="s in statusChips"
        :key="s.value"
        :color="filters.status === s.value ? s.color : undefined"
        :variant="filters.status === s.value ? 'tonal' : 'outlined'"
        size="small"
        class="task-filter__status-chip"
        @click="handleStatusClick(s.value)">
        {{ s.label }}
        <span class="task-filter__status-count">{{ s.value === '' ? (taskCounts.all ?? 0) : (taskCounts[s.value] ?? 0) }}</span>
      </v-chip>
    </div>

    <!-- Search + selects -->
    <div class="task-filter__controls">
      <v-text-field
        :model-value="filters.search"
        placeholder="Search tasks"
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details
        density="compact"
        class="task-filter__search"
        @update:model-value="handleSearchUpdate"
        @click:clear="handleClearSearch"
      />

      <v-select
        :model-value="filters.priority"
        :items="priorityItems"
        item-title="label"
        item-value="value"
        label="Priority"
        hide-details
        density="compact"
        clearable
        class="task-filter__select"
        @update:model-value="handlePriorityUpdate"
      />

      <v-select
        :model-value="filters.sortBy"
        :items="sortByItems"
        item-title="label"
        item-value="value"
        label="Sort"
        hide-details
        density="compact"
        class="task-filter__select"
        @update:model-value="handleSortByUpdate"
      />

      <v-btn-toggle
        :model-value="filters.sortDir"
        mandatory
        density="compact"
        class="task-filter__toggle"
        @update:model-value="handleSortDirUpdate">
        <v-btn value="asc" size="small" icon="mdi-sort-ascending" title="Ascending" />
        <v-btn value="desc" size="small" icon="mdi-sort-descending" title="Descending" />
      </v-btn-toggle>

      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskFilters } from '@/models'
import { TaskStatus, TaskPriority, STATUS_LABELS, STATUS_COLORS } from '@/models'

interface Props {
  filters: TaskFilters
  taskCounts?: Partial<Record<TaskStatus | 'all', number>>
}

const props = withDefaults(defineProps<Props>(), { taskCounts: () => ({}) })
const emit = defineEmits<{
  'update:filters': [filters: Partial<TaskFilters>]
}>()

function update<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
  emit('update:filters', { [key]: value } as Partial<TaskFilters>)
}

const statusChips: { label: string; value: TaskStatus | ''; color: string }[] = [
  { label: 'All', value: '', color: 'default' },
  { label: STATUS_LABELS[TaskStatus.TODO], value: TaskStatus.TODO, color: STATUS_COLORS[TaskStatus.TODO] },
  { label: STATUS_LABELS[TaskStatus.IN_PROGRESS], value: TaskStatus.IN_PROGRESS, color: STATUS_COLORS[TaskStatus.IN_PROGRESS] },
  { label: STATUS_LABELS[TaskStatus.DONE], value: TaskStatus.DONE, color: STATUS_COLORS[TaskStatus.DONE] },
]

const priorityItems: { label: string; value: TaskPriority | '' }[] = [
  { label: 'All Priorities', value: '' },
  { label: 'High', value: TaskPriority.HIGH },
  { label: 'Medium', value: TaskPriority.MEDIUM },
  { label: 'Low', value: TaskPriority.LOW },
]

const sortByItems = [
  { label: 'Date Created', value: 'createdAt' },
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'Title (A–Z)', value: 'title' },
]

function handleStatusClick(value: TaskStatus | '') {
  update('status', value === props.filters.status ? '' : value)
}

function handleClearSearch() {
  update('search', '')
}

function handleSearchUpdate(value: string | null) {
  update('search', value ?? '')
}

function handlePriorityUpdate(value: TaskPriority | '' | null) {
  update('priority', value ?? '')
}

function handleSortByUpdate(value: TaskFilters['sortBy']) {
  update('sortBy', value)
}

function handleSortDirUpdate(value: TaskFilters['sortDir']) {
  update('sortDir', value)
}
</script>

<style scoped>
.task-filter {
  display: flex;
  flex: 1 1 520px;
  flex-direction: column;
  gap: 10px;
}

.task-filter__status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.task-filter__status-chip {
  cursor: pointer;
  gap: 6px;
}

.task-filter__status-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
}

.task-filter__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.task-filter__search {
  flex: 1 1 260px;
  min-width: 240px;
}

.task-filter__select {
  flex: 0 1 180px;
  min-width: 150px;
}

.task-filter__toggle {
  border: 1px solid var(--app-border);
  border-radius: 16px;
  background: var(--app-surface-strong);
}

@media (max-width: 768px) {
  .task-filter__search,
  .task-filter__select {
    min-width: 100%;
  }
}
</style>
