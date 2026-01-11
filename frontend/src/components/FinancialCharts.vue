<template>
  <div class="financial-charts">
    <q-card class="main-card">
      <q-card-section>
        <div class="header">
          <h2>Gráficos Financeiros</h2>
          <div class="header-controls">
            <q-select
              v-model="timeRange"
              :options="timeRangeOptions"
              dense
              outlined
              style="width: 180px;"
            />
            <q-btn 
              icon="download" 
              color="primary" 
              @click="exportCharts"
            >
              <q-tooltip>Exportar gráficos</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Filtros Avançados -->
        <div class="filters-section">
          <q-card class="filters-card">
            <q-card-section>
              <div class="filters-grid">
                <div class="filter-group">
                  <label>Categoria</label>
                  <q-select
                    v-model="selectedCategory"
                    :options="categoryOptions"
                    multiple
                    dense
                    outlined
                    use-chips
                    style="min-width: 200px;"
                  />
                </div>
                <div class="filter-group">
                  <label>Tipo</label>
                  <q-select
                    v-model="selectedType"
                    :options="typeOptions"
                    multiple
                    dense
                    outlined
                    use-chips
                  />
                </div>
                <div class="filter-group">
                  <label>Data</label>
                  <div class="date-range">
                    <q-input
                      v-model="dateFrom"
                      type="date"
                      dense
                      outlined
                      placeholder="De"
                    />
                    <q-input
                      v-model="dateTo"
                      type="date"
                      dense
                      outlined
                      placeholder="Até"
                    />
                  </div>
                </div>
                <div class="filter-actions">
                  <q-btn 
                    label="Aplicar" 
                    color="primary" 
                    @click="applyFilters"
                  />
                  <q-btn 
                    label="Limpar" 
                    flat 
                    @click="clearFilters"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Gráficos Principais -->
        <div class="charts-grid">
          <!-- Gráfico de Evolução -->
          <div class="chart-container">
            <q-card class="chart-card">
              <q-card-section>
                <div class="chart-header">
                  <h3>Evolução Financeira</h3>
                  <div class="chart-legend">
                    <div class="legend-item">
                      <div class="legend-color income"></div>
                      <span>Receitas</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color expense"></div>
                      <span>Despesas</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color balance"></div>
                      <span>Saldo</span>
                    </div>
                  </div>
                </div>
                <div class="chart-wrapper">
                  <canvas ref="evolutionChart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráfico de Pizza por Categoria -->
          <div class="chart-container">
            <q-card class="chart-card">
              <q-card-section>
                <div class="chart-header">
                  <h3>Distribuição por Categoria</h3>
                  <q-select
                    v-model="pieChartType"
                    :options="pieTypeOptions"
                    dense
                    outlined
                    style="width: 150px;"
                  />
                </div>
                <div class="chart-wrapper">
                  <canvas ref="categoryPieChart"></canvas>
                </div>
                <div class="chart-summary">
                  <div class="summary-item">
                    <span class="label">Total</span>
                    <span class="value">R$ {{ formatCurrency(categoryTotal) }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Categorias</span>
                    <span class="value">{{ categoryCount }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Maior</span>
                    <span class="value">{{ topCategory }}</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráfico de Comparação Mensal -->
          <div class="chart-container full-width">
            <q-card class="chart-card">
              <q-card-section>
                <div class="chart-header">
                  <h3>Comparação Mensal</h3>
                  <q-select
                    v-model="comparisonYear"
                    :options="yearOptions"
                    dense
                    outlined
                    style="width: 120px;"
                  />
                </div>
                <div class="chart-wrapper">
                  <canvas ref="monthlyComparisonChart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráfico de Metas -->
          <div class="chart-container">
            <q-card class="chart-card">
              <q-card-section>
                <div class="chart-header">
                  <h3>Progresso das Metas</h3>
                  <q-btn 
                    icon="refresh" 
                    flat 
                    round 
                    @click="refreshGoalsChart"
                  />
                </div>
                <div class="chart-wrapper">
                  <canvas ref="goalsChart"></canvas>
                </div>
                <div class="goals-summary">
                  <div class="goal-item" v-for="goal in goalsSummary" :key="goal.id">
                    <div class="goal-info">
                      <div class="goal-name">{{ goal.name }}</div>
                      <div class="goal-progress">{{ goal.progress }}%</div>
                    </div>
                    <q-linear-progress 
                      :value="goal.progress / 100" 
                      :color="getGoalColor(goal.progress)"
                      size="6px"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráfico de Tendência -->
          <div class="chart-container">
            <q-card class="chart-card">
              <q-card-section>
                <div class="chart-header">
                  <h3>Tendência Anual</h3>
                  <q-btn-toggle
                    v-model="trendType"
                    :options="trendOptions"
                    dense
                    flat
                  />
                </div>
                <div class="chart-wrapper">
                  <canvas ref="trendChart"></canvas>
                </div>
                <div class="trend-stats">
                  <div class="stat-item">
                    <div class="stat-label">Média Mensal</div>
                    <div class="stat-value">R$ {{ formatCurrency(monthlyAverage) }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Crescimento</div>
                    <div class="stat-value" :class="growthClass">
                      {{ growthRate }}%
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Insights e Análises -->
        <div class="insights-section">
          <q-card class="insights-card">
            <q-card-section>
              <h3>Insights Financeiros</h3>
              <div class="insights-grid">
                <div class="insight-item positive">
                  <q-icon name="trending_up" size="24px" />
                  <div class="insight-content">
                    <div class="insight-title">Receitas em Alta</div>
                    <div class="insight-text">
                      Suas receitas aumentaram {{ insights.incomeGrowth }}% este mês
                    </div>
                  </div>
                </div>
                <div class="insight-item warning">
                  <q-icon name="warning" size="24px" />
                  <div class="insight-content">
                    <div class="insight-title">Categoria Crítica</div>
                    <div class="insight-text">
                      {{ insights.topExpenseCategory }} está acima do orçamento
                    </div>
                  </div>
                </div>
                <div class="insight-item info">
                  <q-icon name="flag" size="24px" />
                  <div class="insight-content">
                    <div class="insight-title">Meta Próxima</div>
                    <div class="insight-text">
                      {{ insights.closestGoal }} está a {{ insights.goalProgress }}% da conclusão
                    </div>
                  </div>
                </div>
                <div class="insight-item negative">
                  <q-icon name="paid" size="24px" />
                  <div class="insight-content">
                    <div class="insight-title">Cartão de Crédito</div>
                    <div class="insight-text">
                      {{ insights.cardUsage }}% do limite utilizado
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Tabela de Dados -->
        <div class="data-table-section">
          <q-card>
            <q-card-section>
              <div class="table-header">
                <h3>Dados Detalhados</h3>
                <q-btn 
                  icon="table_chart" 
                  label="Exportar Dados" 
                  color="primary"
                  @click="exportData"
                />
              </div>
              <q-table
                :rows="chartData"
                :columns="dataColumns"
                row-key="id"
                dense
                flat
                :pagination="pagination"
              >
                <template v-slot:body-cell-amount="props">
                  <q-td :props="props">
                    <div :class="props.row.type === 'income' ? 'positive' : 'negative'">
                      {{ props.row.type === 'income' ? '+' : '-' }} R$ {{ formatCurrency(props.row.amount) }}
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-trend="props">
                  <q-td :props="props">
                    <div class="trend-indicator" :class="getTrendClass(props.row.trend)">
                      <q-icon :name="props.row.trend >= 0 ? 'trending_up' : 'trending_down'" />
                      <span>{{ Math.abs(props.row.trend) }}%</span>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useGoalStore } from '@/stores/goal'
import { useCategoryStore } from '@/stores/category'
import { useCardStore } from '@/stores/card'
import { useQuasar } from 'quasar'
import { Chart, registerables } from 'chart.js'
import { formatCurrency } from '@/utils/formatters'
import { exportToPDF, exportToExcel } from '@/utils/export'

Chart.register(...registerables)

const $q = useQuasar()
const transactionStore = useTransactionStore()
const goalStore = useGoalStore()
const categoryStore = useCategoryStore()
const cardStore = useCardStore()

const evolutionChart = ref(null)
const categoryPieChart = ref(null)
const monthlyComparisonChart = ref(null)
const goalsChart = ref(null)
const trendChart = ref(null)

const timeRange = ref('year')
const pieChartType = ref('expense')
const comparisonYear = ref(new Date().getFullYear())
const trendType = ref('income')
const selectedCategory = ref([])
const selectedType = ref([])
const dateFrom = ref('')
const dateTo = ref('')

const timeRangeOptions = [
  { label: 'Últimos 3 meses', value: 'quarter' },
  { label: 'Últimos 6 meses', value: 'half-year' },
  { label: 'Último ano', value: 'year' },
  { label: 'Últimos 2 anos', value: '2-years' }
]

const pieTypeOptions = [
  { label: 'Despesas', value: 'expense' },
  { label: 'Receitas', value: 'income' }
]

const typeOptions = [
  { label: 'Receita', value: 'income' },
  { label: 'Despesa', value: 'expense' }
]

const trendOptions = [
  { label: 'Receitas', value: 'income' },
  { label: 'Despesas', value: 'expense' },
  { label: 'Saldo', value: 'balance' }
]

const dataColumns = [
  { name: 'date', label: 'Data', field: 'date', align: 'left' },
  { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'amount', label: 'Valor', field: 'amount', align: 'right' },
  { name: 'type', label: 'Tipo', field: 'type', align: 'center' },
  { name: 'trend', label: 'Tendência', field: 'trend', align: 'center' }
]

const pagination = ref({
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

const categoryOptions = computed(() => {
  return categoryStore.categories.map(c => ({
    label: c.name,
    value: c.name
  }))
})

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => ({
    label: (currentYear - i).toString(),
    value: currentYear - i
  }))
})

const chartData = computed(() => {
  return transactionStore.filteredTransactions({
    categories: selectedCategory.value,
    types: selectedType.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value
  })
})

const categoryTotal = computed(() => {
  const type = pieChartType.value
  return chartData.value
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0)
})

const categoryCount = computed(() => {
  const type = pieChartType.value
  const categories = new Set(
    chartData.value
      .filter(t => t.type === type)
      .map(t => t.category)
  )
  return categories.size
})

const topCategory = computed(() => {
  const type = pieChartType.value
  const categoryTotals = {}
  
  chartData.value
    .filter(t => t.type === type)
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })
  
  const maxCategory = Object.entries(categoryTotals).reduce((max, [cat, total]) => {
    return total > max.total ? { category: cat, total } : max
  }, { category: '', total: 0 })
  
  return maxCategory.category
})

const goalsSummary = computed(() => {
  return goalStore.activeGoals.map(goal => ({
    id: goal.id,
    name: goal.title,
    progress: Math.round((goal.current / goal.target) * 100)
  }))
})

const monthlyAverage = computed(() => {
  const type = trendType.value
  const monthlyData = transactionStore.getMonthlySummary('year')[type] || []
  return monthlyData.reduce((sum, val) => sum + val, 0) / monthlyData.length || 0
})

const growthRate = computed(() => {
  const type = trendType.value
  const monthlyData = transactionStore.getMonthlySummary('year')[type] || []
  if (monthlyData.length < 2) return 0
  
  const first = monthlyData[0] || 0
  const last = monthlyData[monthlyData.length - 1] || 0
  
  if (first === 0) return 100
  return ((last - first) / first * 100).toFixed(1)
})

const growthClass = computed(() => {
  const rate = parseFloat(growthRate.value)
  if (rate > 0) return 'positive'
  if (rate < 0) return 'negative'
  return 'neutral'
})

const insights = computed(() => {
  const monthlyData = transactionStore.getMonthlySummary('month')
  const lastMonth = transactionStore.getMonthlySummary('month', 1)
  
  const incomeGrowth = monthlyData.income && lastMonth.income
    ? ((monthlyData.income[0] - lastMonth.income[0]) / lastMonth.income[0] * 100).toFixed(1)
    : '0'
  
  const categoryData = transactionStore.getTopCategories(1, 'expense')
  const topExpenseCategory = categoryData[0]?.category || 'Nenhuma'
  
  const closestGoal = goalStore.activeGoals.reduce((closest, goal) => {
    const progress = goal.current / goal.target
    return progress > closest.progress ? { ...goal, progress } : closest
  }, { title: 'Nenhuma', progress: 0 })
  
  const cards = cardStore.cards
  const totalUsed = cards.reduce((sum, card) => sum + card.used, 0)
  const totalLimit = cards.reduce((sum, card) => sum + card.limit, 0)
  const cardUsage = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0
  
  return {
    incomeGrowth,
    topExpenseCategory,
    closestGoal: closestGoal.title,
    goalProgress: Math.round(closestGoal.progress * 100),
    cardUsage
  }
})

onMounted(async () => {
  await Promise.all([
    transactionStore.fetchTransactions(),
    goalStore.fetchGoals(),
    categoryStore.fetchCategories(),
    cardStore.fetchCards()
  ])
  
  setTimeout(() => {
    renderEvolutionChart()
    renderCategoryPieChart()
    renderMonthlyComparisonChart()
    renderGoalsChart()
    renderTrendChart()
  }, 100)
})

watch([timeRange, pieChartType, comparisonYear, trendType, selectedCategory, selectedType, dateFrom, dateTo], () => {
  setTimeout(() => {
    renderEvolutionChart()
    renderCategoryPieChart()
    renderMonthlyComparisonChart()
    renderGoalsChart()
    renderTrendChart()
  }, 50)
})

function getGoalColor(progress) {
  if (progress >= 80) return 'positive'
  if (progress >= 50) return 'warning'
  return 'negative'
}

function getTrendClass(trend) {
  if (trend > 0) return 'positive'
  if (trend < 0) return 'negative'
  return 'neutral'
}

function renderEvolutionChart() {
  if (!evolutionChart.value) return
  
  const ctx = evolutionChart.value.getContext('2d')
  
  if (window.evolutionChartInstance) {
    window.evolutionChartInstance.destroy()
  }
  
  const data = transactionStore.getEvolutionData(timeRange.value)
  
  window.evolutionChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Receitas',
          data: data.income,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'Despesas',
          data: data.expense,
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'Saldo',
          data: data.balance,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (value) => `R$ ${formatCurrency(value)}`
          },
          grid: {
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: R$ ${formatCurrency(context.parsed.y)}`
            }
          }
        }
      }
    }
  })
}

function renderCategoryPieChart() {
  if (!categoryPieChart.value) return
  
  const ctx = categoryPieChart.value.getContext('2d')
  
  if (window.categoryPieChartInstance) {
    window.categoryPieChartInstance.destroy()
  }
  
  const type = pieChartType.value
  const categoryData = transactionStore.getCategoryDistribution(type, timeRange.value)
  
  const colors = generateColors(categoryData.length)
  
  window.categoryPieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categoryData.map(c => c.category),
      datasets: [{
        data: categoryData.map(c => c.total),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 11
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const total = categoryData.reduce((sum, c) => sum + c.total, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return `${context.label}: R$ ${formatCurrency(context.parsed)} (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

function renderMonthlyComparisonChart() {
  if (!monthlyComparisonChart.value) return
  
  const ctx = monthlyComparisonChart.value.getContext('2d')
  
  if (window.monthlyComparisonChartInstance) {
    window.monthlyComparisonChartInstance.destroy()
  }
  
  const data = transactionStore.getYearComparison(comparisonYear.value)
  
  window.monthlyComparisonChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      datasets: [
        {
          label: 'Receitas',
          data: data.income,
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: '#4CAF50',
          borderWidth: 1
        },
        {
          label: 'Despesas',
          data: data.expense,
          backgroundColor: 'rgba(244, 67, 54, 0.7)',
          borderColor: '#F44336',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `R$ ${formatCurrency(value)}`
          },
          grid: {
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  })
}

function renderGoalsChart() {
  if (!goalsChart.value) return
  
  const ctx = goalsChart.value.getContext('2d')
  
  if (window.goalsChartInstance) {
    window.goalsChartInstance.destroy()
  }
  
  const goals = goalStore.activeGoals.slice(0, 5)
  const progressData = goals.map(g => (g.current / g.target) * 100)
  
  window.goalsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: goals.map(g => g.title.substring(0, 15) + (g.title.length > 15 ? '...' : '')),
      datasets: [{
        data: progressData,
        backgroundColor: progressData.map(p => {
          if (p >= 80) return '#4CAF50'
          if (p >= 50) return '#FF9800'
          return '#F44336'
        }),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`
          },
          grid: {
            drawBorder: false
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const goal = goals[context.dataIndex]
              return [
                `Progresso: ${Math.round(context.parsed.x)}%`,
                `Atual: R$ ${formatCurrency(goal.current)}`,
                `Meta: R$ ${formatCurrency(goal.target)}`
              ]
            }
          }
        }
      }
    }
  })
}

function renderTrendChart() {
  if (!trendChart.value) return
  
  const ctx = trendChart.value.getContext('2d')
  
  if (window.trendChartInstance) {
    window.trendChartInstance.destroy()
  }
  
  const data = transactionStore.getTrendData(timeRange.value, trendType.value)
  
  window.trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: trendType.value === 'income' ? 'Receitas' : 
               trendType.value === 'expense' ? 'Despesas' : 'Saldo',
        data: data.values,
        borderColor: trendType.value === 'income' ? '#4CAF50' : 
                    trendType.value === 'expense' ? '#F44336' : '#2196F3',
        backgroundColor: trendType.value === 'income' ? 'rgba(76, 175, 80, 0.1)' : 
                        trendType.value === 'expense' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (value) => `R$ ${formatCurrency(value)}`
          },
          grid: {
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}

function generateColors(count) {
  const baseColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
    '#8AC926', '#1982C4', '#6A4C93', '#F15BB5'
  ]
  
  const colors = []
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length])
  }
  return colors
}

function applyFilters() {
  // Atualizar dados com base nos filtros
  transactionStore.setFilters({
    categories: selectedCategory.value,
    types: selectedType.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value
  })
  
  $q.notify({
    type: 'positive',
    message: 'Filtros aplicados com sucesso'
  })
}

function clearFilters() {
  selectedCategory.value = []
  selectedType.value = []
  dateFrom.value = ''
  dateTo.value = ''
  
  transactionStore.clearFilters()
  
  $q.notify({
    type: 'info',
    message: 'Filtros limpos'
  })
}

function refreshGoalsChart() {
  goalStore.fetchGoals().then(() => {
    renderGoalsChart()
    $q.notify({
      type: 'positive',
      message: 'Dados de metas atualizados'
    })
  })
}

function exportCharts() {
  const charts = [
    { name: 'Evolução Financeira', ref: evolutionChart.value },
    { name: 'Distribuição por Categoria', ref: categoryPieChart.value },
    { name: 'Comparação Mensal', ref: monthlyComparisonChart.value },
    { name: 'Progresso das Metas', ref: goalsChart.value },
    { name: 'Tendência Anual', ref: trendChart.value }
  ]
  
  // Aqui você pode implementar a exportação dos gráficos
  // Isso geralmente requer uma biblioteca adicional como html2canvas
  $q.notify({
    type: 'info',
    message: 'Funcionalidade de exportação de gráficos em desenvolvimento'
  })
}

function exportData() {
  const data = chartData.value.map(item => ({
    Data: new Date(item.date).toLocaleDateString('pt-BR'),
    Categoria: item.category,
    Descrição: item.description,
    Valor: item.amount,
    Tipo: item.type === 'income' ? 'Receita' : 'Despesa',
    'Tendência (%)': item.trend || 0
  }))
  
  exportToExcel(data, 'dados-financeiros')
  
  $q.notify({
    type: 'positive',
    message: 'Dados exportados com sucesso'
  })
}
</script>

<style scoped>
.financial-charts {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filters-section {
  margin-bottom: 30px;
}

.filters-card {
  background: #f8f9fa;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #2c3e50;
}

.date-range {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container {
  grid-column: span 1;
}

.chart-container.full-width {
  grid-column: 1 / -1;
}

.chart-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-legend {
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.income {
  background-color: #4CAF50;
}

.legend-color.expense {
  background-color: #F44336;
}

.legend-color.balance {
  background-color: #2196F3;
}

.chart-wrapper {
  flex: 1;
  min-height: 300px;
  position: relative;
}

.chart-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.summary-item {
  text-align: center;
}

.summary-item .label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.summary-item .value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.goals-summary {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.goal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.goal-progress {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
}

.trend-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
}

.stat-value.positive {
  color: #4CAF50;
}

.stat-value.negative {
  color: #F44336;
}

.stat-value.neutral {
  color: #666;
}

.insights-section {
  margin-bottom: 30px;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fa;
}

.insight-item.positive {
  border-left: 4px solid #4CAF50;
}

.insight-item.warning {
  border-left: 4px solid #FF9800;
}

.insight-item.info {
  border-left: 4px solid #2196F3;
}

.insight-item.negative {
  border-left: 4px solid #F44336;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-weight: 600;
  margin-bottom: 5px;
  color: #2c3e50;
}

.insight-text {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.data-table-section {
  margin-bottom: 30px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  font-size: 0.9rem;
}

.trend-indicator.positive {
  color: #4CAF50;
}

.trend-indicator.negative {
  color: #F44336;
}

.trend-indicator.neutral {
  color: #666;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-container.full-width {
    grid-column: 1;
  }
  
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .date-range {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>