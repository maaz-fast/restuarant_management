<script setup>
import { computed } from 'vue';
import { useMenuStore } from '../stores/menu';
import { useCartStore } from '../stores/cart';
import { Plus } from 'lucide-vue-next';

const menuStore = useMenuStore();
const cartStore = useCartStore();

const filteredItems = computed(() => {
  if (menuStore.activeCategory === 'All') {
    return menuStore.items;
  }
  return menuStore.items.filter(item => item.category === menuStore.activeCategory);
});

const addToCart = (item) => {
  cartStore.addItem(item);
};
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <h1>𝐃𝐞𝐥𝐢𝐜𝐢𝐨𝐮𝐬 𝐅𝐨𝐨𝐝, <br> <span class="highlight">𝐃𝐞𝐥𝐢𝐯𝐞𝐫𝐞𝐝 𝐓𝐨 𝐘𝐨𝐮</span></h1>
        <p>𝘊𝘩𝘰𝘰𝘴𝘦 𝘧𝘳𝘰𝘮 𝘰𝘶𝘳 𝘥𝘪𝘷𝘦𝘳𝘴𝘦 𝘮𝘦𝘯𝘶 𝘢𝘯𝘥 𝘦𝘯𝘫𝘰𝘺 𝘢 𝘮𝘦𝘢𝘭 𝘢𝘵 𝘩𝘰𝘮𝘦.</p>
      </div>
    </section>

    <section class="menu-section container">
      <div class="categories">
        <button 
          v-for="category in menuStore.categories" 
          :key="category"
          :class="['category-btn', { active: menuStore.activeCategory === category }]"
          @click="menuStore.setCategory(category)"
        >
          {{ category }}
        </button>
      </div>

      <div class="menu-grid">
        <div v-for="item in filteredItems" :key="item.id" class="menu-item">
          <div class="item-image">
            <img :src="item.image" :alt="item.name" loading="lazy" />
          </div>
          <div class="item-details">
            <div class="item-header">
              <h3>{{ item.name }}</h3>
              <span class="price">${{ item.price }}</span>
            </div>
            <p class="description">{{ item.description }}</p>
            <button class="add-btn" @click="addToCart(item)">
              <Plus :size="18" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  background-color: #fff5eb;
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.highlight {
  color: var(--color-primary);
}

.hero p {
  color: var(--color-text-light);
  font-size: 1.1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.categories {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  border: 1px solid #eee;
  background-color: white;
  color: var(--color-text-light);
  font-weight: 500;
  transition: all 0.2s;
}

.category-btn:hover, .category-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.menu-item {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.menu-item:hover {
  transform: translateY(-5px);
}

.item-image {
  height: 200px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.menu-item:hover .item-image img {
  transform: scale(1.05);
}

.item-details {
  padding: 1.5rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
}

.price {
  font-weight: 700;
  color: var(--color-primary);
}

.description {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.add-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: var(--color-text);
  color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: var(--color-primary);
}
</style>
