<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const cartStore = useCartStore();
const router = useRouter();
const auth = useAuthStore()
const toast = useToast()

const showAuthPrompt = ref(false)

const form = ref({
  name: '',
  phone: '',
  address: '',
  orderType: 'Delivery',
  paymentMethod: 'Card'
});

const isSubmitting = ref(false);

const submitOrder = async () => {
  // require login/signup before placing order
  if (!auth.isAuthenticated) {
    showAuthPrompt.value = true
    return
  }

  isSubmitting.value = true;
  try {
    // Replace this with real API call via order store when ready
    await new Promise((r) => setTimeout(r, 1200))
    toast.success('Order placed successfully!')
    cartStore.clearCart()
    router.push('/')
  } catch (err) {
    toast.error('Failed to place order')
  } finally {
    isSubmitting.value = false
  }
}

function goToLogin() {
  router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
}

function goToSignup() {
  router.push({ path: '/signup', query: { redirect: router.currentRoute.value.fullPath } })
}

function closeAuthPrompt() {
  showAuthPrompt.value = false
}

const discount = computed(() => {
  return form.value.paymentMethod === 'Card' ? cartStore.totalPrice * 0.05 : 0;
});

const finalTotal = computed(() => {
  return cartStore.totalPrice - discount.value;
});
</script>

<template>
  <div class="checkout-page container">
    <h1>Checkout</h1>
    
    <div class="checkout-grid" v-if="cartStore.items.length > 0">
      <div class="checkout-form">
        <section class="form-section">
          <h2>Order Details</h2>
          <div class="form-group">
            <label>Order Type</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="form.orderType" value="Dine-in"> Dine-in
              </label>
              <label class="radio-label">
                <input type="radio" v-model="form.orderType" value="Take-away"> Take-away
              </label>
              <label class="radio-label">
                <input type="radio" v-model="form.orderType" value="Delivery"> Delivery
              </label>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>Personal Information</h2>
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" v-model="form.name" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" v-model="form.phone" required placeholder="+1 234 567 8900">
          </div>
          <div class="form-group" v-if="form.orderType === 'Delivery'">
            <label for="address">Delivery Address</label>
            <textarea id="address" v-model="form.address" rows="3" placeholder="123 Main St, City"></textarea>
          </div>
        </section>

        <section class="form-section">
          <h2>Payment Method</h2>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="form.paymentMethod" value="Card"> Card (5% Discount)
            </label>
            <label class="radio-label">
              <input type="radio" v-model="form.paymentMethod" value="Cash"> Cash
            </label>
          </div>
        </section>
      </div>

      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="summary-items">
          <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
            <span>{{ item.quantity }}x {{ item.name }}</span>
            <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="summary-totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="total-row discount" v-if="discount > 0">
            <span>Card Discount (5%)</span>
            <span>-${{ discount.toFixed(2) }}</span>
          </div>
          <div class="total-row final">
            <span>Total</span>
            <span>${{ finalTotal.toFixed(2) }}</span>
          </div>
        </div>
        <button class="place-order-btn" @click="submitOrder" :disabled="isSubmitting">
          {{ isSubmitting ? 'Processing...' : 'Confirm Order' }}
        </button>
      </div>
    </div>

    <div class="empty-cart-message" v-else>
      <p>Your cart is empty.</p>
      <router-link to="/" class="back-btn">Back to Menu</router-link>
    </div>
  </div>
  <!-- Auth prompt modal -->
  <div v-if="showAuthPrompt" class="auth-prompt-overlay">
    <div class="auth-prompt">
      <h3>Please sign in to place your order</h3>
      <p class="muted">You must be logged in to complete checkout.</p>
      <div class="prompt-actions">
        <button class="btn-primary" @click="goToLogin">Login</button>
        <button class="btn-primary" @click="goToSignup">Signup</button>
        <button class="link-secondary" @click="closeAuthPrompt">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  padding: 2rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

.form-section {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-section h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input[type="text"],
input[type="tel"],
textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-family: inherit;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.order-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.summary-items {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: var(--color-text-light);
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.discount {
  color: #2ecc71;
}

.final {
  font-weight: 700;
  font-size: 1.2rem;
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.place-order-btn {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  transition: opacity 0.2s;
}

.place-order-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.empty-cart-message {
  text-align: center;
  padding: 3rem;
}

.back-btn {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-primary);
  font-weight: 500;
}

/* Auth prompt modal styles */
.auth-prompt-overlay {
  position: fixed;
  inset: 0; /* top:0; right:0; bottom:0; left:0 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.45);
  z-index: 9999;
  padding: 1.25rem;
}
.auth-prompt {
  background: #fff;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  width: min(560px, 96%);
  box-shadow: 0 12px 40px rgba(0,0,0,0.18);
  text-align: left;
}
.auth-prompt h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.15rem;
}
.auth-prompt .muted {
  margin: 0.25rem 0 0.75rem 0;
  color: #666;
}
.prompt-actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0.75rem;
}
.prompt-actions .btn-primary {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
}
.prompt-actions .btn-primary:hover { opacity: 0.95 }
.prompt-actions .link-secondary {
  background: transparent;
  border: none;
  color: var(--color-text);
  padding: 0.45rem 0.8rem;
  cursor: pointer;
}

@media (max-width: 520px) {
  .auth-prompt { padding: 1rem; }
  .prompt-actions { justify-content: center; flex-wrap: wrap; }
}
</style>
