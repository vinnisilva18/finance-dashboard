<template>
  <div class="reports">
    <div class="header">
      <h1>Relatórios Financeiros</h1>
      <div class="header-actions">
        <select v-model="reportPeriod" @change="handlePeriodChange" class="period-select">
          <option value="monthly">Relatório Mensal</option>
          <option value="quarterly">Relatório Trimestral</option>
          <option value="yearly">Relatório Anual</option>
          <option value="custom">Período Personalizado</option>
        </select>
        <button @click="exportReport" class="btn btn-primary">
          📊 Exportar Relatório
        </button>
      </div>
    </div>

    <div v-if="showCustomRange" class="custom-range card">
      <h3>Intervalo de Datas Personalizado</h3>
      <div class="range-selector">
        <div class="date-input">
          <label>De</label>
          <input v-model="dateRange.start" type="date" class="form-control">
        </div>
        <div class="date-input">
          <label>Para</label>
          <input v-model="dateRange.end" type="date" class="form-control">
        </div>
        <button @click="applyCustomRange" class="btn btn-primary">
          Aplicar
        </button>
      </div>
    </div>

    <div v-if="!loading" class="report-summary">
      <div class="summary-card">
        <h3>Receita Total</h3>
        <p class="amount positive">{{ formatCurrency(reportData.totalIncome, 'BRL') }}</p>
      </div>
      <div class="summary-card">
        <h3>Despesa Total</h3>
        <p class="amount negative">{{ formatCurrency(reportData.totalExpenses, 'BRL') }}</p>
      </div>
      <div class="summary-card">
        <h3>Economia Líquida</h3>
        <p class="amount" :class="reportData.netSavings >= 0 ? 'positive' : 'negative'">
          {{ formatCurrency(reportData.netSavings, 'BRL') }}
        </p>
      </div>
      <div class="summary-card">
        <h3>Taxa de Poupança</h3>
        <p class="amount">{{ (reportData.savingsRate * 100).toFixed(1) }}%</p>
        <div class="progress-circle" :style="circleStyle">
          <span>{{ Math.round(reportData.savingsRate * 100) }}%</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Gerando relatório...</p>
    </div>

    <div v-if="!loading && !error" class="report-sections">
      <div class="section-card card">
        <div class="section-header">
          <h3>Detalhamento de Receitas</h3>
          <div class="section-period">{{ reportPeriodLabel }}</div>
        </div>
        <div class="income-breakdown">
          <div v-if="reportData.incomeSources.length === 0" class="empty-data">
              Nenhuma receita encontrada para este período.
          </div>
          <div v-for="source in reportData.incomeSources" :key="source.name" class="source-item">
            <div class="source-info">
              <div class="source-name">{{ source.name }}</div>
              <div class="source-amount">{{ formatCurrency(source.amount, 'BRL') }}</div>
            </div>
            <div class="source-bar">
              <div class="bar-fill" :style="{ 
                width: `${(source.amount / reportData.totalIncome) * 100}%`,
                backgroundColor: source.color
              }"></div>
            </div>
            <div class="source-percentage">
              {{ ((source.amount / reportData.totalIncome) * 100).toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>

      <div class="section-card card">
        <div class="section-header">
          <h3>Categorias de Despesas</h3>
          <div class="section-period">{{ reportPeriodLabel }}</div>
        </div>
        <div class="expense-categories">
           <div v-if="reportData.expenseCategories.length === 0" class="empty-data">
              Nenhuma despesa encontrada para este período.
          </div>
          <div v-for="category in reportData.expenseCategories" :key="category.name" class="category-item">
            <div class="category-color" :style="{ backgroundColor: category.color }"></div>
            <div class="category-info">
              <div class="category-name">{{ category.name }}</div>
              <div class="category-stats">
                <span class="category-amount">{{ formatCurrency(category.amount, 'BRL') }}</span>
                <span class="category-percentage">{{ category.percentage }}%</span>
              </div>
            </div>
            <div class="category-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ 
                  width: `${category.percentage}%`,
                  backgroundColor: category.color
                }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card card">
        <div class="section-header">
          <h3>Maiores Transações</h3>
          <div class="transaction-count">{{ reportData.topTransactions.length }} maiores</div>
        </div>
        <div class="transactions-list">
           <div v-if="reportData.topTransactions.length === 0" class="empty-data">
              Nenhuma transação encontrada para este período.
          </div>
          <table v-else>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in reportData.topTransactions" :key="transaction.id">
                <td>{{ formatDate(transaction.date) }}</td>
                <td>{{ transaction.description }}</td>
                <td>
                  <span class="category-tag" :style="{ backgroundColor: transaction.categoryColor }">
                    {{ transaction.category }}
                  </span>
                </td>
                <td :class="transaction.amount >= 0 ? 'positive' : 'negative'">
                  {{ formatCurrency(transaction.amount, 'BRL') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="section-card card">
        <div class="section-header">
          <h3>Progresso das Metas</h3>
          <div class="goals-summary">
            {{ reportData.goalsProgress.completed }}/{{ reportData.goalsProgress.total }} completas
          </div>
        </div>
        <div class="goals-progress">
           <div v-if="reportData.goals.length === 0" class="empty-data">
              Nenhuma meta encontrada.
          </div>
          <div v-for="goal in reportData.goals" :key="goal.id" class="goal-item">
            <div class="goal-header">
              <span class="goal-name">{{ goal.name }}</span>
              <span class="goal-percentage">{{ goal.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ 
                width: `${goal.progress}%`,
                backgroundColor: goal.color
              }"></div>
            </div>
            <div class="goal-details">
              <span>{{ formatCurrency(goal.current, 'BRL') }} / {{ formatCurrency(goal.target, 'BRL') }}</span>
              <span class="goal-deadline">{{ goal.deadline }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
     <div v-if="error" class="error-state">
        <h3>Ocorreu um erro ao gerar o relatório.</h3>
        <p>{{ error }}</p>
    </div>

    <div class="report-actions">
      <button @click="printReport" class="btn btn-primary">
        🖨️ Imprimir Relatório
      </button>
      <button @click="saveReport" class="btn btn-secondary">
        💾 Salvar Relatório
      </button>
      <button @click="shareReport" class="btn">
        📤 Compartilhar
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReports } from '../composables/useReports'
import { formatCurrency, formatDate } from '../utils/formatters'

const reportPeriod = ref('monthly')
const showCustomRange = ref(false)
const trendType = ref('income')

const dateRange = ref({
  start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const { loading, error, reportData, generateReport } = useReports()

const reportPeriodLabel = computed(() => {
  const now = new Date()
  switch (reportPeriod.value) {
    case 'monthly':
      return now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    case 'quarterly':
      const quarter = Math.floor(now.getMonth() / 3) + 1
      return `T${quarter} ${now.getFullYear()}`
    case 'yearly':
      return now.getFullYear().toString()
    case 'custom':
      return `${formatDate(dateRange.value.start)} - ${formatDate(dateRange.value.end)}`
    default:
      return 'Período Atual'
  }
})

const circleStyle = computed(() => {
  const rate = reportData.value.savingsRate || 0;
  return {
    background: `conic-gradient(#4CAF50 0% ${rate * 100}%, #f0f0f0 ${rate * 100}% 100%)`
  }
})

onMounted(() => {
  generateReport(reportPeriod.value)
})

const handlePeriodChange = () => {
    if (reportPeriod.value === 'custom') {
        showCustomRange.value = true;
    } else {
        showCustomRange.value = false;
        generateReport(reportPeriod.value)
    }
}

const applyCustomRange = () => {
  generateReport({
      start: dateRange.value.start,
      end: dateRange.value.end
  })
}

const exportReport = () => {
    alert('Funcionalidade de exportar em desenvolvimento.')
}

const printReport = () => {
  window.print()
}

const saveReport = () => {
    alert('Funcionalidade de salvar em desenvolvimento.')
}

const shareReport = () => {
  if (navigator.share) {
    navigator.share({
      title: `Relatório Financeiro - ${reportPeriodLabel.value}`,
      text: `Confira meu relatório financeiro para ${reportPeriodLabel.value}`,
      url: window.location.href
    })
  } else {
    alert('API de compartilhamento não suportada no seu navegador.')
  }
}
</script>

<style scoped>
.reports {
  padding: 20px;
  position: relative;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}
.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}
.period-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 1em;
}
.custom-range {
  margin-bottom: 30px;
}
.range-selector {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}
.date-input {
  flex: 1;
}
.date-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
.report-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.summary-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  position: relative;
}
.summary-card h3 {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 1em;
}
.summary-card .amount {
  margin: 0 0 10px 0;
  font-size: 2em;
  font-weight: bold;
}
.positive {
  color: #4CAF50;
}
.negative {
  color: #FF5722;
}
.change-indicator {
  font-size: 0.9em;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
}
.change-indicator.positive {
  background: #d4edda;
  color: #155724;
}
.change-indicator.negative {
  background: #f8d7da;
  color: #721c24;
}
.progress-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.progress-circle::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
}
.progress-circle span {
  position: relative;
  z-index: 1;
  font-weight: bold;
  font-size: 1.2em;
}
.report-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.section-card {
  padding: 25px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.section-header h3 {
  margin: 0;
  color: #333;
}
.section-period {
  color: #666;
  font-size: 0.9em;
}
.income-breakdown,
.expense-categories,
.budget-comparison,
.goals-progress {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.source-item,
.category-item,
.budget-item,
.goal-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 15px;
  align-items: center;
}
.source-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.source-name {
  font-weight: 500;
  color: #333;
}
.source-amount {
  font-weight: 600;
  color: #555;
}
.source-bar {
  grid-column: 1 / -1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  transition: width 0.3s;
}
.source-percentage {
  text-align: right;
  font-size: 0.9em;
  color: #666;
}
.category-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.category-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.category-stats {
  display: flex;
  gap: 15px;
  align-items: center;
}
.category-progress {
  grid-column: 1 / -1;
}
.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  transition: width 0.3s;
}
.trend-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}
.chart-container {
  height: 300px;
  position: relative;
}
.budget-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}
.budget-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 500;
}
.budget-status.under {
  background: #d4edda;
  color: #155724;
}
.budget-status.over {
  background: #f8d7da;
  color: #721c24;
}
.budget-bars {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 10px 0;
}
.budget-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bar-label {
  width: 60px;
  font-size: 0.9em;
  color: #666;
}
.bar-container {
  flex: 1;
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}
.bar-fill.budget {
  background: #6c757d;
}
.bar-fill.actual {
  background: #4CAF50;
}
.bar-amount {
  width: 80px;
  text-align: right;
  font-size: 0.9em;
  font-weight: 500;
}
.bar-amount.over-budget {
  color: #FF5722;
}
.budget-difference {
  text-align: right;
  font-weight: 500;
}
.transactions-list table {
  width: 100%;
  border-collapse: collapse;
}
.transactions-list th,
.transactions-list td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.transactions-list th {
  font-weight: 600;
  color: #666;
  background: #f9f9f9;
}
.category-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  color: white;
}
.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.goal-name {
  font-weight: 500;
}
.goal-percentage {
  font-weight: 600;
  color: #4CAF50;
}
.goal-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}
.report-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}
.loading-state, .error-state, .empty-data {
    text-align: center;
    padding: 40px;
    color: #666;
}
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media print {
  .header-actions,
  .report-actions,
  .trend-select,
  button {
    display: none !important;
  }
  
  .report-summary,
  .report-sections {
    break-inside: avoid;
  }
}
</style>
