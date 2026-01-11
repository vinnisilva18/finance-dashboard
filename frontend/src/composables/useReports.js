import { ref, computed } from 'vue'
import { localStorageService } from '../services/localStorageService'

export const useReports = () => {
  const loading = ref(false)
  const error = ref(null)

  const initialReportData = {
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0,
    incomeChange: 0,
    expenseChange: 0,
    savingsChange: 0,
    budgetStatus: 'under',
    incomeSources: [],
    expenseCategories: [],
    budgetComparison: [],
    topTransactions: [],
    goals: [],
    goalsProgress: {
      completed: 0,
      total: 0,
      percentage: 0
    }
  }

  const reportData = ref({ ...initialReportData })

  const generateReport = (period) => {
    loading.value = true
    error.value = null
    try {
      const transactions = localStorageService.getData('transactions') || []
      const categories = localStorageService.getData('categories') || []
      const goals = localStorageService.getData('goals') || []

      // Filter transactions based on the period (to be implemented)
      const periodTransactions = transactions;

      const totalIncome = periodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const totalExpenses = periodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      const netSavings = totalIncome + totalExpenses // Expenses are negative
      const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) : 0

      // Expense categories
      const expenseCategories = categories
        .filter(c => c.type === 'expense')
        .map(category => {
          const categoryExpenses = periodTransactions
            .filter(t => t.type === 'expense' && t.category === category.name)
            .reduce((sum, t) => sum + t.amount, 0)

          return {
            name: category.name,
            amount: Math.abs(categoryExpenses),
            percentage: totalExpenses !== 0 ? ((Math.abs(categoryExpenses) / Math.abs(totalExpenses)) * 100).toFixed(1) : 0,
            color: category.color
          }
        })
        .filter(c => c.amount > 0)
        .sort((a, b) => b.amount - a.amount);

      // Top transactions
      const topTransactions = [...periodTransactions]
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        .slice(0, 5)
        .map(t => {
            const category = categories.find(c => c.name === t.category);
            return {
                ...t,
                categoryColor: category ? category.color : '#808080'
            }
        });

      // Goals progress
      const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length
      const goalsProgress = {
        completed: completedGoals,
        total: goals.length,
        percentage: goals.length > 0 ? (completedGoals / goals.length) * 100 : 0
      }
      const goalsData = goals.map(g => ({
          id: g.id,
          name: g.name,
          current: g.currentAmount,
          target: g.targetAmount,
          progress: g.targetAmount > 0 ? ((g.currentAmount / g.targetAmount) * 100).toFixed(0) : 0,
          deadline: g.deadline,
          color: g.color
      }));


      reportData.value = {
        totalIncome,
        totalExpenses: Math.abs(totalExpenses),
        netSavings,
        savingsRate,
        incomeChange: 0, // Placeholder
        expenseChange: 0, // Placeholder
        savingsChange: 0, // Placeholder
        budgetStatus: 'under', // Placeholder
        incomeSources: [], // Placeholder for now
        expenseCategories,
        budgetComparison: [], // Placeholder for now
        topTransactions,
        goals: goalsData,
        goalsProgress
      }

    } catch (err) {
      error.value = 'Failed to generate report'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    reportData,
    generateReport
  }
}
