<script setup>
import { computed, ref, watch } from 'vue';
import { useMenuStore } from '../stores/menu';
import { useCartStore } from '../stores/cart';
import { Plus, Star, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const menuStore = useMenuStore();
const cartStore = useCartStore();

const currentPage = ref(1);
const itemsPerPage = 6;

const filteredItems = computed(() => {
  if (menuStore.activeCategory === 'All') {
    return menuStore.items;
  }
  return menuStore.items.filter(item => item.category === menuStore.activeCategory);
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage);
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Reset to page 1 when category changes
watch(() => menuStore.activeCategory, () => {
  currentPage.value = 1;
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
        <div v-for="item in paginatedItems" :key="item.id" class="menu-item">
          <div class="item-image">
            <img :src="item.image" :alt="item.name" loading="lazy" />
          </div>
          <div class="item-details">
            <div class="item-header">
              <div class="name-rating">
                <div class="rating" v-if="item.rating !== undefined">
                  <Star :size="16" />
                  <span class="rating-value">{{ item.rating.toFixed(1) }}</span>
                </div>
                <h3>{{ item.name }}</h3>
              </div>
              <span class="price">${{ item.price }}</span>
            </div>
            <p class="description">{{ item.description }}</p>
            <button class="add-btn" @click="addToCart(item)">
              <Plus :size="18" /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          <ChevronLeft :size="20" />
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="['pagination-number', { active: currentPage === page }]"
        >
          {{ page }}
        </button>

        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          <ChevronRight :size="20" />
        </button>
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

.name-rating {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.rating {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #f5a623;
  font-weight: 600;
  font-size: 0.9rem;
}

.rating-value {
  color: var(--color-text);
  font-weight: 600;
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

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.pagination-btn,
.pagination-number {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled),
.pagination-number:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-number.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
</style>
