import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/apiService';

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const loading = ref(false);
  const error = ref(null);

  async function fetchSummary(year, month) {
    loading.value = true;
    error.value = null;
    try {
      const summary = await api.get('/transactions/summary', { params: { year, month } });
      stats.value = {
        income: summary.totalIncome || 0,
        expenses: summary.totalExpense || 0,
        balance: summary.balance || 0,
      };
    } catch (e) {
      error.value = 'Failed to load dashboard summary.';
      console.error('Error fetching dashboard summary:', e);
    } finally {
      loading.value = false;
    }
  }

  return {
    stats,
    loading,
    error,
    fetchSummary,
  };
});
