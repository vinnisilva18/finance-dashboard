import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '@/services/apiService'

export const useGoalStore = defineStore('goal', () => {
  const goals = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchGoals = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiService.get('/goals')
      goals.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching goals:', err)
    } finally {
      loading.value = false
    }
  }

  const createGoal = async (goalData) => {
    try {
      const response = await apiService.post('/goals', goalData)
      goals.value.push(response.data)
      return response.data
    } catch (err) {
      console.error('Error creating goal:', err)
      throw err
    }
  }

  const updateGoal = async (goalData) => {
    try {
      const response = await apiService.put(`/goals/${goalData.id}`, goalData)
      const index = goals.value.findIndex(g => g._id === goalData.id)
      if (index !== -1) {
        goals.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('Error updating goal:', err)
      throw err
    }
  }

  const deleteGoal = async (id) => {
    try {
      await apiService.delete(`/goals/${id}`)
      goals.value = goals.value.filter(g => g._id !== id)
    } catch (err) {
      console.error('Error deleting goal:', err)
      throw err
    }
  }

  const addProgress = async (goalId, amount) => {
    try {
      const response = await apiService.post(`/goals/${goalId}/progress`, { amount })
      const goal = goals.value.find(g => g._id === goalId)
      if (goal) {
        goal.currentAmount = response.data.currentAmount
      }
      return response.data
    } catch (err) {
      console.error('Error adding progress:', err)
      throw err
    }
  }

  const archiveGoal = async (goalId) => {
    try {
      const response = await apiService.put(`/goals/${goalId}/archive`)
      const index = goals.value.findIndex(g => g._id === goalId)
      if (index !== -1) {
        goals.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('Error archiving goal:', err)
      throw err
    }
  }

  const reactivateGoal = async (goalId) => {
    try {
      const response = await apiService.put(`/goals/${goalId}/reactivate`)
      const index = goals.value.findIndex(g => g._id === goalId)
      if (index !== -1) {
        goals.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('Error reactivating goal:', err)
      throw err
    }
  }

  const toggleMilestone = (goalId, milestoneId) => {
    const goal = goals.value.find(g => g._id === goalId)
    if (goal && goal.milestones) {
      const milestone = goal.milestones.find(m => m.id === milestoneId)
      if (milestone) {
        milestone.completed = !milestone.completed
      }
    }
  }

  const setGoals = (newGoals) => {
    goals.value = newGoals
  }

  const addGoal = (goal) => {
    goals.value.push(goal)
  }

  const getGoalById = (id) => {
    return goals.value.find(g => g._id === id)
  }

  const getGoalsByPriority = (priority) => {
    return goals.value.filter(g => g.priority === priority)
  }

  const activeGoals = computed(() => goals.value.filter(g => !g.completed && !g.archived))
  const completedGoals = computed(() => goals.value.filter(g => g.completed))
  const overdueGoals = computed(() => goals.value.filter(g => !g.completed && new Date(g.deadline) < new Date()))
  const archivedGoals = computed(() => goals.value.filter(g => g.archived))

  return {
    goals,
    loading,
    error,
    activeGoals,
    completedGoals,
    overdueGoals,
    archivedGoals,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addProgress,
    archiveGoal,
    reactivateGoal,
    toggleMilestone,
    setGoals,
    addGoal,
    getGoalById,
    getGoalsByPriority
  }
})
