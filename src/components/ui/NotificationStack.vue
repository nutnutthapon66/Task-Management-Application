<template>
  <div class="notification-stack">
    <TransitionGroup name="snack">
      <NotificationToast
        v-for="n in notifications"
        :key="n.id"
        :notification="n"
        @dismiss="handleNotificationDismiss"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import NotificationToast from '@/components/ui/NotificationToast.vue'
import { useNotificationStore } from '@/stores/useNotificationStore'

const store = useNotificationStore()
const { notifications } = store

function handleNotificationDismiss(id: number) {
  store.remove(id)
}
</script>

<style scoped>
.notification-stack {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.snack-enter-active,
.snack-leave-active {
  transition: all 0.3s ease;
}
.snack-enter-from,
.snack-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
</style>
