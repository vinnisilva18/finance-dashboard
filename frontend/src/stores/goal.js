import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGoalStore = defineStore('goal', () => {
  const goals = ref([])

  const setGoals = (newGoals) => {
    goals.value = newGoals
  }

  const addGoal = (goal) => {
    goals.value.push(goal)
  }

  const deleteGoal = (id) => {
    goals.value = goals.value.filter(g => g.id !== id)
  }

  const updateGoal = (id, updates) => {
    const index = goals.value.findIndex(g => g.id === id)
    if (index !== -1) {
      goals.value[index] = { ...goals.value[index], ...updates }
    }
  }

  const addContribution = (goalId, amount) => {
    const goal = goals.value.find(g => g.id === goalId)
    if (goal) {
      goal.currentAmount += amount
      // Garantir que não ultrapasse o valor alvo
      if (goal.currentAmount > goal.targetAmount) {
        goal.currentAmount = goal.targetAmount
      }
    }
  }

  const getGoalById = (id) => {
    return goals.value.find(g => g.id === id)
  }

  const getGoalsByPriority = (priority) => {
    return goals.value.filter(g => g.priority === priority)
  }

  return {
    goals,
    setGoals,
    addGoal,
    deleteGoal,
    updateGoal,
    addContribution,
    getGoalById,
    getGoalsByPriority
  }
})