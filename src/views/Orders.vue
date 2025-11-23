<script setup>
import { useOrderStore } from '../stores/order';
const orderStore = useOrderStore();
</script>

<template>
  <div class="orders-page container">
    <h1>All Orders</h1>


<!-- No orders message -->
<div v-if="orderStore.orders.length === 0" class="no-orders">
  <p>No orders yet.</p>
</div>

<!-- List of orders -->
<div v-else>
  <div v-for="(order, index) in orderStore.orders" :key="index" class="order-card">
    <h2>Order #{{ index + 1 }}</h2>
    <p><strong>Name:</strong> {{ order.name }}</p>
    <p><strong>Phone:</strong> {{ order.phone }}</p>
    <p v-if="order.orderType==='Delivery'"><strong>Address:</strong> {{ order.address }}</p>
    <p><strong>Order Type:</strong> {{ order.orderType }}</p>
    <p><strong>Payment Method:</strong> {{ order.paymentMethod }}</p>
    <h3>Items:</h3>
    <ul>
      <li v-for="item in order.items" :key="item.id">{{ item.name }} x {{ item.quantity }}</li>
    </ul>
  </div>
</div>


  </div>
</template>

<style scoped>
.orders-page {
  text-align: center; /* center all text inside container */
  margin-top: 2rem;
}

.orders-page p {
  font-size: 1rem;
  color: #555;
}

.no-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px; /* centers vertically */
}
.order-card {
  background: #f9f9f9;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.5rem;
  text-align: left;
}
</style>
