<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <div class="container">

      <div class="top">
        <!-- Brand -->
        <div class="brand">
          <div class="brand-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Fork -->
              <path d="M9 2v7.5A2.5 2.5 0 0 0 11.5 12H12v9a1 1 0 0 0 2 0v-9h.5A2.5 2.5 0 0 0 17 9.5V2" stroke="#ff6b00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Knife -->
              <path d="M3 2l2.5 2.5L3 7l2.5 2.5L3 12l2.5 2.5L3 17l2.5 2.5L3 22" stroke="#ff6b00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h2>𝐅𝐨𝐨𝐝𝐢𝐞𝐀𝐩𝐩</h2>
          </div>
          <p>Making food ordering and restaurant operations simple.</p>
        </div>

        <!-- Menu -->
        <div class="links">
          
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/contact">Contact</RouterLink>
          <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/signup">Sign Up</RouterLink>
        </div>

        <!-- Contact Info -->
        <div class="contact">
          <h4>Contact</h4>
          <p>Email: <a href="mailto:support@foodieapp.com" class="contact-link">maaz@foodieapp.com</a></p>
          <p>Phone: <a href="tel:+923001234567" class="contact-link">+92 300 1234567</a></p>
        </div>
      </div>

      <div class="bottom">
        <p>© 2025 FoodieApp — All Rights Reserved.</p>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #f8f8f8;
  padding: 3rem 0 1.2rem;
  border-top: 1px solid #e5e5e5;
  margin-top: auto;
  font-family: sans-serif;
}

.container {
  max-width: 1180px;
  margin: auto;
  padding: 0 20px;
}

.top {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.brand h2 {
  color: var(--color-primary);
  margin: 0;
}

.links {
  display: flex;
  flex-direction: column;
}

.links a {
  text-decoration: none;
  color: #666;
  margin: 4px 0;
  transition: 0.2s;
}

.links a:hover {
  color: var(--color-primary);
}

.contact-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: 0.2s;
}

.contact-link:hover {
  text-decoration: underline;
}

.bottom {
  text-align: center;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
  color: #777;
}
</style>


