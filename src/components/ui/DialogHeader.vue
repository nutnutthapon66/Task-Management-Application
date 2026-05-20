<template>
  <div class="dialog-header">
    <div>
      <p v-if="eyebrow" class="dialog-header__eyebrow">{{ eyebrow }}</p>
      <span class="dialog-header__title">{{ title }}</span>
    </div>

    <v-btn
      v-if="closable"
      icon="mdi-close"
      variant="text"
      size="small"
      @click="handleClose"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    closable?: boolean
  }>(),
  {
    eyebrow: '',
    closable: false,
  },
)

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dialog-header__eyebrow {
  margin: 0 0 4px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--app-muted);
}

.dialog-header__title {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}
</style>
