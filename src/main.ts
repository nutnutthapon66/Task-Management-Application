import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import App from './App.vue'
import { vuetify } from './plugins/vuetify'
import './plugins/dayjs'
import { router } from './router'

function shouldUseMockApi() {
  const explicit = import.meta.env.VITE_USE_MSW?.trim().toLowerCase()
  if (explicit === 'true') return true
  if (explicit === 'false') return false
  return !import.meta.env.VITE_API_BASE_URL
}

async function bootstrap() {
  if (shouldUseMockApi()) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    }).catch((e) => console.warn('[MSW] Service Worker failed to start:', e))
  }

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.use(vuetify)
  app.mount('#app')
}

bootstrap()
