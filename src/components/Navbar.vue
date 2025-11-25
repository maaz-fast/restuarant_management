<script setup>
import { ShoppingCart, User, LogOut } from 'lucide-vue-next';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

// Stores
const cartStore = useCartStore();
const uiStore = useUIStore();

// Router
const router = useRouter();

// Router helpers
const auth = useAuthStore()
const toast = useToast()

function goToLogin() {
  router.push('/signup')
}

function goToProfile() {
  router.push('/profile')
}

function handleLogout() {
  auth.logout()
  toast.success('Logged out')
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <!-- Logo -->
    <router-link to="/" class="logo">
  <svg class="logo-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Fork -->
    <path d="M9 2v7.5A2.5 2.5 0 0 0 11.5 12H12v9a1 1 0 0 0 2 0v-9h.5A2.5 2.5 0 0 0 17 9.5V2" stroke="#ff6b00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Knife -->
    <path d="M3 2l2.5 2.5L3 7l2.5 2.5L3 12l2.5 2.5L3 17l2.5 2.5L3 22" stroke="#ff6b00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <span class="logo-text">𝐅𝐨𝐨𝐝𝐢𝐞𝐀𝐩𝐩</span>
</router-link>


  <!-- Navigation Links -->
  <div class="nav-links">
    <router-link to="/" class="nav-item">Menu</router-link>
    <router-link to="/orders" class="nav-item">Orders</router-link>
  </div>

  <!-- Action Icons -->
  <div class="nav-actions">
    <!-- Cart Icon -->
    <button class="icon-btn" @click="uiStore.toggleCart">
      <ShoppingCart :size="24" />
      <span class="badge" v-if="cartStore.totalItems > 0">{{ cartStore.totalItems }}</span>
    </button>

    <!-- Profile / Auth -->
    <div v-if="auth.isAuthenticated">
      <button class="icon-btn" @click="goToProfile" title="Profile">
        <User :size="24" />
      </button>
      <button class="auth-pill" @click="handleLogout" title="Logout">
        <LogOut :size="14" />
        <span class="pill-text">Logout</span>
      </button>
    </div>
    <div v-else>
      <button class="auth-pill" @click="goToLogin" title="Login">
        <User :size="14" />
        <span class="pill-text">Login</span>
      </button>
    </div>
  </div>
</div>


  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--color-background);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  flex-shrink: 0;
}

.logo-text {
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-item {
  font-weight: 500;
  color: var(--color-text-light);
  transition: color 0.2s;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--color-primary);
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.icon-btn {
  position: relative;
  padding: 0.5rem;
  color: var(--color-text);
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.icon-btn:hover {
  color: var(--color-primary);
  background: rgba(255, 107, 0, 0.06);
  border-radius: 8px;
  transform: translateY(-1px);
}

.icon-btn:focus {
  outline: 2px solid rgba(255,107,0,0.12);
  outline-offset: 2px;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pill-style auth button (Login / Logout) */
.auth-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.7rem;
  background: rgba(255, 107, 0, 0.06);
  color: var(--color-primary);
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: none; /* keep design static on hover */
  transform: translateY(-3px); /* nudge slightly upward */
}

.auth-pill .pill-text {
  line-height: 1;
  font-size: 0.95rem;
}

.auth-pill:hover, .auth-pill:active {
  /* no transform, only subtle background keep for consistency */
  background: rgba(255, 107, 0, 0.06);
}
</style>



<style scoped>
.logo-text {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #fff;
  font-weight: bold;
  color: #f97316;
}
</style>
