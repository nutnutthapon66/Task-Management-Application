<template>
  <div class="notification-toast" :class="`notification-toast--${notification.type}`">
    <v-icon :icon="iconMap[notification.type]" size="20" />
    <span class="notification-toast__message">{{ notification.message }}</span>
    <v-btn icon="mdi-close" size="x-small" variant="text" density="compact" @click="emit('dismiss', notification.id)" />
  </div>
</template>

<script setup lang="ts">
import type { Notification, NotificationType } from '@/stores/useNotificationStore'

defineProps<{
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
</script>

<style scoped>
.notification-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  min-width: 280px;
  max-width: 420px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}
.notification-toast--success { background: #2e7d32; }
.notification-toast--error   { background: #c62828; }
.notification-toast--warning { background: #e65100; }
.notification-toast--info    { background: #1565c0; }

.notification-toast__message {
  flex: 1;
  line-height: 1.4;
}
</style>
