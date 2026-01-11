import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])

  const setTransactions = (newTransactions) => {
    transactions.value = newTransactions
  }

  const addTransaction = (transaction) => {
    transactions.value.unshift(transaction)
  }

  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  const updateTransaction = (id, updates) => {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions.value[index] = { ...transactions.value[index], ...updates }
    }
  }

  return {
    transactions,
    setTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
  }
})