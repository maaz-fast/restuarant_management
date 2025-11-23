<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <div class="container">

      <div class="top">
        <!-- Brand -->
        <div class="brand">
          <h2>FoodieApp</h2>
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
          <p>Email: support@foodieapp.com</p>
          <p>Phone: +92 300 1234567</p>
        </div>
      </div>

      <div class="bottom">
        <p>© 2024 FoodieApp — All Rights Reserved.</p>
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

.brand h2 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
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

.bottom {
  text-align: center;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
  color: #777;
}
</style>


