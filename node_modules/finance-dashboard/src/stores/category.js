import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])

  const setCategories = (newCategories) => {
    categories.value = newCategories
  }

  const addCategory = (category) => {
    categories.value.push(category)
  }

  const deleteCategory = (id) => {
    categories.value = categories.value.filter(c => c.id !== id)
  }

  const updateCategory = (id, updates) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
    }
  }

  const getCategoryById = (id) => {
    return categories.value.find(c => c.id === id)
  }

  const getCategoriesByType = (type) => {
    return categories.value.filter(c => c.type === type)
  }

  return {
    categories,
    setCategories,
    addCategory,
    deleteCategory,
    updateCategory,
    getCategoryById,
    getCategoriesByType
  }
})