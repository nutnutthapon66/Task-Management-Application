<template>
  <v-dialog v-model="model" max-width="420" persistent>
    <v-card class="confirm-dialog">
      <v-card-title class="confirm-dialog__header">
        <DialogHeader :title="title" class="confirm-dialog__title-wrap" />
        <v-icon icon="mdi-delete-outline" color="error" class="confirm-dialog__icon" />
      </v-card-title>
      <v-card-text class="confirm-dialog__content text-medium-emphasis">
        {{ message }}
      </v-card-text>
      <v-card-actions class="confirm-dialog__actions">
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
        <v-btn color="error" :loading="loading" @click="confirm">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DialogHeader from '@/components/ui/DialogHeader.vue'

interface Props {
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Delete Task',
  message: 'Are you sure you want to delete this task? This action cannot be undone.',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const model = defineModel<boolean>()
const loading = ref(false)

function confirm() {
  emit('confirm')
}

function cancel() {
  model.value = false
  emit('cancel')
}

defineExpose({ loading })
</script>

<style scoped>
.confirm-dialog {
  border: 1px solid var(--app-border);
  background: var(--app-modal-bg);
  box-shadow: var(--app-shadow);
}

.confirm-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 24px 14px;
}

.confirm-dialog__icon {
  flex-shrink: 0;
}

.confirm-dialog__title-wrap {
  flex: 1;
}

.confirm-dialog__content {
  padding: 0 24px 18px !important;
}

.confirm-dialog__actions {
  justify-content: flex-end;
  gap: 10px;
  padding: 0 24px 22px !important;
}
</style>
