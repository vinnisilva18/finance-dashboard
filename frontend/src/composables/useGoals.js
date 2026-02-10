import { ref, computed } from 'vue'
import { useGoalStore } from '../stores/goal'
import { localStorageService } from '../services/localStorageService'
import apiService from '../services/apiService'

const GOALS_STORAGE_KEY = 'goals'

export const useGoals = () => {
  const goalStore = useGoalStore()

  const loading = ref(false)
  const error = ref(null)

  const fetchGoals = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.get('/goals')
      goalStore.setGoals(response.data)
    } catch (err) {
      error.value = 'Failed to fetch goals'
      // Fallback to localStorage if API fails
      const goals = localStorageService.getData(GOALS_STORAGE_KEY) || []
      goalStore.setGoals(goals)
    } finally {
      loading.value = false
    }
  }

  const addGoal = async (goal) => {
    loading.value = true
    try {
      const response = await apiService.post('/goals', goal)
      goalStore.addGoal(response.data)
      return response.data
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
      const response = await apiService.put(`/goals/${id}`, updates)

      const index = goalStore.goals.findIndex(g => g._id === id)
      if (index !== -1) {
        goalStore.goals.splice(index, 1, response.data)
      }

      return response.data
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
      // O store já faz a chamada de API e remove do estado.
      // Se fizermos 2 deletes (composable + store), o 2º retorna 404 e o UI não atualiza.
      await goalStore.deleteGoal(id)
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
      const goal = goalStore.goals.find(g => g._id === goalId)
      if (!goal) return null

      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount)
      const response = await apiService.patch(`/goals/${goalId}/progress`, { currentAmount: newAmount })

      const index = goalStore.goals.findIndex(g => g._id === goalId)
      if (index !== -1) {
        goalStore.goals.splice(index, 1, response.data)
      }

      return response.data
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
      const status = goal.status || 'active'
      const isCompleted = goal.currentAmount >= goal.targetAmount || status === 'completed'
      const isCancelled = status === 'cancelled'
      return !isCompleted && !isCancelled
    })
  })

  const completedGoals = computed(() => {
    return goalStore.goals.filter(goal => {
      const status = goal.status || 'active'
      return goal.currentAmount >= goal.targetAmount || status === 'completed'
    })
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
