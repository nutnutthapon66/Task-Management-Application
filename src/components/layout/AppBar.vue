<template>
  <v-app-bar class="app-bar" flat height="68">
    <template #prepend>
      <div class="app-bar__brand">
        <div class="app-bar__mark">
          <v-icon icon="mdi-view-kanban" size="18" />
        </div>
        <div>
          <p class="app-bar__eyebrow">Workflow Board</p>
          <span class="app-bar__title">Task Management</span>
        </div>
      </div>
    </template>

    <template #append>
      <v-btn
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        class="app-bar__theme-toggle"
        size="small"
        variant="text"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggle: toggleTheme } = useTheme()
</script>

<style scoped>
.app-bar {
  width: min(1360px, calc(100% - 24px));
  margin: 12px auto 0;
  padding: 0 6px 0 10px;
  border: 1px solid var(--app-border-strong);
  border-radius: 20px;
  background: var(--app-surface-strong) !important;
  backdrop-filter: blur(20px) saturate(160%);
  box-shadow: var(--app-shadow);
}

.app-bar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 4px;
}

.app-bar__mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--app-accent-subtle);
  color: var(--app-accent);
  border: 1px solid color-mix(in srgb, var(--app-accent) 18%, transparent);
}

.app-bar__eyebrow {
  margin: 0 0 1px;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--app-muted);
}

.app-bar__title {
  font-size: 0.98rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--app-text);
}

.app-bar__theme-toggle {
  border: 1px solid var(--app-border-strong);
  border-radius: 10px;
  color: var(--app-muted);
  transition: color 0.2s, background 0.2s;
}
.app-bar__theme-toggle:hover {
  color: var(--app-text);
  background: var(--app-surface-hover) !important;
}

@media (max-width: 768px) {
  .app-bar {
    width: calc(100% - 16px);
    margin: 8px auto 0;
    border-radius: 16px;
  }
}
</style>
