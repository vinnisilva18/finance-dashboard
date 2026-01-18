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

      // Normalizar IDs para garantir consistência em toda a aplicação (id e _id)
      let categoriesData = []
      if (Array.isArray(response.data)) {
        categoriesData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data
      }

      // Normaliza os IDs para garantir que `id` e `_id` sempre existam.
      const normalizedCategories = categoriesData.map(cat => ({
        ...cat,
        id: cat._id || cat.id, // Garante que .id sempre exista
        _id: cat._id || cat.id // Garante que ._id sempre exista
      }))

      categoryStore.setCategories(normalizedCategories)
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
      // Normaliza o ID da nova categoria também
      const newCategory = {
        ...response.data,
        id: response.data._id || response.data.id,
        _id: response.data._id || response.data.id
      }
      categoryStore.addCategory(newCategory)
      return newCategory
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, updates) => {
    // Validação de segurança para o ID
    if (!id || id === 'undefined') {
      const errorMsg = 'ID de categoria inválido para atualização'
      console.error(errorMsg, id)
      throw new Error(errorMsg)
    }
    loading.value = true
    error.value = null
    try {
      const response = await apiService.put(`/categories/${id}`, updates)
      const updatedCategory = {
        ...response.data,
        id: response.data._id || response.data.id,
        _id: response.data._id || response.data.id
      }
      categoryStore.updateCategory(id, updatedCategory)
      return updatedCategory
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
    // Validação de segurança para o ID
    if (!id || id === 'undefined') {
      const errorMsg = 'Invalid category ID'
      console.error(errorMsg, id)
      throw new Error(errorMsg)
    }
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
