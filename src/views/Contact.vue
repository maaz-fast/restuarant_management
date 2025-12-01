<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast'
import api from '../api/client'

const toast = useToast()

const form = ref({
  name: '',
  email: '',
  message: ''
})
const isLoading = ref(false)

const sendMessage = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const response = await api.post('api/Contact/submitQuery', {
      name: form.value.name,
      email: form.value.email,
      message: form.value.message
    }, { skipAuth: true })
    
    const successMessage = response.data.payload?.message || 'Message sent successfully!'
    toast.success(successMessage)
    form.value = { name: '', email: '', message: '' }
  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || 
                     err.response?.data?.message || 
                     'Failed to send message'
    toast.error(errorMsg)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <h1>Contact Us</h1>

    <form class="form-box" @submit.prevent="sendMessage">
      <label>Name</label>
      <input type="text" v-model="form.name" required placeholder="Your name">

      <label>Email</label>
      <input type="email" v-model="form.email" required placeholder="Your email">

      <label>Message</label>
      <textarea rows="4" v-model="form.message" required placeholder="Your message"></textarea>

      <button type="submit" class="btn-primary" :disabled="isLoading">
        <span class="btn-spinner" v-if="isLoading" aria-hidden="true"></span>
        <span v-if="isLoading">Sending...</span>
        <span v-else>Send Message</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 600px;
  margin: 2rem auto;
}
.form-box {
  background: white;
  padding: 2rem 2.25rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.btn-primary {
  padding: 0.9rem 1rem;
  background: var(--color-primary);
  border: none;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(255,133,0,0.12);
  width: 100%;
  align-self: stretch;
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}

.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 14px 32px rgba(255,133,0,0.16) }

/* inputs */
.form-box label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.form-box input[type="text"], .form-box input[type="email"], .form-box textarea {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-size: 0.95rem;
}
.form-box input:focus, .form-box textarea:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 6px 18px rgba(0,0,0,0.04) }
.form-box textarea { min-height: 120px; resize: vertical }

@media (max-width: 640px) {
  .page-container { margin: 1rem; }
  .form-box { padding: 1rem; }
}

/* small spinner for button */
.btn-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  margin-right: 0.6rem;
  vertical-align: middle;
  animation: spin 900ms linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.btn-primary:disabled { opacity: 0.75; cursor: default }
</style>
