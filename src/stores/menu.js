import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/client';

export const useMenuStore = defineStore('menu', () => {
    const categories = ref(['All']);
    const activeCategory = ref('All');
    const items = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchMenu = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await api.get('menu/getMenu');
            const menuData = res.data.payload.responseData;
            
            // Extract categories (parent items)
            const categoryNames = menuData
                .filter(item => !item.isDeleted)
                .map(item => item.item);
            categories.value = ['All', ...categoryNames];
            
            // Flatten children items for the menu
            const menuItems = [];
            menuData.forEach(category => {
                if (!category.isDeleted && category.children) {
                    category.children.forEach(child => {
                        if (!child.isDeleted) {
                            menuItems.push({
                                id: child.id,
                                name: child.item,
                                category: category.item,
                                price: child.price,
                                rating: 4.5, //static rating for now will implement later
                                image: child.picturePath,
                                description: child.description
                            });
                        }
                    });
                }
            });
            
            items.value = menuItems;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch menu';
            console.error('Menu fetch error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    const setCategory = (category) => {
        activeCategory.value = category;
    };

    return {
        categories,
        activeCategory,
        items,
        isLoading,
        error,
        fetchMenu,
        setCategory
    };
});
