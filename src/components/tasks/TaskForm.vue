<template>
  <v-form ref="formRef" @submit.prevent="submit">
    <v-text-field
      v-model="form.title"
      label="Title"
      placeholder="What needs to be done?"
      :rules="[required, maxLen(100)]"
      counter="100"
      class="mb-3"
      autofocus
    />

    <v-textarea
      v-model="form.description"
      label="Description"
      placeholder="Add a short note or context"
      :rules="[maxLen(500)]"
      counter="500"
      rows="3"
      auto-grow
      class="mb-3"
    />

    <v-row>
      <v-col cols="6">
        <v-select
          v-model="form.status"
          label="Status"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          :rules="[required]"
        />
      </v-col>
      <v-col cols="6">
        <v-select
          v-model="form.priority"
          label="Priority"
          :items="priorityOptions"
          item-title="label"
          item-value="value"
          :rules="[required]">
          <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
              <template #prepend>
                <v-icon
                  :icon="priorityIcons[item.raw.value as TaskPriority]"
                  :color="priorityColors[item.raw.value as TaskPriority]"
                  size="small"
                  class="mr-2"
                />
              </template>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-menu
      v-model="dueDateMenu"
      :close-on-content-click="false"
      min-width="0">
      <template #activator="{ props: menuProps }">
        <v-text-field
          :model-value="dueDateDisplay"
          label="Due Date"
          prepend-inner-icon="mdi-calendar-outline"
          readonly
          clearable
          hide-details="auto"
          class="mb-1"
          v-bind="menuProps"
          @click:clear="handleDueDateClear"
        />
      </template>
      <v-date-picker
        :model-value="dueDateValue"
        hide-header
        @update:model-value="handleDueDateUpdate"
      />
    </v-menu>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import dayjs from '@/plugins/dayjs'
import { VForm } from 'vuetify/components'
import type { Task, TaskFormData } from '@/models'
import { TaskStatus, TaskPriority, PRIORITY_COLORS } from '@/models'

interface Props {
  task?: Task | null
}

const props = withDefaults(defineProps<Props>(), { task: null })
const emit = defineEmits<{
  submit: [payload: TaskFormData]
}>()

const formRef = ref<VForm>()

const defaultForm = (): TaskFormData => ({
  title: '',
  description: '',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: undefined,
})

const form = ref<TaskFormData>(defaultForm())

watch(
  () => props.task,
  (task) => {
    form.value = task
      ? { title: task.title, description: task.description, status: task.status, priority: task.priority, dueDate: task.dueDate }
      : defaultForm()
  },
  { immediate: true },
)

const required = (v: string) => !!v?.trim() || 'This field is required'
const maxLen = (n: number) => (v: string) => !v || v.length <= n || `Maximum ${n} characters`

const dueDateMenu = ref(false)

const dueDateValue = computed(() =>
  form.value.dueDate ? new Date(form.value.dueDate) : null,
)

const dueDateDisplay = computed(() =>
  form.value.dueDate ? dayjs(form.value.dueDate).format('D MMM YYYY') : '',
)

function handleDueDateUpdate(val: Date | null) {
  form.value.dueDate = val ? val.toISOString() : undefined
  dueDateMenu.value = false
}

function handleDueDateClear() {
  form.value.dueDate = undefined
}

const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: 'Todo', value: TaskStatus.TODO },
  { label: 'In Progress', value: TaskStatus.IN_PROGRESS },
  { label: 'Done', value: TaskStatus.DONE },
]

const priorityOptions: { label: string; value: TaskPriority }[] = [
  { label: 'Low', value: TaskPriority.LOW },
  { label: 'Medium', value: TaskPriority.MEDIUM },
  { label: 'High', value: TaskPriority.HIGH },
]

const priorityIcons: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'mdi-arrow-down',
  [TaskPriority.MEDIUM]: 'mdi-minus',
  [TaskPriority.HIGH]: 'mdi-arrow-up',
}

const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: PRIORITY_COLORS[TaskPriority.LOW],
  [TaskPriority.MEDIUM]: PRIORITY_COLORS[TaskPriority.MEDIUM],
  [TaskPriority.HIGH]: PRIORITY_COLORS[TaskPriority.HIGH],
}

async function submit() {
  const { valid } = await formRef.value!.validate()
  if (!valid) return
  emit('submit', { ...form.value })
}

function reset() {
  form.value = defaultForm()
  formRef.value?.resetValidation()
}

defineExpose({ submit, reset })
</script>
