<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import { useRouter } from 'vue-router'
import { UserPlus } from 'lucide-vue-next'

const auth = useAuthStore()
const toast = useToast()
const router = useRouter()

function goToLogin() {
  router.push('/login')
}

onMounted(async () => {
  try {
    if (!auth.user) {
      await auth.fetchMe()
    }
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to load profile')
  }
})

const refresh = async () => {
  try {
    await auth.fetchMe()
    toast.success('Profile refreshed')
  } catch (err) {
    toast.error('Failed to refresh')
  }
}
</script>

<template>
  <div class="profile-page container">
    <h1 class="page-heading">Your Profile</h1>

    <div v-if="!auth.user" class="empty">
      <div class="empty-card">
        <UserPlus class="empty-icon" :size="48" />
        <h3>No user data available</h3>
        <p class="muted">Please login to view your profile and orders.</p>
        <div class="empty-actions">
          <button class="btn-primary" @click="goToLogin">Login</button>
          <router-link to="/" class="link-secondary">Back to Menu</router-link>
        </div>
      </div>
    </div>

    <div v-else class="profile-card">
      <div class="card-header">
        <div class="avatar">
          <span>{{ auth.user.name ? auth.user.name.split(' ').map(n=>n[0]).slice(0,2).join('') : (auth.user.email && auth.user.email[0]) }}</span>
        </div>
        <div class="header-info">
          <h2 class="name">{{ auth.user.name }}</h2>
          <div class="meta">{{ auth.user.role }} • Joined {{ auth.user.createdAt ? new Date(auth.user.createdAt).toLocaleDateString() : '-' }}</div>
        </div>
      </div>

      <div class="card-body">
        <div class="info-grid">
          <!-- <div class="label">User ID</div>
          <div class="value">{{ auth.user.id }}</div> -->

          <div class="label">Full name</div>
          <div class="value">{{ auth.user.name }}</div>

          <div class="label">Email</div>
          <div class="value">{{ auth.user.email }}</div>

          <div class="label">Role</div>
          <div class="value">{{ auth.user.role }}</div>
        </div>
      </div>

      <div class="actions">
        <!-- <button class="btn-primary" @click="refresh">Refresh</button> -->
        <button class="btn-primary" @click="auth.logout()">Logout</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page { padding: 2rem 1rem; max-width: 900px; margin: 0 auto }
.page-heading { text-align: center; margin-bottom: 1rem; color: var(--color-primary) }
.profile-card { background: white; padding: 1.25rem; border-radius: 12px; box-shadow: 0 6px 24px rgba(0,0,0,0.06) }
.card-header { display:flex; gap: 1rem; align-items:center; margin-bottom: 1rem }
.avatar { width:64px; height:64px; border-radius:50%; background: linear-gradient(180deg,#fff 0%, rgba(255,107,0,0.08)100%); display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--color-primary); box-shadow: 0 6px 18px rgba(255,107,0,0.08) }
.avatar span { font-size:1.05rem }
.header-info .name { margin:0; font-size:1.2rem }
.header-info .meta { color:var(--color-text-light); font-size:0.9rem }
.card-body { padding:0.5rem 0 }
.info-grid { display:grid; grid-template-columns: 150px 1fr; gap: 0.5rem 1.25rem; align-items:center }
.label { color:var(--color-text-light); font-weight:600 }
.value { color:var(--color-text) }
.actions { margin-top: 1.25rem; display:flex; gap: 0.75rem }

@media (max-width:600px) {
  .info-grid { grid-template-columns: 1fr }
  .card-header { gap:0.75rem }
}

.empty { display:flex; justify-content:center; padding:2rem 0 }
.empty-card { text-align:center; background:linear-gradient(180deg,#fff,#fff); padding:1.5rem; border-radius:12px; box-shadow: 0 6px 18px rgba(0,0,0,0.04); max-width:420px; width:100% }
.empty-icon { color: var(--color-primary); margin-bottom:0.5rem }
.empty-card h3 { margin:0.25rem 0 0.5rem 0 }
.empty-card .muted { color:var(--color-text-light); margin-bottom:0.75rem }
.empty-actions { display:flex; gap:0.75rem; justify-content:center; align-items:center }
.link-secondary { color:var(--color-text-light); font-weight:600; text-decoration:underline; cursor:pointer }
</style>
