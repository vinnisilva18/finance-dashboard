<template>
  <div class="dashboard">
    <!-- Welcome -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          Olá, <span class="text-gradient">{{ authStore.userName }}</span>! 👋
        </h1>
        <p class="welcome-subtitle">Acompanhe suas finanças em tempo real</p>
      </div>
      <div class="welcome-stats">
        <div class="stat-badge" v-if="!loading">
          <span class="stat-label">Saldo do Mês</span>
          <span class="stat-value">{{ formatCurrency(totalBalance, 'BRL') }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-grid">
      <router-link to="/transactions" class="quick-action">
        <div class="action-icon add">+</div>
        <span class="action-label">Nova Transação</span>
      </router-link>
      <router-link to="/reports" class="quick-action">
        <div class="action-icon report">📊</div>
        <span class="action-label">Gerar Relatório</span>
      </router-link>
      <router-link to="/goals" class="quick-action">
        <div class="action-icon goal">🎯</div>
        <span class="action-label">Minhas Metas</span>
      </router-link>
      <router-link to="/currency" class="quick-action">
        <div class="action-icon currency">🌎</div>
        <span class="action-label">Câmbio</span>
      </router-link>
    </div>

    <!-- Month Navigator -->
    <div class="month-navigator">
      <button @click="goToPreviousMonth" class="nav-button">‹</button>
      <h2 class="month-title">{{ currentMonthName }} de {{ currentYear }}</h2>
      <button @click="goToNextMonth" class="nav-button">›</button>
    </div>

    <!-- Main Stats Grid -->
    <div class="stats-grid">
      <StatsCard 
        title="Receita do Mês" 
        :amount="stats.income" 
        icon="💰"
        trend-type="positive"
      />
      
      <StatsCard 
        title="Despesas do Mês" 
        :amount="stats.expenses" 
        icon="💸"
        trend-type="negative"
        color="danger"
      />
      
      <StatsCard
        title="Saldo do Mês"
        :amount="stats.savings"
        icon="🏦"
        trend-type="positive"
        color="success"
      />
      
      <StatsCard 
        title="Investimentos" 
        :amount="stats.investments" 
        icon="📈"
        trend-type="positive"
        color="warning"
      />
    </div>

    <!-- Charts & Recent Activity -->
    <div class="content-grid">
      <!-- Income vs Expenses Chart -->
      <div class="chart-section card">
        <div class="section-header">
          <h3>Receitas vs Despesas</h3>
        </div>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="transactions-section card">
        <div class="section-header">
          <h3>Transações Recentes no Mês</h3>
          <router-link to="/transactions" class="view-all">
            Ver todas <span class="arrow">→</span>
          </router-link>
        </div>
        <div class="transactions-list">
           <div v-if="recentTransactions.length === 0" class="empty-data">
              Nenhuma transação neste mês.
          </div>
          <div v-for="transaction in recentTransactions" :key="transaction.id" 
               class="transaction-item">
            <div class="transaction-icon" :style="{ background: transaction.categoryColor }">
              {{ transaction.icon }}
            </div>
            <div class="transaction-details">
              <h4>{{ transaction.description }}</h4>
              <p class="transaction-meta">{{ transaction.category }} • {{ formatDate(transaction.date) }}</p>
            </div>
            <div class="transaction-amount" :class="transaction.type">
              {{ transaction.type === 'income' ? '+' : '-' }} {{ formatCurrency(Math.abs(transaction.amount), 'BRL') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Goals & Categories -->
    <div class="bottom-grid">
      <!-- Goals Progress -->
      <div class="goals-section card">
        <div class="section-header">
          <h3>Metas em Andamento</h3>
          <router-link to="/goals" class="view-all">
            Ver todas <span class="arrow">→</span>
          </router-link>
        </div>
        <div class="goals-list">
          <div v-if="goals.length === 0" class="empty-data">
              Nenhuma meta em andamento.
          </div>
          <div v-for="goal in goals" :key="goal.id" class="goal-item">
            <div class="goal-info">
              <div class="goal-icon" :style="{ background: goal.color }">
                {{ goal.icon }}
              </div>
              <div>
                <h4>{{ goal.name || goal.title }}</h4>
                <p class="goal-deadline">{{ formatDate(goal.deadline) }}</p>
              </div>
            </div>
            <div class="goal-progress">
              <div class="progress-info">
                <span>{{ formatCurrency(goal.current, 'BRL') }} / {{ formatCurrency(goal.target, 'BRL') }}</span>
                <span class="progress-percentage">{{ goal.percentage }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ 
                  width: goal.percentage + '%',
                  background: goal.color
                }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Spending by Category -->
      <div class="categories-section card">
        <div class="section-header">
          <h3>Gastos por Categoria (Mês)</h3>
          <router-link to="/categories" class="view-all">
            Ver todas <span class="arrow">→</span>
          </router-link>
        </div>
        <div class="categories-list">
           <div v-if="categories.length === 0" class="empty-data">
              Nenhum gasto este mês.
          </div>
          <div v-for="category in categories" :key="category.id" class="category-item">
            <div class="category-info">
              <div class="category-color" :style="{ background: category.color }"></div>
              <span class="category-name">{{ category.name }}</span>
            </div>
            <div class="category-details">
              <span class="category-amount">{{ formatCurrency(category.amount, 'BRL') }}</span>
              <span class="category-percentage">{{ category.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Credit Cards Summary -->
    <div class="cards-section">
      <div class="section-header">
        <h3>Cartões de Crédito</h3>
        <router-link to="/credit-cards" class="view-all">
          Gerenciar cartões <span class="arrow">→</span>
        </router-link>
      </div>
      <div class="cards-grid">
         <div v-if="creditCards.length === 0" class="empty-data-full">
              Nenhum cartão de crédito cadastrado.
          </div>
        <div v-for="card in creditCards" :key="card.id" class="credit-card" :style="{ background: card.color }">
          <div class="card-header">
            <div class="card-type">{{ card.type }}</div>
            <div class="card-chip">💳</div>
          </div>
          <div class="card-number">{{ card.number }}</div>
          <div class="card-footer">
            <div class="card-info">
              <div class="card-name">{{ card.name }}</div>
              <div class="card-due">Vence: {{ card.dueDate }}</div>
            </div>
            <div class="card-balance">
              <div class="balance-label">Saldo</div>
              <div class="balance-amount">{{ formatCurrency(card.balance, 'BRL') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency, formatDate } from '../utils/formatters'
import StatsCard from '../components/ui/StatsCard.vue'
import { useDashboard } from '../composables/useDashboard'
import { useAuthStore } from '../stores/auth'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const router = useRouter()
const authStore = useAuthStore()

const {
  loading,
  error,
  totalBalance,
  stats,
  recentTransactions,
  goals,
  categories,
  creditCards,
  chartData,
  goToPreviousMonth,
  goToNextMonth,
  currentMonthName,
  currentYear,
} = useDashboard()

const chartCanvas = ref(null)
let chartInstance = null

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  if (chartCanvas.value && chartData.value) {
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: chartData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += formatCurrency(context.parsed.y, 'BRL');
                }
                return label;
              }
            }
          }
        }
      }
    })
  }
}

onMounted(() => {
  authStore.fetchUser()
  // The chart will be rendered by the watch effect once data is loaded
})

watch(chartData, () => {
  renderChart()
}, { deep: true })
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.5s ease;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.welcome-content {
  flex: 1;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 1rem;
  max-width: 600px;
}

.welcome-stats {
  display: flex;
  align-items: center;
}

.stat-badge {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  backdrop-filter: blur(10px);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

/* Quick Actions */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.quick-action {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.quick-action:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.action-icon.add {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.action-icon.report {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.action-icon.goal {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.action-icon.currency {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.action-label {
  font-weight: 500;
  color: #4b5563;
  font-size: 1rem;
}

/* Month Navigator */
.month-navigator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.month-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: capitalize;
  min-width: 250px;
  text-align: center;
}

.nav-button {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: #f9fafb;
  border-color: #6366f1;
  color: #6366f1;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

/* Chart Section */
.chart-section,
.transactions-section {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6366f1;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-all:hover {
  color: #4f46e5;
}

.arrow {
  font-size: 1.125rem;
  transition: transform 0.2s ease;
}

.view-all:hover .arrow {
  transform: translateX(4px);
}

.chart-container {
  height: 350px;
}

/* Transactions List */
.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.transaction-item:hover {
  background: #f3f4f6;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  color: white;
}

.transaction-details {
  flex: 1;
}

.transaction-details h4 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #374151;
}

.transaction-meta {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

.transaction-amount {
  font-weight: 600;
  font-size: 1.125rem;
}

.transaction-amount.income {
  color: #16a34a;
}

.transaction-amount.expense {
  color: #dc2626;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

.goals-section,
.categories-section {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
}

/* Goals List */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.goal-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
}

.goal-info h4 {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.goal-deadline {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

.goal-progress {
  width: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.progress-info span:first-child {
  color: #6b7280;
}

.progress-percentage {
  font-weight: 600;
  color: #4b5563;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Categories List */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.category-item:hover {
  background: #f3f4f6;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.category-name {
  font-weight: 500;
  color: #4b5563;
}

.category-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-amount {
  font-weight: 700;
  color: #374151;
}

.category-percentage {
  font-size: 0.875rem;
  color: #9ca3af;
  min-width: 40px;
  text-align: right;
}

/* Cards Section */
.cards-section {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.credit-card {
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 200px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}

.credit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(0,0,0,0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-type {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.card-chip {
  font-size: 2rem;
  opacity: 0.8;
}

.card-number {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 2px;
  font-family: monospace;
  margin-top: auto;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-info .card-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-info .card-due {
  font-size: 0.875rem;
  opacity: 0.8;
}

.balance-label {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.balance-amount {
  font-size: 1.25rem;
  font-weight: 700;
}

.empty-data {
    text-align: center;
    padding: 2rem;
    color: #9ca3af;
}

.empty-data-full {
    text-align: center;
    padding: 2rem;
    color: #9ca3af;
    grid-column: 1 / -1;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    align-items: center;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
