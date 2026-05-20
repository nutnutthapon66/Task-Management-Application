<template>
  <article
    class="stat-card"
    :style="color ? { '--stat-color': color, '--stat-color-bg': colorBg } : {}"
  >
    <span class="stat-card__label">{{ label }}</span>
    <strong class="stat-card__value">{{ value }}</strong>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: string | number
  color?: string
}>()

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const colorBg = computed(() =>
  props.color?.startsWith('#') ? hexToRgba(props.color, 0.08) : undefined,
)
</script>

<style scoped>
.stat-card {
  min-width: 0;
  padding: 18px 20px 16px;
  border: 1px solid var(--app-border-strong);
  border-top: 3px solid var(--stat-color, var(--app-border-strong));
  border-radius: 18px;
  background: var(--stat-color-bg, var(--app-surface-strong));
  backdrop-filter: blur(16px) saturate(140%);
  box-shadow: var(--app-shadow-sm);
  transition: box-shadow 0.2s, transform 0.2s;
}
.stat-card:hover {
  box-shadow: var(--app-shadow);
  transform: translateY(-1px);
}

.stat-card__label {
  display: block;
  margin-bottom: 10px;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--stat-color, var(--app-muted));
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: var(--app-text);
  line-height: 1;
}

@media (max-width: 768px) {
  .stat-card {
    padding: 14px 16px;
    border-radius: 14px;
  }
  .stat-card__value {
    font-size: 1.6rem;
  }
}
</style>
