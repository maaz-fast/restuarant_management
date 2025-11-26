<script setup>
import { ref, computed, watch } from 'vue';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import { CreditCard, DollarSign } from 'lucide-vue-next'

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
  paymentMethod: 'Cash'
});

const isSubmitting = ref(false);

// card payment modal state
const showCardModal = ref(false)
const cardSaved = ref(false)
const cardForm = ref({ holder: '', number: '', expiry: '', cvv: '' })
const cardErrors = ref({ holder: '', number: '', expiry: '', cvv: '' })

// open card modal immediately when user selects 'Card' and card not yet saved
watch(() => form.value.paymentMethod, (val) => {
  if (val === 'Card' && !cardSaved.value) {
    showCardModal.value = true
  }
})

const submitOrder = async () => {
  // require login/signup before placing order
  if (!auth.isAuthenticated) {
    showAuthPrompt.value = true
    return
  }

  // if card payment selected but card details not saved, open card modal
  if (form.value.paymentMethod === 'Card' && !cardSaved.value) {
    showCardModal.value = true
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

function closeCardModal() {
  showCardModal.value = false
}

function saveCardDetails() {
  if (!validateCard()) {
    // validation fills `cardErrors` with friendly per-field messages
    toast.error('Please fix the card fields shown below')
    return
  }
  cardSaved.value = true
  showCardModal.value = false
  toast.success('Card details saved')
}

function onCardNumberInput(e) {
  // keep only digits and group every 4 digits
  const raw = (e.target.value || '').replace(/\D+/g, '').slice(0, 19)
  const parts = []
  for (let i = 0; i < raw.length; i += 4) {
    parts.push(raw.substr(i, 4))
  }
  cardForm.value.number = parts.join(' ')
}

function onExpiryInput(e) {
  // numeric only, format MM/YY
  const raw = (e.target.value || '').replace(/\D+/g, '').slice(0, 4)
  if (raw.length <= 2) {
    cardForm.value.expiry = raw
  } else {
    cardForm.value.expiry = raw.slice(0, 2) + '/' + raw.slice(2)
  }
}

function onCvvInput(e) {
  const raw = (e.target.value || '').replace(/\D+/g, '').slice(0, 4)
  cardForm.value.cvv = raw
}

function validateCard() {
  // reset errors
  cardErrors.value = { holder: '', number: '', expiry: '', cvv: '' }
  const c = cardForm.value

  if (!c.holder || c.holder.trim().length < 2) {
    cardErrors.value.holder = 'Enter the name on the card'
  }

  const digits = (c.number || '').replace(/\s+/g, '')
  if (!/^\d{12,19}$/.test(digits)) {
    cardErrors.value.number = 'Enter a valid card number (12–19 digits)'
  }

  // expiry validations: must be MM/YY or MM/YYYY and not expired
  const expRaw = (c.expiry || '').replace(/\s+/g, '')
  const parts = expRaw.split('/')
  let month = null
  let year = null
  if (parts.length === 2) {
    month = parts[0]
    year = parts[1]
  } else if (expRaw.length === 4) {
    month = expRaw.slice(0, 2)
    year = expRaw.slice(2)
  }
  if (!month || !/^\d{2}$/.test(month)) {
    cardErrors.value.expiry = 'Expiry should be in MM/YY format'
  } else {
    const m = parseInt(month, 10)
    if (!(m >= 1 && m <= 12)) {
      cardErrors.value.expiry = 'Expiry month must be between 01 and 12'
    } else if (year && /^\d{2,4}$/.test(year)) {
      // normalize year to 4 digits
      const y = year.length === 2 ? 2000 + parseInt(year, 10) : parseInt(year, 10)
      const expDate = new Date(y, m - 1 + 1, 0) // last day of expiry month
      const today = new Date()
      // set time to end of day for comparison
      expDate.setHours(23, 59, 59, 999)
      if (expDate < today) {
        cardErrors.value.expiry = 'Card has expired'
      }
    }
  }

  // CVV: require exactly 4 digits per request
  if (!/^\d{4}$/.test(c.cvv || '')) {
    cardErrors.value.cvv = 'CVV must be 3/4 digits'
  }

  // determine overall validity
  const hasError = Object.values(cardErrors.value).some(Boolean)
  return !hasError
}

const discount = computed(() => form.value.paymentMethod === 'Card' ? cartStore.totalPrice * 0.05 : 0);
const finalTotal = computed(() => cartStore.totalPrice - discount.value);
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
            <input type="text" id="name" v-model="form.name" required placeholder="Maaz Imtiaz">
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" v-model="form.phone" required placeholder="+1 234 567 8900">
          </div>
          <div class="form-group" v-if="form.orderType === 'Delivery'">
            <label for="address">Delivery Address</label>
            <textarea id="address" v-model="form.address" rows="3" placeholder="123 PECHS, Karachi"></textarea>
          </div>
        </section>

        <section class="form-section">
          <h2>Payment Method</h2>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="form.paymentMethod" value="Card">
              <span class="radio-custom"><CreditCard class="payment-icon" /></span>
              <span>Card <small class="muted-text">(5% Discount)</small></span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model="form.paymentMethod" value="Cash">
              <span class="radio-custom"><DollarSign class="payment-icon" /></span>
              <span>Cash</span>
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
  <!-- Card details modal -->
  <div v-if="showCardModal" class="auth-prompt-overlay">
    <div class="auth-prompt">
      <h3>Enter card details</h3>
      <p class="muted">We use secure payments. Enter card information to continue.</p>
      <div class="card-form">
        <div class="form-group">
          <label>Cardholder Name</label>
          <input type="text" v-model="cardForm.holder" placeholder="Full name on card">
          <p class="field-error" v-if="cardErrors.holder">{{ cardErrors.holder }}</p>
        </div>
        <div class="form-group">
          <label>Card Number</label>
          <input type="text" v-model="cardForm.number" @input="onCardNumberInput" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456">
          <p class="field-error" v-if="cardErrors.number">{{ cardErrors.number }}</p>
        </div>
        <div style="display:flex; gap:0.75rem">
          <div class="form-group" style="flex:1">
            <label>Expiry (MM/YY)</label>
            <input type="text" v-model="cardForm.expiry" @input="onExpiryInput" inputmode="numeric" placeholder="MM/YY" maxlength="7">
            <p class="field-error" v-if="cardErrors.expiry">{{ cardErrors.expiry }}</p>
          </div>
          <div class="form-group" style="width:130px">
            <label>CVV</label>
            <input type="password" v-model="cardForm.cvv" @input="onCvvInput" inputmode="numeric" maxlength="4" placeholder="1234">
            <p class="field-error" v-if="cardErrors.cvv">{{ cardErrors.cvv }}</p>
          </div>
        </div>
      </div>
      <div class="prompt-actions">
        <button class="btn-primary" @click="saveCardDetails">Save & Continue</button>
        <button class="link-secondary" @click="closeCardModal">Cancel</button>
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
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  font-weight: 500;
}

.radio-label:hover {
  border-color: var(--color-primary);
  background: #fff5eb;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.radio-label input[type="radio"]:checked + * {
  color: var(--color-primary);
}

.radio-label:has(input[type="radio"]:checked) {
  border-color: var(--color-primary);
  background: #fff5eb;
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
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

/* Card modal tweaks reuse existing modal styles */
.card-form input[type="text"], .card-form input[type="password"] {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
}

.field-error {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.35rem;
}

.payment-icon {
  width: 20px;
  height: 20px;
  margin: 0;
  flex: 0 0 20px;
  color: var(--color-primary);
  display: block;
}
.radio-label span { display:inline-block }
.radio-label > span:last-child { display:flex; align-items:center }
.radio-custom .payment-icon { display:block; margin:auto; transform: translateY(4px); }
.muted-text { font-size: 0.85rem; color: #666; margin-left: 0.35rem }

/* custom radio */
.radio-label {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}
.radio-label input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.radio-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #eee;
  transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
  padding: 0; /* ensure icon is centered */
}
.radio-label input[type="radio"]:checked + .radio-custom {
  background: #fff;
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}
.radio-label:hover {
  background: rgba(0,0,0,0.02);
}
.radio-label input[type="radio"]:focus + .radio-custom {
  box-shadow: 0 0 0 4px rgba(0,0,0,0.06);
}


@media (max-width: 520px) {
  .auth-prompt { padding: 1rem; }
  .prompt-actions { justify-content: center; flex-wrap: wrap; }
}
</style>
