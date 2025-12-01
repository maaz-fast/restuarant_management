import { createRouter, createWebHistory } from 'vue-router'

// Import your pages
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Contact from '../views/Contact.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'
import Orders from '../views/Orders.vue'
import Profile from '../views/Profile.vue'
import Checkout from '../views/Checkout.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/contact', component: Contact },
  { path: '/privacy-policy', component: PrivacyPolicy },
  { path: '/orders', component: Orders },
  { path: '/profile', component: Profile },
  { path: '/checkout', component: Checkout },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
