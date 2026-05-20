<template>
  <v-dialog v-model="model" max-width="400" persistent>
    <v-card class="confirm-dialog">
      <v-card-text class="confirm-dialog__body">
        <div class="confirm-dialog__icon-wrap">
          <v-icon icon="mdi-trash-can-outline" size="26" />
        </div>
        <p class="confirm-dialog__title">{{ title }}</p>
        <p class="confirm-dialog__message">{{ message }}</p>
      </v-card-text>
      <v-card-actions class="confirm-dialog__actions">
        <v-btn class="confirm-dialog__btn-cancel" variant="outlined" @click="cancel">Cancel</v-btn>
        <v-btn class="confirm-dialog__btn-delete" color="error" variant="flat" :loading="loading" @click="confirm">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
  border-radius: 20px !important;
  overflow: hidden;
}

.confirm-dialog__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 28px 20px !important;
  gap: 12px;
}

.confirm-dialog__icon-wrap {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgb(var(--v-theme-error), 0.1);
  color: rgb(var(--v-theme-error));
  margin-bottom: 4px;
  flex-shrink: 0;
}

.confirm-dialog__title {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--app-text);
}

.confirm-dialog__message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--app-muted);
  max-width: 300px;
}

.confirm-dialog__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 4px 28px 28px !important;
}

.confirm-dialog__btn-cancel,
.confirm-dialog__btn-delete {
  border-radius: 10px !important;
  font-weight: 700;
  letter-spacing: 0;
  height: 42px;
}

.confirm-dialog__btn-cancel {
  border-color: var(--app-border-strong) !important;
  color: var(--app-text) !important;
}
</style>
