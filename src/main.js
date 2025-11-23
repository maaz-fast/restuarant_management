import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'


   const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import("/src/views/Home.vue") },
        { path: '/checkout', component: () => import("/src/views/Checkout.vue") },
        { path: '/signup', component: () => import("/src/views/Signup.vue") },
        { path: '/login', component: () => import("/src/views/Login.vue") },
        { path: '/orders', component: () => import("/src/views/Orders.vue") },
        { path: '/profile', component: () => import("/src/views/Profile.vue") },
        { path: '/contact', component: () => import("/src/views/Contact.vue") },
        { path: '/privacy-policy', component: () => import("/src/views/PrivacyPolicy.vue") },
    ]
})


const app = createApp(App)

// Using Notyf via a composable instead of vue-toastification (incompatible build)
import 'notyf/notyf.min.css'

app.use(createPinia())
app.use(router)
app.mount('#app')
