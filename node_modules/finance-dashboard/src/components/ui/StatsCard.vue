<template>
  <div class="stats-card" :class="color">
    <div class="card-header">
      <div class="card-icon" :style="{ background: iconBackground }">
        {{ icon }}
      </div>
      <div class="card-trend" :class="trendType">
        {{ trend }}
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-value">R$ {{ formatCurrency(amount) }}</p>
    </div>
    
    <div class="card-footer">
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
        </div>
        <span class="progress-text">{{ percentage }}% do objetivo</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../../utils/formatters'

const props = defineProps({
  title: String,
  amount: Number,
  icon: String,
  trend: String,
  trendType: {
    type: String,
    default: 'positive',
    validator: (value) => ['positive', 'negative', 'neutral'].includes(value)
  },
  percentage: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
  }
})

const iconBackground = computed(() => {
  const colors = {
    primary: 'rgba(99, 102, 241, 0.1)',
    success: 'rgba(34, 197, 94, 0.1)',
    warning: 'rgba(245, 158, 11, 0.1)',
    danger: 'rgba(239, 68, 68, 0.1)',
    info: 'rgba(59, 130, 246, 0.1)'
  }
  return colors[props.color] || colors.primary
})

const iconColor = computed(() => {
  const colors = {
    primary: 'var(--primary-400)',
    success: 'var(--success-400)',
    warning: 'var(--warning-400)',
    danger: 'var(--danger-400)',
    info: 'var(--info-400)'
  }
  return colors[props.color] || colors.primary
})
</script>

<style scoped>
.stats-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  transition: var(--transition-base);
  position: relative;
  overflow: hidden;
}

.stats-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.stats-card.primary::before {
  background: linear-gradient(90deg, var(--primary-500), var(--primary-700));
}

.stats-card.success::before {
  background: linear-gradient(90deg, var(--success-500), var(--success-700));
}

.stats-card.warning::before {
  background: linear-gradient(90deg, var(--warning-500), var(--warning-700));
}

.stats-card.danger::before {
  background: linear-gradient(90deg, var(--danger-500), var(--danger-700));
}

.stats-card.info::before {
  background: linear-gradient(90deg, var(--info-500), var(--info-700));
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-trend {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
}

.card-trend.positive {
  background: rgba(34, 197, 94, 0.2);
  color: var(--success-400);
}

.card-trend.negative {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger-400);
}

.card-trend.neutral {
  background: rgba(255, 255, 255, 0.1);
  color: var(--gray-400);
}

.card-content {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 0.9375rem;
  color: var(--gray-400);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #4b5563;
  line-height: 1.2;
}

.card-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.stats-card.primary .progress-fill {
  background: linear-gradient(90deg, var(--primary-500), var(--primary-700));
}

.stats-card.success .progress-fill {
  background: linear-gradient(90deg, var(--success-500), var(--success-700));
}

.stats-card.warning .progress-fill {
  background: linear-gradient(90deg, var(--warning-500), var(--warning-700));
}

.stats-card.danger .progress-fill {
  background: linear-gradient(90deg, var(--danger-500), var(--danger-700));
}

.stats-card.info .progress-fill {
  background: linear-gradient(90deg, var(--info-500), var(--info-700));
}

.progress-text {
  font-size: 0.75rem;
  color: var(--gray-500);
}
</style>