import { ref, computed } from 'vue'
import { useTransactionStore } from '../stores/transaction'
import apiService from '../services/apiService'

export const useTransactions = () => {
  const transactionStore = useTransactionStore()

  const loading = ref(false)
  const error = ref(null)

  const fetchTransactions = async (filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.get('/transactions', { params: filters })
      
      let transactionsData = []
      // Validação de segurança: Garante que é um array antes de salvar
      if (Array.isArray(response.data)) {
        transactionsData = response.data
      } else if (response.data && Array.isArray(response.data.transactions)) {
        // Backend retorna { transactions: [...], totalPages, currentPage, total }
        transactionsData = response.data.transactions
      } else if (response.data && Array.isArray(response.data.data)) {
        // Suporte para respostas envelopadas { success: true, data: [...] }
        transactionsData = response.data.data
      }

      // Normalizar IDs para garantir consistência em toda a aplicação
      const normalizedTransactions = transactionsData.map(t => ({
        ...t,
        id: t._id || t.id, // Garante que .id sempre exista
        _id: t._id || t.id // Garante que ._id sempre exista
      }))

      transactionStore.setTransactions(normalizedTransactions)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch transactions'
      console.error('Erro ao buscar transações:', err)
      // Em caso de erro, garante que a store não fique com dados inválidos
      transactionStore.setTransactions([])
    } finally {
      loading.value = false
    }
  }

  const addTransaction = async (transaction) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.post('/transactions', transaction)
      transactionStore.addTransaction(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id, updates) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.put(`/transactions/${id}`, updates)
      transactionStore.updateTransaction(id, response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id) => {
    if (!id || id === 'undefined') {
      const errorMsg = 'Invalid transaction ID'
      console.error(errorMsg, id)
      throw new Error(errorMsg)
    }

    loading.value = true
    error.value = null

    try {
      await apiService.delete(`/transactions/${id}`)
      transactionStore.deleteTransaction(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransactionStats = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.get('/transactions/stats/summary')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch transaction stats'
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
    deleteTransaction,
    getTransactionStats
  }
}
