import { useTheme as useVuetifyTheme } from 'vuetify'
import { computed } from 'vue'

export function useTheme() {
  const theme = useVuetifyTheme()
  const isDark = computed(() => theme.global.current.value.dark)

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
