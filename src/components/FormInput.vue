<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="form-input"
    />
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #333;
}

.form-input {
  padding: 0.7rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
  transition: border 0.2s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
