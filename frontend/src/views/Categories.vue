<template>
  <div class="categories">
    <div class="header">
      <h1>Categorias</h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? 'Cancelar' : '+ Adicionar Categoria' }}
      </button>
    </div>

    <div v-if="showForm" class="category-form card">
      <h3>{{ editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label>Nome da Categoria</label>
            <input v-model="formData.name" type="text" required class="form-control">
          </div>
          
          <div class="form-group">
            <label>Tipo</label>
            <select v-model="formData.type" class="form-control" required>
              <option value="expense">Despesa</option>
              <option value="income">Renda</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Cor</label>
            <div class="color-picker">
              <input v-model="formData.color" type="color" class="color-input">
              <span class="color-preview" :style="{ backgroundColor: formData.color }"></span>
              <span>{{ formData.color }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label>Monthly Budget</label>
            <input v-model="formData.budget" type="number" step="0.01" class="form-control">
          </div>
        </div>

        <div class="form-group">
          <label>Icon</label>
          <select v-model="formData.icon" class="form-control">
            <option value="restaurant">Food & Dining</option>
            <option value="directions_car">Transportation</option>
            <option value="shopping_cart">Shopping</option>
            <option value="movie">Entertainment</option>
            <option value="home">Utilities</option>
            <option value="medical_services">Healthcare</option>
            <option value="attach_money">Salary</option>
            <option value="work">Freelance</option>
            <option value="school">Education</option>
            <option value="flight">Travel</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Salvando...' : (editingCategory ? 'Atualizar' : 'Adicionar Categoria') }}
          </button>
          <button v-if="editingCategory" @click="cancelEdit" type="button" class="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div v-if="loading && !showForm" class="loading">Carregando categorias...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="categories-grid">
      <div class="section">
        <h2>Categorias de Despesa</h2>
        <div class="categories-list">
          <div v-for="category in expenseCategories" :key="category.id" class="category-item card">
            <div class="category-header">
              <div class="category-color" :style="{ backgroundColor: category.color }"></div>
              <div class="category-info">
                <h4>{{ category.name }}</h4>
                <span class="category-icon">{{ category.icon }}</span>
              </div>
              <div class="category-actions">
                <button @click="editCategory(category)" class="btn-icon" title="Edit">
                  ✏️
                </button>
                <button @click="deleteCategory(category.id)" class="btn-icon" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
            
            <div class="category-details">
              <div class="budget-info">
                <span>Budget: {{ formatCurrency(category.budget) }}</span>
                <span class="category-type">{{ category.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Categorias de Renda</h2>
        <div class="categories-list">
          <div v-for="category in incomeCategories" :key="category.id" class="category-item card">
            <div class="category-header">
              <div class="category-color" :style="{ backgroundColor: category.color }"></div>
              <div class="category-info">
                <h4>{{ category.name }}</h4>
                <span class="category-icon">{{ category.icon }}</span>
              </div>
              <div class="category-actions">
                <button @click="editCategory(category)" class="btn-icon" title="Edit">
                  ✏️
                </button>
                <button @click="handleDeleteCategory(category.id)" class="btn-icon" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
            
            <div class="category-details">
              <div class="budget-info">
                <span>Budget: {{ formatCurrency(category.budget) }}</span>
                <span class="category-type">{{ category.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useCategories } from '../composables/useCategories'
import { formatCurrency } from '../utils/formatters'

const { 
  categories, 
  expenseCategories, 
  incomeCategories, 
  loading, 
  error, 
  fetchCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory
} = useCategories()


const showForm = ref(false)
const editingCategory = ref(null)

const formData = reactive({
  name: '',
  type: 'expense',
  color: '#4CAF50',
  budget: 0,
  icon: 'restaurant'
})

onMounted(() => {
  fetchCategories()
})

const handleSubmit = async () => {
  if (editingCategory.value) {
    await updateCategory(editingCategory.value.id, formData)
    editingCategory.value = null
  } else {
    await addCategory(formData)
  }
  
  resetForm()
  showForm.value = false
}

const editCategory = (category) => {
  editingCategory.value = category
  formData.name = category.name
  formData.type = category.type
  formData.color = category.color
  formData.budget = category.budget
  formData.icon = category.icon
  showForm.value = true
}

const cancelEdit = () => {
  editingCategory.value = null
  resetForm()
  showForm.value = false
}

const resetForm = () => {
  formData.name = ''
  formData.type = 'expense'
  formData.color = '#4CAF50'
  formData.budget = 0
  formData.icon = 'restaurant'
}

const handleDeleteCategory = async (id) => {
  if (confirm('Tem certeza que deseja deletar esta categoria? Isto não irá deletar as transações relacionadas.')) {
    await deleteCategory(id)
  }
}
</script>

<style scoped>
.categories {
  padding: 20px;
}

.categories h1 {
  color: #4b5563;
  margin-bottom: 1rem;
}

.categories h3 {
  color: #4b5563;
  margin-bottom: 1rem;
}

.categories h2 {
  color: #4b5563;
  margin-bottom: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.categories-grid {
  display: grid;
  gap: 30px;
  margin-top: 30px;
}

.section h2 {
  margin-bottom: 20px;
  color: #333;
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.category-item {
  padding: 20px;
  transition: transform 0.2s;
}

.category-item:hover {
  transform: translateY(-2px);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.category-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.category-info {
  flex: 1;
}

.category-info h4 {
  margin: 0;
  color: #333;
}

.category-icon {
  font-size: 0.9em;
  color: #666;
}

.category-actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-size: 1.2em;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
}

.category-details {
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.budget-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-type {
  font-size: 0.8em;
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 12px;
  text-transform: capitalize;
}

.category-form {
  margin-bottom: 30px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 15px;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #ff6b6b;
  background: #f8d7da;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
}
</style>