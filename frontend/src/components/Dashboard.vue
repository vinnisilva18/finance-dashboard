<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>Bem-vindo, {{ userName }}! 👋</h1>
        <p class="welcome-subtitle">Aqui está um resumo das suas finanças</p>
        <div class="date-info">
          <span class="date-icon">📅</span>
          <span>{{ currentDate }}</span>
        </div>
      </div>
      <div class="welcome-actions">
        <button class="btn-primary">
          <span>+</span> Adicionar Transação
        </button>
        <button class="btn-secondary">
          <span>📊</span> Ver Relatório
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon income">💰</div>
          <div class="stat-trend positive">+2.5%</div>
        </div>
        <h3 class="stat-title">Receita Total</h3>
        <p class="stat-value">{{ formatCurrency(stats.totalIncome) }}</p>
        <div class="stat-footer">
          <span class="stat-period">Este mês</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon expense">💸</div>
          <div class="stat-trend negative">-1.2%</div>
        </div>
        <h3 class="stat-title">Despesas Totais</h3>
        <p class="stat-value">{{ formatCurrency(stats.totalExpenses) }}</p>
        <div class="stat-footer">
          <span class="stat-period">Este mês</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon savings">🏦</div>
          <div class="stat-trend positive">+5.8%</div>
        </div>
        <h3 class="stat-title">Economias</h3>
        <p class="stat-value">{{ formatCurrency(stats.savings) }}</p>
        <div class="stat-footer">
          <span class="stat-period">Saldo atual</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon budget">🎯</div>
          <div class="stat-trend warning">-12%</div>
        </div>
        <h3 class="stat-title">Orçamento</h3>
        <p class="stat-value">{{ stats.budgetUsed }}% usado</p>
        <div class="stat-footer">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: stats.budgetUsed + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>Receitas vs Despesas</h3>
          <select class="period-select">
            <option>Últimos 30 dias</option>
            <option>Últimos 3 meses</option>
            <option>Este ano</option>
          </select>
        </div>
        <div class="chart-container">
          <!-- Chart would go here -->
          <div class="chart-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-chart">
                <div v-for="i in 12" :key="i" class="chart-bar"
                     :style="{ height: Math.random() * 60 + 20 + '%' }">
                </div>
              </div>
              <p>Gastos por mês</p>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3>Distribuição por Categoria</h3>
          <button class="btn-icon">
            <span>⋮</span>
          </button>
        </div>
        <div class="chart-container">
          <!-- Pie chart would go here -->
          <div class="chart-placeholder pie">
            <div class="pie-chart">
              <div class="pie-segment" style="--size: 0.35; --color: #6366f1;"></div>
              <div class="pie-segment" style="--size: 0.25; --color: #10b981;"></div>
              <div class="pie-segment" style="--size: 0.20; --color: #f59e0b;"></div>
              <div class="pie-segment" style="--size: 0.15; --color: #ef4444;"></div>
              <div class="pie-segment" style="--size: 0.05; --color: #8b5cf6;"></div>
            </div>
            <div class="chart-legend">
              <div v-for="category in categories" :key="category.name" class="legend-item">
                <span class="legend-color" :style="{ backgroundColor: category.color }"></span>
                <span class="legend-label">{{ category.name }}</span>
                <span class="legend-value">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="transactions-section">
      <div class="section-header">
        <h3>Transações Recentes</h3>
        <router-link to="/transactions" class="view-all">
          Ver todas <span>→</span>
        </router-link>
      </div>
      <div class="transactions-list">
        <div v-for="transaction in recentTransactions" :key="transaction.id" 
             class="transaction-item" :class="transaction.type">
          <div class="transaction-icon">
            <span>{{ transaction.icon }}</span>
          </div>
          <div class="transaction-details">
            <h4>{{ transaction.description }}</h4>
            <p class="transaction-meta">
              {{ formatDate(transaction.date) }} • {{ transaction.category }}
            </p>
          </div>
          <div class="transaction-amount" :class="transaction.type">
            {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Goals Overview -->
    <div class="goals-section">
      <div class="section-header">
        <h3>Metas em Andamento</h3>
        <router-link to="/goals" class="view-all">
          Ver todas <span>→</span>
        </router-link>
      </div>
      <div class="goals-grid">
        <div v-for="goal in goals" :key="goal.id" class="goal-card">
          <div class="goal-header">
            <div class="goal-icon" :style="{ backgroundColor: goal.color + '20' }">
              <span :style="{ color: goal.color }">{{ goal.icon }}</span>
            </div>
            <div class="goal-info">
              <h4>{{ goal.name }}</h4>
              <p class="goal-deadline">{{ goal.deadline }}</p>
            </div>
          </div>
          <div class="goal-progress">
            <div class="progress-info">
              <span>{{ formatCurrency(goal.current) }} / {{ formatCurrency(goal.target) }}</span>
              <span>{{ goal.percentage }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ 
                width: goal.percentage + '%',
                backgroundColor: goal.color
              }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Ações Rápidas</h3>
      <div class="actions-grid">
        <button class="action-btn">
          <span class="action-icon">📤</span>
          <span class="action-label">Exportar Dados</span>
        </button>
        <button class="action-btn">
          <span class="action-icon">🔔</span>
          <span class="action-label">Configurar Alertas</span>
        </button>
        <button class="action-btn">
          <span class="action-icon">💼</span>
          <span class="action-label">Consultor Financeiro</span>
        </button>
        <button class="action-btn">
          <span class="action-icon">📋</span>
          <span class="action-label">Criar Orçamento</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { formatCurrency, formatDate } from '../utils/formatters'

const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name?.split(' ')[0] || 'Usuário')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const stats = ref({
  totalIncome: 8500,
  totalExpenses: 6200,
  savings: 2300,
  budgetUsed: 78
})

const categories = ref([
  { name: 'Alimentação', percentage: 35, color: '#6366f1' },
  { name: 'Transporte', percentage: 25, color: '#10b981' },
  { name: 'Lazer', percentage: 20, color: '#f59e0b' },
  { name: 'Moradia', percentage: 15, color: '#ef4444' },
  { name: 'Outros', percentage: 5, color: '#8b5cf6' }
])

const recentTransactions = ref([
  { id: 1, description: 'Salário', type: 'income', amount: 5000, date: '2024-01-15', category: 'Receita', icon: '💰' },
  { id: 2, description: 'Supermercado', type: 'expense', amount: -350, date: '2024-01-14', category: 'Alimentação', icon: '🛒' },
  { id: 3, description: 'Combustível', type: 'expense', amount: -180, date: '2024-01-13', category: 'Transporte', icon: '⛽' },
  { id: 4, description: 'Restaurante', type: 'expense', amount: -120, date: '2024-01-12', category: 'Alimentação', icon: '🍽️' },
  { id: 5, description: 'Freelance', type: 'income', amount: 800, date: '2024-01-11', category: 'Receita', icon: '💼' }
])

const goals = ref([
  { id: 1, name: 'Fundo de Emergência', current: 6500, target: 10000, percentage: 65, deadline: 'Dez 2024', color: '#6366f1', icon: '🏦' },
  { id: 2, name: 'Viagem', current: 1200, target: 5000, percentage: 24, deadline: 'Jun 2024', color: '#10b981', icon: '✈️' },
  { id: 3, name: 'Notebook Novo', current: 2500, target: 6000, percentage: 42, deadline: 'Mar 2024', color: '#f59e0b', icon: '💻' }
])
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Welcome Section */
.welcome-section {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: var(--radius-lg);
  padding: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: var(--shadow-lg);
}

.welcome-content h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

.date-icon {
  font-size: 1rem;
}

.welcome-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}

.btn-primary {
  background: white;
  color: var(--primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.income {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  color: #1d4ed8;
}

.stat-icon.expense {
  background: linear-gradient(135deg, #fce7f3, #f9a8d4);
  color: #be185d;
}

.stat-icon.savings {
  background: linear-gradient(135deg, #dcfce7, #86efac);
  color: #166534;
}

.stat-icon.budget {
  background: linear-gradient(135deg, #fef3c7, #fcd34d);
  color: #92400e;
}

.stat-trend {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.stat-trend.positive {
  background: #dcfce7;
  color: #166534;
}

.stat-trend.negative {
  background: #fee2e2;
  color: #dc2626;
}

.stat-trend.warning {
  background: #fef3c7;
  color: #92400e;
}

.stat-title {
  font-size: 0.9375rem;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.stat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-period {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
}

.period-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  background: white;
  font-size: 0.875rem;
  color: var(--gray-700);
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--gray-500);
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: var(--gray-100);
}

.chart-container {
  height: 300px;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
  border-radius: var(--radius);
  border: 2px dashed var(--gray-200);
}

.chart-placeholder.pie {
  flex-direction: row;
  gap: 2rem;
  padding: 2rem;
}

.placeholder-chart {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 200px;
  padding: 1rem;
}

.chart-bar {
  width: 20px;
  background: linear-gradient(to top, #6366f1, #8b5cf6);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
}

.pie-chart {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    var(--color) 0 calc(var(--size) * 360deg),
    transparent calc(var(--size) * 360deg) 360deg
  );
}

.pie-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);
  transform: rotate(calc(var(--i, 0) * 360deg));
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  font-size: 0.875rem;
  color: var(--gray-700);
  flex: 1;
}

.legend-value {
  font-weight: 600;
  color: var(--gray-900);
}

/* Transactions Section */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
}

.view-all {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
}

.view-all:hover {
  color: var(--primary-dark);
}

.transactions-list {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray-100);
  transition: var(--transition);
}

.transaction-item:hover {
  background: var(--gray-50);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.transaction-details {
  flex: 1;
}

.transaction-details h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.transaction-meta {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.transaction-amount {
  font-size: 1.125rem;
  font-weight: 600;
}

.transaction-amount.income {
  color: var(--secondary);
}

.transaction-amount.expense {
  color: var(--danger);
}

/* Goals Section */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.goal-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.goal-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.goal-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.goal-deadline {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.goal-progress {
  margin-top: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.progress-info span:first-child {
  color: var(--gray-600);
}

.progress-info span:last-child {
  font-weight: 600;
  color: var(--gray-900);
}

/* Quick Actions */
.quick-actions {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.quick-actions h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: var(--gray-50);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition);
}

.action-btn:hover {
  background: white;
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.action-icon {
  font-size: 2rem;
}

.action-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--gray-700);
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .welcome-actions {
    width: 100%;
  }
  
  .btn-primary, .btn-secondary {
    flex: 1;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .goals-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-content h1 {
    font-size: 1.5rem;
  }
}
</style>