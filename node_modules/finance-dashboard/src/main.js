import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Import icons
import { icons } from './utils/icons'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Register icons globally
Object.entries(icons).forEach(([name, component]) => {
  app.component(name, component)
})

app.mount('#app')