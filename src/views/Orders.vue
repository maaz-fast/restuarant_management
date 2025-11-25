<script setup>
import { ref } from 'vue';
import { useOrderStore } from '../stores/order';
import { Clock, MapPin, CreditCard, Package, Star } from 'lucide-vue-next';
import { useToast } from '../composables/useToast';

const orderStore = useOrderStore();
const toast = useToast();

// Track review state for each order
const reviewStates = ref({});

const initReviewState = (orderId) => {
  if (!reviewStates.value[orderId]) {
    reviewStates.value[orderId] = {
      isWriting: false,
      rating: 0,
      hoveredRating: 0,
      comment: ''
    };
  }
};

const setRating = (orderId, rating) => {
  initReviewState(orderId);
  reviewStates.value[orderId].rating = rating;
};

const setHoveredRating = (orderId, rating) => {
  initReviewState(orderId);
  reviewStates.value[orderId].hoveredRating = rating;
};

const clearHoveredRating = (orderId) => {
  initReviewState(orderId);
  reviewStates.value[orderId].hoveredRating = 0;
};

const toggleReviewForm = (orderId) => {
  initReviewState(orderId);
  reviewStates.value[orderId].isWriting = !reviewStates.value[orderId].isWriting;
};

const submitReview = (orderId) => {
  const review = reviewStates.value[orderId];
  
  if (!review.rating) {
    toast.error('Please select a rating');
    return;
  }
  
  if (!review.comment.trim()) {
    toast.error('Please write a review');
    return;
  }

  // TODO: Send review to API
  console.log('Submitting review for order:', orderId, {
    rating: review.rating,
    comment: review.comment
  });

  toast.success('Review submitted successfully!');
  
  // Reset the form
  review.isWriting = false;
  review.rating = 0;
  review.comment = '';
};

const cancelReview = (orderId) => {
  const review = reviewStates.value[orderId];
  review.isWriting = false;
  review.rating = 0;
  review.hoveredRating = 0;
  review.comment = '';
};

// Dummy orders for layout demonstration
const dummyOrders = ref([
  {
    id: 'ORD-2024-001',
    date: '2024-11-25',
    time: '2:30 PM',
    status: 'Delivered',
    orderType: 'Delivery',
    paymentMethod: 'Card',
    total: 42.97,
    items: [
      { name: 'Crispy Calamari', quantity: 2, price: 12.99 },
      { name: 'Grilled Salmon', quantity: 1, price: 24.99 }
    ],
    customer: {
      name: 'John Doe',
      phone: '+1 234 567 8900',
      address: '123 Main St, Apartment 4B, New York, NY 10001'
    }
  },
  {
    id: 'ORD-2024-002',
    date: '2024-11-24',
    time: '6:45 PM',
    status: 'In Progress',
    orderType: 'Pickup',
    paymentMethod: 'Cash',
    total: 33.97,
    items: [
      { name: 'Classic Burger', quantity: 2, price: 15.99 },
      { name: 'French Fries', quantity: 1, price: 4.99 }
    ],
    customer: {
      name: 'Jane Smith',
      phone: '+1 234 567 8901'
    }
  },
  {
    id: 'ORD-2024-003',
    date: '2024-11-24',
    time: '1:15 PM',
    status: 'Cancelled',
    orderType: 'Delivery',
    paymentMethod: 'Card',
    total: 18.98,
    items: [
      { name: 'Chocolate Lava Cake', quantity: 2, price: 9.99 }
    ],
    customer: {
      name: 'Mike Johnson',
      phone: '+1 234 567 8902',
      address: '456 Oak Avenue, Suite 12, Brooklyn, NY 11201'
    }
  }
]);
</script>

<template>
  <div class="orders-page container">
    <h1>All Orders</h1>

    <!-- Show dummy orders for demo -->
    <div v-if="dummyOrders.length > 0" class="orders-list">
      <div v-for="order in dummyOrders" :key="order.id" class="order-card">
        
        <!-- Left Section: Order Info & Items -->
        <div class="card-left">
          <div class="order-header-inline">
            <div>
              <div class="order-id">{{ order.id }}</div>
              <div class="order-time">
                <Clock :size="13" />
                {{ order.date }} • {{ order.time }}
              </div>
            </div>
            <span :class="['status-badge', order.status.toLowerCase().replace(' ', '-')]">
              {{ order.status }}
            </span>
          </div>

          <div class="items-compact">
            <div v-for="(item, idx) in order.items" :key="idx" class="item-row-compact">
              <span class="qty-badge">{{ item.quantity }}×</span>
              <span class="item-title">{{ item.name }}</span>
              <span class="item-amount">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Vertical Divider -->
        <div class="vertical-divider"></div>

        <!-- Right Section: Customer & Summary -->
        <div class="card-right">
          <div class="customer-info">
            <div class="info-block">
              <div class="info-label">Customer</div>
              <div class="info-text">{{ order.customer.name }}</div>
              <div class="info-subtext">{{ order.customer.phone }}</div>
            </div>
            
            <div class="info-block" v-if="order.customer.address">
              <div class="info-label">Delivery Address</div>
              <div class="info-text address-line">
                <MapPin :size="13" />
                {{ order.customer.address }}
              </div>
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-badges">
              <span class="mini-badge">
                <Package :size="14" />
                {{ order.orderType }}
              </span>
              <span class="mini-badge">
                <CreditCard :size="14" />
                {{ order.paymentMethod }}
              </span>
            </div>
            <div class="total-box">
              <span class="total-text">Total</span>
              <span class="total-amount">${{ order.total.toFixed(2) }}</span>
            </div>
          </div>

        </div>

        <!-- Review Section (Full Width Below Card) -->
        <div v-if="order.status === 'Delivered'" class="review-section">
          <button 
            v-if="!reviewStates[order.id]?.isWriting" 
            @click="toggleReviewForm(order.id)"
            class="review-btn"
          >
            Write a Review
          </button>

          <div v-else class="review-form">
            <h4>Rate Your Experience</h4>
            
            <!-- Star Rating -->
            <div class="star-rating">
              <Star
                v-for="star in 5"
                :key="star"
                :size="32"
                :class="[
                  'star',
                  { 
                    'filled': star <= (reviewStates[order.id]?.hoveredRating || reviewStates[order.id]?.rating),
                    'active': star <= reviewStates[order.id]?.rating
                  }
                ]"
                @click="setRating(order.id, star)"
                @mouseenter="setHoveredRating(order.id, star)"
                @mouseleave="clearHoveredRating(order.id)"
              />
            </div>

            <!-- Review Text -->
            <textarea
              v-model="reviewStates[order.id].comment"
              placeholder="Share your experience with this order..."
              class="review-textarea"
              rows="4"
            ></textarea>

            <!-- Action Buttons -->
            <div class="review-actions">
              <button @click="cancelReview(order.id)" class="btn-cancel">
                Cancel
              </button>
              <button @click="submitReview(order.id)" class="btn-submit">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No orders message (when using real data) -->
    <div v-else class="no-orders">
      <p>No orders yet.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.orders-page {
  margin-top: 2rem;
  margin-bottom: 4rem;
}

.orders-page h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  min-height: 200px;
}

.order-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(255, 107, 0, 0.1);
  transform: translateY(-2px);
}

/* Left Section */
.card-left {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.order-header-inline {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.order-id {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.35rem;
}

.order-time {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #888;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.status-badge.delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.in-progress {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.pending {
  background: #dbeafe;
  color: #1e40af;
}

/* Items Compact */
.items-compact {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.item-row-compact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.qty-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  background: #f5f5f5;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
}

.item-title {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

.item-amount {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* Vertical Divider */
.vertical-divider {
  width: 1px;
  background: linear-gradient(180deg, transparent, #e5e5e5, transparent);
  align-self: stretch;
}

/* Right Section */
.card-right {
  flex: 0.9;
  padding: 1.5rem;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.info-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #999;
  font-weight: 600;
}

.info-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.info-subtext {
  font-size: 0.8rem;
  color: #666;
}

.address-line {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-weight: 500;
  line-height: 1.5;
  color: #666;
}

/* Order Summary */
.order-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e5e5;
}

.summary-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mini-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  background: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #555;
  border: 1px solid #e5e5e5;
}

.total-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%);
  border-radius: 8px;
  border: 1px solid #ffd8b8;
}

.total-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.total-amount {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.no-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  text-align: center;
}

.no-orders p {
  font-size: 1.1rem;
  color: var(--color-text-light);
}

/* Review Section */
.review-section {
  padding: 1.5rem;
  border-top: 1px solid #e5e5e5;
  background: #fafafa;
}

.review-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-primary);
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.review-btn:hover {
  background: #e67e22;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-form h4 {
  font-size: 1rem;
  margin: 0;
  color: var(--color-text);
}

.star-rating {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding: 1rem 0;
}

.star {
  cursor: pointer;
  color: #ddd;
  transition: all 0.2s;
}

.star.filled {
  color: #ffc107;
  transform: scale(1.1);
}

.star.active {
  color: #ffc107;
}

.star:hover {
  transform: scale(1.2);
}

.review-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.review-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.review-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f8f9fa;
  color: var(--color-text);
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-submit {
  background: var(--color-primary);
  color: white;
}

.btn-submit:hover {
  background: #e67e22;
}

@media (max-width: 768px) {
  .order-card {
    flex-direction: column;
    min-height: auto;
  }

  .vertical-divider {
    display: none;
  }

  .card-right {
    background: #f9f9f9;
  }

  .review-actions {
    width: 100%;
  }

  .btn-cancel,
  .btn-submit {
    flex: 1;
  }
}
</style>
