<template>
  <v-app>
    <AppBar />
    <v-main class="app-shell__main">
      <router-view />
    </v-main>
    <NotificationStack />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppBar from '@/components/layout/AppBar.vue'
import NotificationStack from '@/components/ui/NotificationStack.vue'
import { useTheme } from '@/composables/useTheme'

const { init } = useTheme()
onMounted(init)
</script>

<style scoped>
.app-shell__main {
  width: min(1400px, 100%);
  margin: 0 auto;
}
</style>
