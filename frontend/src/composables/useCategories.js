import { ref, computed } from 'vue'
import { useCategoryStore } from '../stores/category'
import apiService from '../services/apiService'

export const useCategories = () => {
  const categoryStore = useCategoryStore()

  const loading = ref(false)
  const error = ref(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.get('/categories')
      
      if (Array.isArray(response.data)) {
        categoryStore.setCategories(response.data)
      } else if (response.data && Array.isArray(response.data.data)) {
        categoryStore.setCategories(response.data.data)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      console.error('Erro ao buscar categorias:', err)
    } finally {
      loading.value = false
    }
  }

  const addCategory = async (category) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.post('/categories', category)
      categoryStore.addCategory(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, updates) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.put(`/categories/${id}`, updates)
      categoryStore.updateCategory(id, response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
    loading.value = true
    error.value = null

    try {
      await apiService.delete(`/categories/${id}`)
      categoryStore.deleteCategory(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const expenseCategories = computed(() => {
    return categoryStore.categories.filter(c => c.type === 'expense')
  })

  const incomeCategories = computed(() => {
    return categoryStore.categories.filter(c => c.type === 'income')
  })

  return {
    categories: computed(() => categoryStore.categories),
    expenseCategories,
    incomeCategories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }
}
