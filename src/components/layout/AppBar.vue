<template>
  <v-app-bar class="app-bar" flat height="68">
    <template #prepend>
      <div class="app-bar__brand">
        <div class="app-bar__mark">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="app-bar__logo-svg">
            <!-- three kanban columns -->
            <rect x="1" y="4" width="5" height="12" rx="1.5" fill="currentColor" opacity="0.35"/>
            <rect x="8.5" y="4" width="5" height="8" rx="1.5" fill="currentColor" opacity="0.6"/>
            <rect x="16" y="4" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.85"/>
            <!-- checkmark on last column -->
            <polyline points="17.2,17 19,19 22,15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
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
  font-family: 'Plus Jakarta Sans', sans-serif;
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
  margin: 10px;
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
