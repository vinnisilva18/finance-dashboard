import { ref, computed, onMounted } from 'vue'
import { localStorageService } from '../services/localStorageService'

export const useDashboard = () => {
  const loading = ref(false)
  const error = ref(null)

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

  const fetchData = () => {
    loading.value = true
    error.value = null
    try {
      const transactions = localStorageService.getData('transactions') || []
      const allCategories = localStorageService.getData('categories') || []
      const allGoals = localStorageService.getData('goals') || []
      const allCards = localStorageService.getData('cards') || []

      // Calculate Total Balance
      totalBalance.value = transactions.reduce((acc, t) => acc + t.amount, 0)

      // Calculate Total Stats
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      stats.value = {
        income: totalIncome,
        expenses: Math.abs(totalExpenses),
        savings: totalIncome + totalExpenses,
        investments: 0, // Placeholder
      }

      // Recent Transactions
      recentTransactions.value = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(t => {
            const category = allCategories.find(c => c.name === t.category);
            return {
                ...t,
                icon: category ? category.icon : '💸',
                categoryColor: category ? category.color : '#808080'
            }
        })

      // Goals
      goals.value = allGoals.slice(0, 3).map(g => ({
          ...g,
          percentage: g.targetAmount > 0 ? ((g.currentAmount / g.targetAmount) * 100).toFixed(0) : 0,
          current: g.currentAmount,
          target: g.targetAmount,
          icon: '🎯'
      }))

      // Spending by Category
      const expenseByCategory = allCategories
        .filter(c => c.type === 'expense')
        .map(category => {
          const categoryExpenses = transactions
            .filter(t => t.type === 'expense' && t.category === category.name)
            .reduce((sum, t) => sum + t.amount, 0)
          
          return {
            id: category.id,
            name: category.name,
            amount: Math.abs(categoryExpenses),
            color: category.color,
            percentage: stats.value.expenses > 0 ? ((Math.abs(categoryExpenses) / stats.value.expenses) * 100).toFixed(0) : 0
          }
        })
        .filter(c => c.amount > 0)
        .sort((a, b) => b.amount - a.amount)
      
      categories.value = expenseByCategory

      // Credit Cards
      creditCards.value = allCards.slice(0, 3).map(c => ({
          ...c,
          dueDate: new Date(c.dueDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
          color: `linear-gradient(135deg, ${c.color}, ${adjustColor(c.color, -40)})`
      }))


      // Chart Data (dummy for now, based on last 12 months)
      const labels = []
      const incomeData = []
      const expenseData = []
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        labels.push(d.toLocaleDateString('pt-BR', { month: 'short' }))
        
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

        const periodIncomes = transactions
            .filter(t => t.type === 'income' && new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd)
            .reduce((sum, t) => sum + t.amount, 0)
        
        const periodExpenses = transactions
            .filter(t => t.type === 'expense' && new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd)
            .reduce((sum, t) => sum + t.amount, 0)
        
        incomeData.push(periodIncomes)
        expenseData.push(Math.abs(periodExpenses))
      }
      chartData.value.labels = labels;
      chartData.value.datasets[0].data = incomeData;
      chartData.value.datasets[1].data = expenseData;


    } catch (e) {
      error.value = 'Failed to load dashboard data.'
      console.error(e)
    } finally {
      loading.value = false
    }
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
    if (!color) return '#000000';
    return '#' + color.replace(/^#/, '').replace(/../g, c => ('0'+Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).substr(-2));
}
