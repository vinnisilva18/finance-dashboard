import { ref, computed } from 'vue'
import { useCategoryStore } from '../stores/category'
import { localStorageService } from '../services/localStorageService'

const CATEGORIES_STORAGE_KEY = 'categories'

const defaultCategories = [
  { id: 1, name: 'Mercado', type: 'expense', color: '#4CAF50', icon: 'shopping_cart', budget: 0 },
  { id: 2, name: 'Transporte/Uber', type: 'expense', color: '#2196F3', icon: 'directions_car', budget: 0 },
  { id: 3, name: 'Assinaturas', type: 'expense', color: '#FF9800', icon: 'subscriptions', budget: 0 },
  { id: 4, name: 'Remédios', type: 'expense', color: '#9C27B0', icon: 'medical_services', budget: 0 },
  { id: 5, name: 'Seguro de Celular', type: 'expense', color: '#607D8B', icon: 'phonelink_lock', budget: 0 },
  { id: 6, name: 'Shopping', type: 'expense', color: '#FF5722', icon: 'shopping_bag', budget: 0 },
  { id: 7, name: 'Condominio', type: 'expense', color: '#4CAF50', icon: 'home', budget: 0 },
  { id: 8, name: 'Psicologia', type: 'expense', color: '#2196F3', icon: 'psychology', budget: 0 },
  { id: 9, name: 'Convênio', type: 'expense', color: '#FF9800', icon: 'health_and_safety', budget: 0 },
  { id: 10, name: 'Plano Funerário', type: 'expense', color: '#9C27B0', icon: 'family_restroom', budget: 0 },
  { id: 11, name: 'Enel', type: 'expense', color: '#607D8B', icon: 'lightbulb', budget: 0 },
  { id: 12, name: 'Financiamento', type: 'expense', color: '#FF5722', icon: 'account_balance', budget: 0 },
  { id: 13, name: 'Intenet', type: 'expense', color: '#4CAF50', icon: 'wifi', budget: 0 }, // "Internet" is misspelled in the request, keeping it as is.
  { id: 14, name: 'Lazer', type: 'expense', color: '#2196F3', icon: 'sports_esports', budget: 0 },
  { id: 15, name: 'Celular', type: 'expense', color: '#FF9800', icon: 'smartphone', budget: 0 },
  { id: 16, name: 'Outros', type: 'expense', color: '#9C27B0', icon: 'more_horiz', budget: 0 },
]

export const useCategories = () => {
  const categoryStore = useCategoryStore()
  
  const loading = ref(false)
  const error = ref(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    
    try {
      let categories = localStorageService.getData(CATEGORIES_STORAGE_KEY)
      if (!categories) {
        categories = defaultCategories
        localStorageService.saveData(CATEGORIES_STORAGE_KEY, categories)
      }
      categoryStore.setCategories(categories)
    } catch (err) {
      error.value = 'Failed to fetch categories'
    } finally {
      loading.value = false
    }
  }

  const addCategory = async (category) => {
    loading.value = true
    try {
      const newCategory = {
        ...category,
        id: Date.now()
      }
      const categories = localStorageService.getData(CATEGORIES_STORAGE_KEY) || []
      const updatedCategories = [...categories, newCategory]
      localStorageService.saveData(CATEGORIES_STORAGE_KEY, updatedCategories)
      categoryStore.addCategory(newCategory)
    } catch (err) {
      error.value = 'Failed to add category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, updates) => {
    loading.value = true
    try {
      let categories = localStorageService.getData(CATEGORIES_STORAGE_KEY) || []
      const index = categories.findIndex(c => c.id === id)
      if (index !== -1) {
        categories[index] = { ...categories[index], ...updates }
        localStorageService.saveData(CATEGORIES_STORAGE_KEY, categories)
        categoryStore.updateCategory(id, updates)
      }
    } catch (err) {
      error.value = 'Failed to update category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
    loading.value = true
    try {
      let categories = localStorageService.getData(CATEGORIES_STORAGE_KEY) || []
      const updatedCategories = categories.filter(c => c.id !== id)
      localStorageService.saveData(CATEGORIES_STORAGE_KEY, updatedCategories)
      categoryStore.deleteCategory(id)
    } catch (err) {
      error.value = 'Failed to delete category'
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