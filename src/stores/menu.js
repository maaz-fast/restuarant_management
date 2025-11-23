import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMenuStore = defineStore('menu', () => {
    const categories = ref(['All', 'Starter', 'Main Course', 'Dessert', 'Extra']);
    const activeCategory = ref('All');

    const items = ref([
        {
            id: 1,
            name: 'Crispy Calamari',
            category: 'Starter',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Golden fried calamari served with marinara sauce.'
        },
        {
            id: 2,
            name: 'Bruschetta',
            category: 'Starter',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1629570585590-c17fae0839f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fEJydXNjaGV0dGF8ZW58MHx8MHx8fDA%3D',
            description: 'Toasted bread topped with fresh tomatoes, basil, and garlic.'
        },
        {
            id: 3,
            name: 'Grilled Salmon',
            category: 'Main Course',
            price: 24.99,
            image: 'https://media.istockphoto.com/id/2204467669/photo/grilled-salmon.webp?a=1&b=1&s=612x612&w=0&k=20&c=C3zyEttTXdtU3X5J_5-QPqoI0QSLYZMFsVkUqKDaJoQ=',
            description: 'Fresh Atlantic salmon grilled to perfection with asparagus.'
        },
        {
            id: 4,
            name: 'Classic Burger',
            category: 'Main Course',
            price: 15.99,
            image: 'https://images.unsplash.com/photo-1703575571121-0fbf2ef751d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fENsYXNzaWMlMjBCdXJnZXJ8ZW58MHx8MHx8fDA%3D',
            description: 'Juicy beef patty with lettuce, tomato, and cheese.'
        },
        {
            id: 5,
            name: 'Chocolate Lava Cake',
            category: 'Dessert',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1673551490812-eaee2e9bf0ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2hvY29sYXRlJTIwTGF2YSUyMENha2V8ZW58MHx8MHx8fDA%3D',
            description: 'Warm chocolate cake with a molten center.'
        },
        {
            id: 6,
            name: 'Tiramisu',
            category: 'Dessert',
            price: 8.99,
            image: 'https://plus.unsplash.com/premium_photo-1695755053727-8b56d7868e6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE2fHx0aXJhbWlzdSUyMGRlc3NlcnR8ZW58MHx8MHx8fDA%3D',
            description: 'Classic Italian dessert with coffee-soaked ladyfingers.'
        },
        {
            id: 7,
            name: 'French Fries',
            category: 'Extra',
            price: 4.99,
            image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Crispy golden fries.'
        }
    ]);

    const setCategory = (category) => {
        activeCategory.value = category;
    };

    return {
        categories,
        activeCategory,
        items,
        setCategory
    };
});
