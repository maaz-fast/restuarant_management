<script setup>
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';
import { X, Minus, Plus, Trash2 } from 'lucide-vue-next';

const cartStore = useCartStore();
const uiStore = useUIStore();
</script>

<template>
  <div class="cart-drawer-overlay" :class="{ open: uiStore.isCartOpen }" @click="uiStore.closeCart"></div>
  <div class="cart-drawer" :class="{ open: uiStore.isCartOpen }">
    <div class="cart-header">
      <h2>Your Order</h2>
      <button class="close-btn" @click="uiStore.closeCart">
        <X :size="24" />
      </button>
    </div>

    <div class="cart-items" v-if="cartStore.items.length > 0">
      <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
        <div class="item-info">
          <h4>{{ item.name }}</h4>
          <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="item-controls">
          <div class="quantity-controls">
            <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)">
              <Minus :size="16" />
            </button>
            <span>{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)">
              <Plus :size="16" />
            </button>
          </div>
          <button class="remove-btn" @click="cartStore.removeItem(item.id)">
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
    </div>

    <div class="empty-cart" v-else>
      <p>Your cart is empty.</p>
      <button class="browse-btn" @click="uiStore.closeCart">Browse Menu</button>
    </div>

    <div class="cart-footer" v-if="cartStore.items.length > 0">
      <div class="total-row">
        <span>Total</span>
        <span class="total-amount">${{ cartStore.totalPrice.toFixed(2) }}</span>
      </div>
      <button class="checkout-btn" @click="uiStore.closeCart(); $router.push('/checkout')">Proceed to Checkout</button>
    </div>
  </div>
</template>

<style scoped>
.cart-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.cart-drawer-overlay.open {
  opacity: 1;
  visibility: visible;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: -400px;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background-color: white;
  z-index: 1001;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.cart-drawer.open {
  right: 0;
}

.cart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h2 {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.cart-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.item-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.item-info h4 {
  font-weight: 600;
}

.item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  padding: 0.2rem;
}

.quantity-controls button {
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-controls span {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  color: #ff4d4d;
  padding: 0.5rem;
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
}

.browse-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.total-amount {
  color: var(--color-primary);
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-text);
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.checkout-btn:hover {
  background-color: var(--color-primary);
}
</style>
