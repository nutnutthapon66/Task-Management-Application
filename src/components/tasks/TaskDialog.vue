<template>
  <v-dialog v-model="model" max-width="560" persistent scrollable>
    <v-card class="task-dialog">
      <v-card-title class="task-dialog__header">
        <DialogHeader
          :eyebrow="isEdit ? 'Update task' : 'New task'"
          :title="isEdit ? 'Edit Task' : 'Create Task'"
          closable
          @close="handleClose"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="task-dialog__content">
        <TaskForm ref="formRef" :task="props.task" @submit="onFormSubmit" />
      </v-card-text>

      <v-divider />

      <v-card-actions class="task-dialog__actions">
        <v-btn variant="text" @click="handleClose">Cancel</v-btn>
        <v-btn
          color="primary"
          :loading="saving"
          @click="handleSubmit">
          {{ isEdit ? 'Save Changes' : 'Create Task' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import DialogHeader from '@/components/ui/DialogHeader.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import type { Task, TaskFormData } from '@/models'

interface Props {
  task?: Task | null
}

const props = withDefaults(defineProps<Props>(), { task: null })
const emit = defineEmits<{
  save: [payload: TaskFormData]
}>()

const model = defineModel<boolean>()
const saving = ref(false)
const formRef = ref<InstanceType<typeof TaskForm>>()

const isEdit = computed(() => !!props.task)

watch(model, (v) => {
  if (!v) formRef.value?.reset()
})

function onFormSubmit(payload: TaskFormData) {
  saving.value = true
  try {
    emit('save', payload)
  } finally {
    saving.value = false
  }
}

function handleClose() {
  model.value = false
}

function handleSubmit() {
  void formRef.value?.submit()
}

defineExpose({ saving })
</script>

<style scoped>
.task-dialog {
  border: 1px solid var(--app-border);
  background: var(--app-modal-bg);
  box-shadow: var(--app-shadow);
}

.task-dialog__header {
  padding: 22px 24px 18px;
}

.task-dialog__content {
  padding: 22px 24px 10px !important;
}

.task-dialog__actions {
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 22px !important;
}

:deep(.task-dialog .v-field) {
  border-radius: 18px;
  background: var(--app-modal-field);
}

:deep(.task-dialog .v-field__outline) {
  --v-field-border-opacity: 1;
  color: var(--app-border-strong);
}
</style>
