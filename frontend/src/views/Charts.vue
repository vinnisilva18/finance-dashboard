<template>
  <div class="charts">
    <h1>Gráficos Financeiros</h1>
    
    <div class="chart-filters">
      <div class="filter-group">
        <label>Período de Tempo:</label>
        <select v-model="timePeriod" @change="updateCharts">
          <option value="7d">Últimos 7 Dias</option>
          <option value="30d">Últimos 30 Dias</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Chart Type:</label>
        <select v-model="chartType" @change="updateCharts">
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-container card">
        <h3>Income vs Expenses</h3>
        <div class="chart-wrapper">
          <canvas ref="incomeExpenseChart"></canvas>
        </div>
        <div class="chart-summary">
          <div class="summary-item">
            <span class="label">Total Income:</span>
            <span class="value positive">{{ formatCurrency(incomeTotal) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Total Expenses:</span>
            <span class="value negative">{{ formatCurrency(expenseTotal) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Net Savings:</span>
            <span class="value" :class="netSavings >= 0 ? 'positive' : 'negative'">
              {{ formatCurrency(netSavings) }}
            </span>
          </div>
        </div>
      </div>

      <div class="chart-container card">
        <h3>Category Spending</h3>
        <div class="chart-wrapper">
          <canvas ref="categoryChart"></canvas>
        </div>
        <div class="legend">
          <div v-for="(item, index) in categoryData" :key="index" class="legend-item">
            <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
            <span class="legend-label">{{ item.category }}</span>
            <span class="legend-value">{{ formatCurrency(item.spent) }}</span>
          </div>
        </div>
      </div>

      <div class="chart-container card">
        <h3>Monthly Trend</h3>
        <div class="chart-wrapper">
          <canvas ref="trendChart"></canvas>
        </div>
        <div class="trend-info">
          <div class="trend-item">
            <span>Average Monthly Income:</span>
            <strong>{{ formatCurrency(avgMonthlyIncome) }}</strong>
          </div>
          <div class="trend-item">
            <span>Average Monthly Expenses:</span>
            <strong>{{ formatCurrency(avgMonthlyExpenses) }}</strong>
          </div>
        </div>
      </div>

      <div class="chart-container card">
        <h3>Savings Progress</h3>
        <div class="chart-wrapper">
          <canvas ref="savingsChart"></canvas>
        </div>
        <div class="progress-summary">
          <div v-for="goal in goals" :key="goal.id" class="goal-progress">
            <div class="goal-header">
              <span>{{ goal.name }}</span>
              <span>{{ Math.round(goal.progress * 100) }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{
                width: `${goal.progress * 100}%`,
                backgroundColor: goal.color
              }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="export-section">
      <h3>Export Charts</h3>
      <div class="export-actions">
        <button @click="exportAsImage" class="btn btn-primary">
          📸 Export as Image
        </button>
        <button @click="exportData" class="btn btn-secondary">
          📊 Export Data (CSV)
        </button>
        <button @click="printCharts" class="btn">
          🖨️ Print Report
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { formatCurrency } from '../utils/formatters'
import { exportToCSV } from '../utils/export'

Chart.register(...registerables)

const timePeriod = ref('30d')
const chartType = ref('bar')

// Refs para os canvases
const incomeExpenseChart = ref(null)
const categoryChart = ref(null)
const trendChart = ref(null)
const savingsChart = ref(null)

// Instâncias dos charts
let incomeExpenseChartInstance = null
let categoryChartInstance = null
let trendChartInstance = null
let savingsChartInstance = null

// Dados simulados
const incomeTotal = ref(8500)
const expenseTotal = ref(6200)
const netSavings = computed(() => incomeTotal.value - expenseTotal.value)

const categoryData = ref([
  { category: 'Food & Dining', spent: 1200, color: '#4CAF50' },
  { category: 'Transportation', spent: 800, color: '#2196F3' },
  { category: 'Shopping', spent: 1500, color: '#FF9800' },
  { category: 'Entertainment', spent: 600, color: '#9C27B0' },
  { category: 'Utilities', spent: 900, color: '#607D8B' },
  { category: 'Healthcare', spent: 400, color: '#FF5722' }
])

const goals = ref([
  { id: 1, name: 'Emergency Fund', progress: 0.65, color: '#4CAF50' },
  { id: 2, name: 'New Car', progress: 0.48, color: '#2196F3' },
  { id: 3, name: 'Vacation', progress: 0.4, color: '#FF9800' },
  { id: 4, name: 'Home Renovation', progress: 0.53, color: '#9C27B0' }
])

const avgMonthlyIncome = ref(5200)
const avgMonthlyExpenses = ref(3800)

onMounted(() => {
  renderCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  destroyCharts()
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  destroyCharts()
  renderCharts()
}

const renderCharts = () => {
  renderIncomeExpenseChart()
  renderCategoryChart()
  renderTrendChart()
  renderSavingsChart()
}

const renderIncomeExpenseChart = () => {
  if (!incomeExpenseChart.value) return
  
  const ctx = incomeExpenseChart.value.getContext('2d')
  
  incomeExpenseChartInstance = new Chart(ctx, {
    type: chartType.value,
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Income',
          data: [4500, 5200, 4800, 5500, 6000, 5800],
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
          borderWidth: 2
        },
        {
          label: 'Expenses',
          data: [3200, 3500, 3800, 4000, 4200, 3900],
          backgroundColor: '#FF5722',
          borderColor: '#FF5722',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => formatCurrency(value)
          }
        }
      }
    }
  })
}

const renderCategoryChart = () => {
  if (!categoryChart.value) return
  
  const ctx = categoryChart.value.getContext('2d')
  
  categoryChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categoryData.value.map(item => item.category),
      datasets: [{
        data: categoryData.value.map(item => item.spent),
        backgroundColor: categoryData.value.map(item => item.color),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: context => {
              const value = context.raw
              const total = categoryData.value.reduce((sum, item) => sum + item.spent, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${context.label}: ${formatCurrency(value)} (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

const renderTrendChart = () => {
  if (!trendChart.value) return
  
  const ctx = trendChart.value.getContext('2d')
  
  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Income Trend',
          data: [4500, 5200, 4800, 5500, 6000, 5800, 6200],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Expense Trend',
          data: [3200, 3500, 3800, 4000, 4200, 3900, 4100],
          borderColor: '#FF5722',
          backgroundColor: 'rgba(255, 87, 34, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => formatCurrency(value)
          }
        }
      }
    }
  })
}

const renderSavingsChart = () => {
  if (!savingsChart.value) return
  
  const ctx = savingsChart.value.getContext('2d')
  
  savingsChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: goals.value.map(goal => goal.name),
      datasets: [{
        data: goals.value.map(goal => goal.progress * 100),
        backgroundColor: goals.value.map(goal => goal.color),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: context => {
              return `${context.label}: ${context.raw.toFixed(1)}%`
            }
          }
        }
      }
    }
  })
}

const updateCharts = () => {
  destroyCharts()
  renderCharts()
}

const destroyCharts = () => {
  if (incomeExpenseChartInstance) {
    incomeExpenseChartInstance.destroy()
    incomeExpenseChartInstance = null
  }
  if (categoryChartInstance) {
    categoryChartInstance.destroy()
    categoryChartInstance = null
  }
  if (trendChartInstance) {
    trendChartInstance.destroy()
    trendChartInstance = null
  }
  if (savingsChartInstance) {
    savingsChartInstance.destroy()
    savingsChartInstance = null
  }
}

const exportAsImage = () => {
  alert('Image export functionality would require additional setup with html2canvas library')
  // Implementação real:
  // import html2canvas from 'html2canvas'
  // html2canvas(document.querySelector('.charts')).then(canvas => {
  //   const link = document.createElement('a')
  //   link.download = 'financial-charts.png'
  //   link.href = canvas.toDataURL()
  //   link.click()
  // })
}

const exportData = () => {
  const data = categoryData.value.map(item => ({
    Category: item.category,
    Amount: item.spent,
    'Percentage': ((item.spent / categoryData.value.reduce((sum, i) => sum + i.spent, 0)) * 100).toFixed(1) + '%'
  }))
  
  exportToCSV(data, 'category-spending')
}

const printCharts = () => {
  window.print()
}
</script>

<style scoped>
.charts {
  padding: 20px;
}

.chart-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container {
  padding: 20px;
}

.chart-container h3 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  margin-bottom: 20px;
}

.chart-summary {
  display: grid;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item .label {
  color: #666;
}

.summary-item .value {
  font-weight: 600;
}

.positive {
  color: #4CAF50;
}

.negative {
  color: #FF5722;
}

.legend {
  display: grid;
  gap: 8px;
  margin-top: 15px;
  max-height: 200px;
  overflow-y: auto;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  flex: 1;
  font-size: 0.9em;
  color: #666;
}

.legend-value {
  font-weight: 600;
  color: #333;
}

.trend-info {
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  font-size: 0.9em;
}

.progress-summary {
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.goal-progress {
  margin-bottom: 15px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.progress-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s;
}

.export-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 30px;
}

.export-section h3 {
  margin: 0 0 15px 0;
}

.export-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media print {
  .chart-filters,
  .export-section {
    display: none;
  }
  
  .charts-grid {
    break-inside: avoid;
  }
}
</style>