import { ref, computed } from 'vue'
import { useGoalStore } from '../stores/goal'
import { localStorageService } from '../services/localStorageService'

const GOALS_STORAGE_KEY = 'goals'

export const useGoals = () => {
  const goalStore = useGoalStore()
  
  const loading = ref(false)
  const error = ref(null)

  const fetchGoals = async () => {
    loading.value = true
    error.value = null
    
    try {
      const goals = localStorageService.getData(GOALS_STORAGE_KEY) || []
      goalStore.setGoals(goals)
    } catch (err) {
      error.value = 'Failed to fetch goals'
    } finally {
      loading.value = false
    }
  }

  const addGoal = async (goal) => {
    loading.value = true
    try {
      const newGoal = {
        ...goal,
        id: Date.now(),
        currentAmount: 0
      }
      const goals = localStorageService.getData(GOALS_STORAGE_KEY) || []
      const updatedGoals = [...goals, newGoal]
      localStorageService.saveData(GOALS_STORAGE_KEY, updatedGoals)
      goalStore.addGoal(newGoal)
    } catch (err) {
      error.value = 'Failed to add goal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGoal = async (id, updates) => {
    loading.value = true
    try {
      let goals = localStorageService.getData(GOALS_STORAGE_KEY) || []
      const index = goals.findIndex(g => g.id === id)
      if (index !== -1) {
        goals[index] = { ...goals[index], ...updates }
        localStorageService.saveData(GOALS_STORAGE_KEY, goals)
        goalStore.updateGoal(id, updates)
      }
    } catch (err) {
      error.value = 'Failed to update goal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGoal = async (id) => {
    loading.value = true
    try {
      let goals = localStorageService.getData(GOALS_STORAGE_KEY) || []
      const updatedGoals = goals.filter(g => g.id !== id)
      localStorageService.saveData(GOALS_STORAGE_KEY, updatedGoals)
      goalStore.deleteGoal(id)
    } catch (err) {
      error.value = 'Failed to delete goal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addContribution = async (goalId, amount) => {
    loading.value = true
    try {
      let goals = localStorageService.getData(GOALS_STORAGE_KEY) || []
      const index = goals.findIndex(g => g.id === goalId)
      if (index !== -1) {
        goals[index].currentAmount += amount
        if (goals[index].currentAmount > goals[index].targetAmount) {
          goals[index].currentAmount = goals[index].targetAmount
        }
        localStorageService.saveData(GOALS_STORAGE_KEY, goals)
        goalStore.addContribution(goalId, amount)
      }
    } catch (err) {
      error.value = 'Failed to add contribution'
      throw err
    } finally {
      loading.value = false
    }
  }

  const totalTargetAmount = computed(() => {
    return goalStore.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  })

  const totalCurrentAmount = computed(() => {
    return goalStore.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  })

  const totalProgress = computed(() => {
    return totalTargetAmount.value > 0 ? totalCurrentAmount.value / totalTargetAmount.value : 0
  })

  const activeGoals = computed(() => {
    return goalStore.goals.filter(goal => {
      const deadline = new Date(goal.deadline)
      return goal.currentAmount < goal.targetAmount && deadline > new Date()
    })
  })

  const completedGoals = computed(() => {
    return goalStore.goals.filter(goal => goal.currentAmount >= goal.targetAmount)
  })

  return {
    goals: computed(() => goalStore.goals),
    activeGoals,
    completedGoals,
    loading,
    error,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    totalTargetAmount,
    totalCurrentAmount,
    totalProgress
  }
}