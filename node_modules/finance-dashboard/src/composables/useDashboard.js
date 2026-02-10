import { ref, computed, onMounted } from 'vue'
import apiService from '../services/apiService'
import { useCategories } from './useCategories'
import { useGoals } from './useGoals'
import { useCards } from './useCards'

export const useDashboard = () => {
  const loading = ref(false)
  const error = ref(null)

  const selectedMonth = ref(new Date().getMonth() + 1)
  const selectedYear = ref(new Date().getFullYear())

  const currentMonthName = computed(() => {
    const date = new Date(selectedYear.value, selectedMonth.value - 1, 1)
    return date.toLocaleDateString('pt-BR', { month: 'long' })
  })

  const currentYear = computed(() => selectedYear.value)

  // Composables para buscar dados da API
  const { categories: allCategories, fetchCategories } = useCategories()
  const { goals: allGoals, fetchGoals } = useGoals()
  const { cards: allCards, fetchCards } = useCards()

  const totalBalance = ref(0)
  const stats = ref({
    income: 0,
    expenses: 0,
    savings: 0,
    investments: 0,
  })
  const recentTransactions = ref([])
  const goals = ref([])
  const categories = ref([])
  const creditCards = ref([])
  const chartData = ref({
    labels: [],
    datasets: [
      {
        label: 'Receita',
        backgroundColor: '#10b981',
        data: [],
      },
      {
        label: 'Despesa',
        backgroundColor: '#ef4444',
        data: [],
      },
    ],
  })

  const getMonthRange = (year, month) => {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)
    return { startDate, endDate }
  }

  const normalizeTransactions = (response) => {
    let transactionsData = []

    if (Array.isArray(response.data)) {
      transactionsData = response.data
    } else if (response.data && Array.isArray(response.data.transactions)) {
      transactionsData = response.data.transactions
    } else if (response.data && Array.isArray(response.data.data)) {
      transactionsData = response.data.data
    }

    return transactionsData.map(t => ({
      ...t,
      id: t._id || t.id,
      _id: t._id || t.id
    }))
  }

  const fetchTransactionsRange = async (startDate, endDate) => {
    const response = await apiService.get('/transactions', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit: 1000
    })

    return normalizeTransactions(response)
  }

  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { startDate, endDate } = getMonthRange(selectedYear.value, selectedMonth.value)
      const chartStartDate = new Date(selectedYear.value, selectedMonth.value - 1 - 11, 1)
      const chartEndDate = endDate

      const [
        monthlyStatsResponse,
        monthTransactions,
        chartTransactions
      ] = await Promise.all([
        apiService.get('/transactions/stats/monthly', {
          month: selectedMonth.value,
          year: selectedYear.value
        }),
        fetchTransactionsRange(startDate, endDate),
        fetchTransactionsRange(chartStartDate, chartEndDate),
        fetchCategories(),
        fetchGoals(),
        fetchCards()
      ])

      const monthlyStats = monthlyStatsResponse?.data || {}

      stats.value = {
        income: monthlyStats.totalIncome || 0,
        expenses: monthlyStats.totalExpenses || 0,
        savings: monthlyStats.netBalance || 0,
        investments: monthlyStats.totalInvestments || 0
      }

      totalBalance.value = monthlyStats.netBalance || 0

      // Processar dados apos buscar da API
      processData(monthTransactions, chartTransactions)
    } catch (e) {
      error.value = 'Falha ao carregar dados do dashboard.'
      console.error('Erro ao buscar dados do dashboard:', e)
    } finally {
      loading.value = false
    }
  }

  const processData = (transactionsList, chartTransactionsList) => {
    const categoriesList = allCategories.value || []
    const goalsList = allGoals.value || []
    const cardsList = allCards.value || []

    // Recent Transactions
    recentTransactions.value = [...transactionsList]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(t => {
        // Buscar categoria - pode ser objeto ou string
        let category = null
        if (typeof t.category === 'object' && t.category !== null) {
          category = t.category
        } else {
          category = categoriesList.find(c => c._id === t.category || c.id === t.category || c.name === t.category)
        }
        
        return {
          ...t,
          id: t._id || t.id,
          icon: category?.icon || '💸',
          categoryColor: category?.color || '#808080',
          category: category?.name || t.category || 'Sem categoria'
        }
      })

    // Goals
    goals.value = goalsList.slice(0, 3).map(g => ({
      ...g,
      id: g._id || g.id,
      name: g.title || g.name,
      percentage: g.targetAmount > 0 ? ((g.currentAmount / g.targetAmount) * 100).toFixed(0) : 0,
      current: g.currentAmount || 0,
      target: g.targetAmount || 0,
      icon: g.icon || '🎯',
      color: g.color || '#6366f1'
    }))

    // Spending by Category (apenas despesas)
    const totalExpenses = stats.value.expenses || 0
    const expenseByCategory = categoriesList
      .filter(c => c.type === 'expense')
      .map(category => {
        const categoryExpenses = transactionsList
          .filter(t => {
            const tCategory = typeof t.category === 'object' ? t.category?._id || t.category?.id : t.category
            const catId = category._id || category.id
            return t.type === 'expense' && (tCategory === catId || t.category === category.name)
          })
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        
        return {
          id: category._id || category.id,
          name: category.name,
          amount: categoryExpenses,
          color: category.color,
          percentage: totalExpenses > 0 ? ((categoryExpenses / totalExpenses) * 100).toFixed(0) : 0
        }
      })
      .filter(c => c.amount > 0)
      .sort((a, b) => b.amount - a.amount)
    
    categories.value = expenseByCategory

    // Credit Cards
    creditCards.value = cardsList.slice(0, 3).map(c => ({
      ...c,
      id: c._id || c.id,
      dueDate: c.dueDate ? new Date(c.dueDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) : 'N/A',
      color: c.color ? `linear-gradient(135deg, ${c.color}, ${adjustColor(c.color, -40)})` : 'linear-gradient(135deg, #6366f1, #4f46e5)'
    }))

    // Chart Data (ultimos 12 meses)
    const labels = []
    const incomeData = []
    const expenseData = []
    const chartNow = new Date(selectedYear.value, selectedMonth.value - 1, 1)
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(chartNow.getFullYear(), chartNow.getMonth() - i, 1)
      labels.push(d.toLocaleDateString('pt-BR', { month: 'short' }))
      
      const monthStart = new Date(chartNow.getFullYear(), chartNow.getMonth() - i, 1)
      const monthEnd = new Date(chartNow.getFullYear(), chartNow.getMonth() - i + 1, 0)

      const periodIncomes = (chartTransactionsList || [])
        .filter(t => t.type === 'income' && new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      const periodExpenses = (chartTransactionsList || [])
        .filter(t => t.type === 'expense' && new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      incomeData.push(periodIncomes)
      expenseData.push(periodExpenses)
    }
    
    chartData.value.labels = labels
    chartData.value.datasets[0].data = incomeData
    chartData.value.datasets[1].data = expenseData
  }
  
  onMounted(fetchData)

  const goToPreviousMonth = () => {
    if (selectedMonth.value === 1) {
      selectedMonth.value = 12
      selectedYear.value -= 1
    } else {
      selectedMonth.value -= 1
    }
    fetchData()
  }

  const goToNextMonth = () => {
    if (selectedMonth.value === 12) {
      selectedMonth.value = 1
      selectedYear.value += 1
    } else {
      selectedMonth.value += 1
    }
    fetchData()
  }

  return {
    loading,
    error,
    totalBalance,
    stats,
    recentTransactions,
    goals,
    categories,
    creditCards,
    chartData,
    fetchData,
    goToPreviousMonth,
    goToNextMonth,
    currentMonthName,
    currentYear
  }
}

function adjustColor(color, amount) {
  if (!color) return '#000000'
  return '#' + color.replace(/^#/, '').replace(/../g, c => ('0'+Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).substr(-2))
}
