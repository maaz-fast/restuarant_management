import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOrderStore = defineStore('order', () => {
  const orders = ref([]);

  function addOrder(order) {
    orders.value.push(order);
  }

  return { orders, addOrder };
});
