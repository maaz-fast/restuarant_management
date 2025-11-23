<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const sendMessage = () => {
  console.log("Message:", form.value)
  alert("Message sent successfully!")
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

      <button type="submit" class="btn-primary">Send Message</button>
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
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px #0001;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.btn-primary {
  padding: 0.8rem;
  background: var(--color-primary);
  border: none;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
