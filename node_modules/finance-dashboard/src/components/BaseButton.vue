<template>
  <button :class="['base-button', variant, size, { loading, disabled, fullWidth, iconOnly }]"
          :disabled="disabled || loading"
          @click="$emit('click', $event)">
    <span v-if="loading" class="button-spinner"></span>
    <span v-else-if="icon && !iconOnly" class="button-icon">
      {{ icon }}
    </span>
    <span v-else-if="iconOnly" class="button-icon-only">
      {{ icon }}
    </span>
    <span v-if="!iconOnly" class="button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineEmits(['click'])

defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  icon: String,
  loading: Boolean,
  disabled: Boolean,
  fullWidth: Boolean,
  iconOnly: Boolean
})
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button.fullWidth {
  width: 100%;
}

/* Variants */
.base-button.primary {
  background: var(--primary);
  color: white;
}

.base-button.primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.base-button.secondary {
  background: var(--secondary);
  color: white;
}

.base-button.secondary:hover:not(:disabled) {
  background: #0da271;
}

.base-button.success {
  background: var(--secondary);
  color: white;
}

.base-button.warning {
  background: var(--warning);
  color: white;
}

.base-button.danger {
  background: var(--danger);
  color: white;
}

.base-button.outline {
  background: transparent;
  border: 2px solid var(--gray-300);
  color: var(--gray-700);
}

.base-button.outline:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.base-button.ghost {
  background: transparent;
  color: var(--gray-700);
}

.base-button.ghost:hover:not(:disabled) {
  background: var(--gray-100);
}

/* Sizes */
.base-button.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.base-button.medium {
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
}

.base-button.large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.base-button.iconOnly {
  padding: 0.75rem;
  width: 40px;
  height: 40px;
}

.button-icon {
  font-size: 1.125rem;
}

.button-icon-only {
  font-size: 1.25rem;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.base-button.outline .button-spinner,
.base-button.ghost .button-spinner {
  border-color: var(--gray-300);
  border-top-color: var(--primary);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>