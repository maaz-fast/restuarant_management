import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/client';

export const useOrderStore = defineStore('order', () => {
  const orders = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchOrders() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await api.get('get/orders');
      console.log('Orders API Response:', response.data);
      const ordersData = response.data.payload.responseData;
      console.log('Orders Data:', ordersData);
      
      // Transform the data to match the frontend format
      orders.value = ordersData.map(order => ({
        id: order.orderId,
        orderId: order.orderId,
        date: new Date(order.createdAt).toLocaleDateString(),
        time: new Date(order.createdAt).toLocaleTimeString(),
        createdAt: order.createdAt,
        status: 'In Progress', // Default status, can be updated based on your backend logic
        orderType: order.orderType || 'Delivery', // Default to Delivery if not provided
        paymentMethod: order.paymentMethod || 'Cash', // Default to Cash if not provided
        total: order.totalAmount,
        items: order.orderItems.map(item => ({
          name: item.item,
          quantity: item.quantity,
          price: item.priceAtOrderTime
        })),
        customer: {
          name: order.customerName,
          phone: order.phoneNumber || 'N/A',
          address: order.address
        }
      }));
      
      console.log('Transformed orders:', orders.value);
      return orders.value;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 
                       err.response?.data?.message || 
                       'Failed to fetch orders';
      error.value = errorMsg;
      console.error('Fetch orders error:', err);
      throw new Error(errorMsg);
    } finally {
      isLoading.value = false;
    }
  }

  async function placeOrder(orderData, cartItems) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Debug: Log token
      const token = localStorage.getItem('auth_token');
      console.log('Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      // Step 1: Create the order
      const orderResponse = await api.post('order/add', {
        totalAmount: orderData.totalAmount
      });
      
      console.log('Order created successfully:', orderResponse.data);

      const orderId = orderResponse.data.payload.responseData;

      // Step 2: Add each cart item to the order
      const itemPromises = cartItems.map(item => 
        api.post('order/item/add', {
          orderID: orderId,
          menuID: item.id,
          quantity: item.quantity,
          priceAtOrderTime: item.price
        })
      );

      await Promise.all(itemPromises);

      // Add order to local state
      const newOrder = {
        id: orderId,
        ...orderData,
        items: cartItems,
        createdAt: new Date().toISOString()
      };
      orders.value.push(newOrder);

      return { success: true, orderId };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 
                       err.response?.data?.message || 
                       'Failed to place order';
      error.value = errorMsg;
      console.error('Order placement error:', err);
      throw new Error(errorMsg);
    } finally {
      isLoading.value = false;
    }
  }

  function addOrder(order) {
    orders.value.push(order);
  }

  return { 
    orders, 
    isLoading, 
    error, 
    fetchOrders,
    placeOrder, 
    addOrder 
  };
});
