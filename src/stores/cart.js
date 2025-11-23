import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const items = ref([]);

    const addItem = (item) => {
        const existingItem = items.value.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            items.value.push({ ...item, quantity: 1 });
        }
    };

    const removeItem = (itemId) => {
        const index = items.value.findIndex(i => i.id === itemId);
        if (index > -1) {
            items.value.splice(index, 1);
        }
    };

    const updateQuantity = (itemId, quantity) => {
        const item = items.value.find(i => i.id === itemId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                removeItem(itemId);
            }
        }
    };

    const totalItems = computed(() => {
        return items.value.reduce((total, item) => total + item.quantity, 0);
    });

    const totalPrice = computed(() => {
        return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    });

    const clearCart = () => {
        items.value = [];
    };

    return {
        items,
        addItem,
        removeItem,
        updateQuantity,
        totalItems,
        totalPrice,
        clearCart
    };
});
