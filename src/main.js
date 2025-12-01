import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// Using Notyf via a composable instead of vue-toastification (incompatible build)
import 'notyf/notyf.min.css'

app.use(createPinia())
app.use(router)
app.mount('#app')
