<template>
  <div class="base-card" :class="[variant, { hoverable, clickable }]">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
  },
  hoverable: Boolean,
  clickable: Boolean
})
</script>

<style scoped>
.base-card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.base-card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.base-card.clickable {
  cursor: pointer;
}

.card-header {
  padding: 1.5rem 1.5rem 0;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 0 1.5rem 1.5rem;
}

.base-card.primary {
  border-left: 4px solid var(--primary);
}

.base-card.secondary {
  border-left: 4px solid var(--secondary);
}

.base-card.success {
  border-left: 4px solid var(--secondary);
}

.base-card.warning {
  border-left: 4px solid var(--warning);
}

.base-card.danger {
  border-left: 4px solid var(--danger);
}
</style>