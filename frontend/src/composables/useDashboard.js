import { ref, computed, onMounted } from 'vue'
import { useTransactions } from './useTransactions'
import { useCategories } from './useCategories'
import { useGoals } from './useGoals'
import { useCards } from './useCards'

export const useDashboard = () => {
  const loading = ref(false)
  const error = ref(null)

  // Composables para buscar dados da API
  const { transactions, fetchTransactions } = useTransactions()
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

  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Buscar todos os dados da API em paralelo
      await Promise.all([
        fetchTransactions(),
        fetchCategories(),
        fetchGoals(),
        fetchCards()
      ])

      // Processar dados após buscar da API
      processData()
    } catch (e) {
      error.value = 'Falha ao carregar dados do dashboard.'
      console.error('Erro ao buscar dados do dashboard:', e)
    } finally {
      loading.value = false
    }
  }

  const processData = () => {
    const transactionsList = transactions.value || []
    const categoriesList = allCategories.value || []
    const goalsList = allGoals.value || []
    const cardsList = allCards.value || []

    // Calculate Total Balance
    totalBalance.value = transactionsList.reduce((acc, t) => {
      return acc + (t.type === 'income' ? t.amount : -Math.abs(t.amount))
    }, 0)

    // Calculate Total Stats
    const totalIncome = transactionsList
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const totalExpenses = transactionsList
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    stats.value = {
      income: totalIncome,
      expenses: totalExpenses,
      savings: totalIncome - totalExpenses,
      investments: 0, // Placeholder
    }

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
      percentage: g.targetAmount > 0 ? ((g.currentAmount / g.targetAmount) * 100).toFixed(0) : 0,
      current: g.currentAmount || 0,
      target: g.targetAmount || 0,
      icon: g.icon || '🎯',
      color: g.color || '#6366f1'
    }))

    // Spending by Category (apenas despesas)
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

    // Chart Data (últimos 12 meses)
    const labels = []
    const incomeData = []
    const expenseData = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      labels.push(d.toLocaleDateString('pt-BR', { month: 'short' }))
      
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const periodIncomes = transactionsList
        .filter(t => t.type === 'income' && new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      const periodExpenses = transactionsList
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
  }
}

function adjustColor(color, amount) {
  if (!color) return '#000000'
  return '#' + color.replace(/^#/, '').replace(/../g, c => ('0'+Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).substr(-2))
}
