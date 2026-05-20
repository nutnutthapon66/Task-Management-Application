<template>
  <v-snackbar
    :model-value="true"
    :color="notification.type"
    :timeout="notification.timeout"
    location="bottom right"
    class="mb-2"
    rounded="lg"
    @update:model-value="handleVisibilityChange"
  >
    <div class="d-flex align-center gap-2">
      <v-icon :icon="iconMap[notification.type]" />
      <span>{{ notification.message }}</span>
    </div>
    <template #actions>
      <v-btn icon="mdi-close" size="small" variant="text" @click="handleDismiss" />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import type { Notification, NotificationType } from '@/stores/useNotificationStore'

const props = defineProps<{
  notification: Notification
}>()

const emit = defineEmits<{
  dismiss: [id: number]
}>()

const iconMap: Record<NotificationType, string> = {
  success: 'mdi-check-circle',
  error: 'mdi-alert-circle',
  warning: 'mdi-alert',
  info: 'mdi-information',
}

function handleVisibilityChange(value: boolean) {
  if (!value) {
    emit('dismiss', props.notification.id)
  }
}

function handleDismiss() {
  emit('dismiss', props.notification.id)
}
</script>
