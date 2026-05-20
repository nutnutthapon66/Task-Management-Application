import { useTheme as useVuetifyTheme } from 'vuetify'
import { computed, watchEffect } from 'vue'

export function useTheme() {
  const theme = useVuetifyTheme()
  const isDark = computed(() => theme.global.current.value.dark)

  // Sync class on both <html> and <body> so CSS variables apply regardless of where Vuetify sets it
  watchEffect(() => {
    document.documentElement.classList.toggle('v-theme--dark', isDark.value)
    document.documentElement.classList.toggle('v-theme--light', !isDark.value)
    document.body.classList.toggle('v-theme--dark', isDark.value)
    document.body.classList.toggle('v-theme--light', !isDark.value)
  })

  function toggle() {
    theme.global.name.value = isDark.value ? 'light' : 'dark'
    localStorage.setItem('theme', theme.global.name.value)
  }

  function init() {
    const saved = localStorage.getItem('theme')
    if (saved) {
      theme.global.name.value = saved
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.global.name.value = 'dark'
    }
  }

  return { isDark, toggle, init }
}
