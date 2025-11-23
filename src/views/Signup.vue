<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const form = ref({
  name: '',
  email: '',
  password: '',
  address: ''
})

const signup = async () => {
  try {
    await auth.signup(form.value)
    toast.success('Account created successfully')
    router.push('/')
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data || 'Signup failed'
    toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
}
</script>

<template>
  <div class="page-container">
    <div class="form-box">
      <h1 class="form-title">Create Account</h1>


  <form @submit.prevent="signup" class="form-fields">
    <label>Name</label>
    <input type="text" v-model="form.name" required placeholder="Full name">

    <label>Email</label>
    <input type="email" v-model="form.email" required placeholder="Email">

    <label>Password</label>
    <input type="password" v-model="form.password" required placeholder="Password">

    <button type="submit" class="btn-primary" :disabled="auth.isLoading">{{ auth.isLoading ? 'Creating...' : 'Create Account' }}</button>

    <p class="switch-text">
      Already have an account? 
      <router-link to="/login">Login</router-link>
    </p>
    </form>
    <p v-if="auth.error" class="error-text">{{ auth.error }}</p>
</div>


  </div>
</template>

<style scoped>
.page-container {
  max-width: 400px; /* narrower container */
  margin: 2rem auto; /* less top/bottom space */
  padding: 0 1rem;
}

.form-box {
  display: flex;
  flex-direction: column;
  gap: 0.6rem; /* tighter spacing */
  background: white;
  padding: 1.5rem; /* reduced padding */
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px #0001;
}

.form-title {
  text-align: center;
  font-size: 1.6rem; /* slightly smaller title */
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* tighter spacing between inputs */
}

.form-fields input {
  width: 100%;
  padding: 0.6rem; /* smaller input height */
  border-radius: 0.4rem;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.btn-primary {
  padding: 0.6rem; /* smaller button */
  background: var(--color-primary);
  border: none;
  color: white;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #e65a00; /* slightly darker orange for hover */
  color: #fff;
}

.switch-text {
  text-align: center;
  margin-top: 0.8rem;
  font-size: 0.85rem;
}
</style>
