export const calculateMonthlyBudget = (income, expenses) => {
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  
  return {
    totalIncome,
    totalExpenses,
    netIncome: totalIncome - totalExpenses,
    savingsRate: totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0
  }
}

export const calculateCashFlow = (transactions) => {
  const dailyFlow = {}
  
  transactions.forEach(transaction => {
    const date = transaction.date.split('T')[0]
    if (!dailyFlow[date]) {
      dailyFlow[date] = { income: 0, expense: 0 }
    }
    
    if (transaction.amount > 0) {
      dailyFlow[date].income += transaction.amount
    } else {
      dailyFlow[date].expense += Math.abs(transaction.amount)
    }
  })
  
  // Converter para array e ordenar por data
  return Object.entries(dailyFlow)
    .map(([date, flow]) => ({
      date,
      ...flow,
      net: flow.income - flow.expense
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

export const calculateCategorySpending = (transactions, categories) => {
  const spending = {}
  
  categories.forEach(category => {
    spending[category.id] = {
      category: category.name,
      color: category.color,
      budget: category.budget || 0,
      spent: 0
    }
  })
  
  transactions.forEach(transaction => {
    if (transaction.amount < 0) { // Apenas despesas
      const category = categories.find(c => c.id === transaction.categoryId)
      if (category && spending[category.id]) {
        spending[category.id].spent += Math.abs(transaction.amount)
      }
    }
  })
  
  // Calcular porcentagem do orçamento utilizado
  Object.values(spending).forEach(item => {
    item.percentage = item.budget > 0 ? item.spent / item.budget : 0
    item.remaining = item.budget - item.spent
  })
  
  return Object.values(spending)
}

export const calculateSavingsGoalsProgress = (goals) => {
  return goals.map(goal => ({
    ...goal,
    progress: goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0,
    remaining: goal.targetAmount - goal.currentAmount,
    dailyRequired: calculateDailyRequired(goal)
  }))
}

const calculateDailyRequired = (goal) => {
  const deadline = new Date(goal.deadline)
  const today = new Date()
  const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
  
  if (daysRemaining <= 0) return 0
  
  return Math.max(0, (goal.targetAmount - goal.currentAmount) / daysRemaining)
}

export const calculateDebtToIncomeRatio = (monthlyDebt, monthlyIncome) => {
  if (monthlyIncome <= 0) return 0
  return monthlyDebt / monthlyIncome
}

export const calculateNetWorth = (assets, liabilities) => {
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0)
  
  return totalAssets - totalLiabilities
}

export const calculateInvestmentReturns = (principal, rate, time, compoundFrequency = 12) => {
  // Fórmula de juros compostos: A = P(1 + r/n)^(nt)
  const n = compoundFrequency
  const r = rate / 100
  const amount = principal * Math.pow(1 + r / n, n * time)
  
  return {
    finalAmount: amount,
    interestEarned: amount - principal,
    totalReturn: (amount - principal) / principal
  }
}