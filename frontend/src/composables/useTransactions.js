import { ref, computed } from 'vue'
import { useTransactionStore } from '../stores/transaction'
import { localStorageService } from '../services/localStorageService'

const TRANSACTIONS_STORAGE_KEY = 'transactions'

export const useTransactions = () => {
  const transactionStore = useTransactionStore()
  
  const loading = ref(false)
  const error = ref(null)

  const fetchTransactions = async (filters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const transactions = localStorageService.getData(TRANSACTIONS_STORAGE_KEY) || []
      transactionStore.setTransactions(transactions)
    } catch (err) {
      error.value = 'Failed to fetch transactions'
    } finally {
      loading.value = false
    }
  }

  const addTransaction = async (transaction) => {
    loading.value = true
    try {
      const newTransaction = {
        ...transaction,
        id: Date.now()
      }
      const transactions = localStorageService.getData(TRANSACTIONS_STORAGE_KEY) || []
      const updatedTransactions = [...transactions, newTransaction]
      localStorageService.saveData(TRANSACTIONS_STORAGE_KEY, updatedTransactions)
      transactionStore.addTransaction(newTransaction)
    } catch (err) {
      error.value = 'Failed to add transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id, updates) => {
    loading.value = true
    try {
      let transactions = localStorageService.getData(TRANSACTIONS_STORAGE_KEY) || []
      const index = transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updates }
        localStorageService.saveData(TRANSACTIONS_STORAGE_KEY, transactions)
        transactionStore.updateTransaction(id, updates)
      }
    } catch (err) {
      error.value = 'Failed to update transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id) => {
    loading.value = true
    try {
      let transactions = localStorageService.getData(TRANSACTIONS_STORAGE_KEY) || []
      const updatedTransactions = transactions.filter(t => t.id !== id)
      localStorageService.saveData(TRANSACTIONS_STORAGE_KEY, updatedTransactions)
      transactionStore.deleteTransaction(id)
    } catch (err) {
      error.value = 'Failed to delete transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    transactions: computed(() => transactionStore.transactions),
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  }
}