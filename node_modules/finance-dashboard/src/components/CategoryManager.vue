<template>
  <div class="category-manager">
    <q-card class="main-card">
      <q-card-section>
        <div class="header">
          <h2>Gerenciar Categorias</h2>
          <q-btn 
            color="primary" 
            icon="add" 
            label="Nova Categoria" 
            @click="showAddModal = true"
          />
        </div>

        <!-- Tabs para Receitas e Despesas -->
        <q-tabs
          v-model="activeTab"
          class="text-teal"
          align="left"
        >
          <q-tab name="expense" icon="trending_down" label="Despesas" />
          <q-tab name="income" icon="trending_up" label="Receitas" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <!-- Despesas -->
          <q-tab-panel name="expense">
            <div class="categories-grid">
              <q-card 
                v-for="category in expenseCategories" 
                :key="category.id"
                class="category-card"
                :style="{ borderLeft: `4px solid ${category.color || '#F44336'}` }"
              >
                <q-card-section>
                  <div class="category-header">
                    <div class="category-info">
                      <div class="category-icon">
                        <q-icon :name="getCategoryIcon(category.name)" size="24px" />
                      </div>
                      <div>
                        <h3>{{ category.name }}</h3>
                        <small class="text-grey">
                          {{ category.transactionCount || 0 }} transações
                        </small>
                      </div>
                    </div>
                    <div class="category-actions">
                      <q-btn 
                        icon="edit" 
                        flat 
                        round 
                        @click="editCategory(category)"
                      />
                      <q-btn 
                        icon="delete" 
                        flat 
                        round 
                        color="negative"
                        @click="confirmDelete(category.id)"
                      />
                    </div>
                  </div>

                  <div class="category-stats">
                    <div class="stat">
                      <div class="stat-label">Gasto Total</div>
                      <div class="stat-value negative">
                        R$ {{ formatCurrency(category.total || 0) }}
                      </div>
                    </div>
                    <div class="stat">
                      <div class="stat-label">Média Mensal</div>
                      <div class="stat-value">
                        R$ {{ formatCurrency(category.monthlyAverage || 0) }}
                      </div>
                    </div>
                  </div>

                  <div v-if="category.budget" class="budget-section">
                    <div class="budget-header">
                      <span>Orçamento: R$ {{ formatCurrency(category.budget) }}</span>
                      <span>{{ calculateBudgetUsage(category) }}% usado</span>
                    </div>
                    <q-linear-progress 
                      :value="category.used / category.budget" 
                      :color="getBudgetColor(category)"
                      size="10px"
                    />
                  </div>
                </q-card-section>
              </q-card>

              <div v-if="expenseCategories.length === 0" class="empty-state">
                <q-icon name="category" size="48px" color="grey-5" />
                <p>Nenhuma categoria de despesa cadastrada</p>
              </div>
            </div>
          </q-tab-panel>

          <!-- Receitas -->
          <q-tab-panel name="income">
            <div class="categories-grid">
              <q-card 
                v-for="category in incomeCategories" 
                :key="category.id"
                class="category-card"
                :style="{ borderLeft: `4px solid ${category.color || '#4CAF50'}` }"
              >
                <q-card-section>
                  <div class="category-header">
                    <div class="category-info">
                      <div class="category-icon">
                        <q-icon :name="getCategoryIcon(category.name)" size="24px" />
                      </div>
                      <div>
                        <h3>{{ category.name }}</h3>
                        <small class="text-grey">
                          {{ category.transactionCount || 0 }} transações
                        </small>
                      </div>
                    </div>
                    <div class="category-actions">
                      <q-btn 
                        icon="edit" 
                        flat 
                        round 
                        @click="editCategory(category)"
                      />
                      <q-btn 
                        icon="delete" 
                        flat 
                        round 
                        color="negative"
                        @click="confirmDelete(category.id)"
                      />
                    </div>
                  </div>

                  <div class="category-stats">
                    <div class="stat">
                      <div class="stat-label">Receita Total</div>
                      <div class="stat-value positive">
                        R$ {{ formatCurrency(category.total || 0) }}
                      </div>
                    </div>
                    <div class="stat">
                      <div class="stat-label">Média Mensal</div>
                      <div class="stat-value">
                        R$ {{ formatCurrency(category.monthlyAverage || 0) }}
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <div v-if="incomeCategories.length === 0" class="empty-state">
                <q-icon name="payments" size="48px" color="grey-5" />
                <p>Nenhuma categoria de receita cadastrada</p>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <!-- Modal Adicionar/Editar Categoria -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">
            {{ editingCategory ? 'Editar Categoria' : 'Nova Categoria' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveCategory" class="q-gutter-md">
            <q-input
              v-model="categoryForm.name"
              label="Nome da Categoria"
              :rules="[val => !!val || 'Nome é obrigatório']"
              filled
            />

            <q-select
              v-model="categoryForm.type"
              :options="typeOptions"
              label="Tipo"
              filled
            />

            <div class="color-picker">
              <label>Cor da Categoria</label>
              <div class="color-options">
                <div
                  v-for="color in colorOptions"
                  :key="color"
                  class="color-option"
                  :style="{ backgroundColor: color }"
                  :class="{ selected: categoryForm.color === color }"
                  @click="categoryForm.color = color"
                >
                  <q-icon v-if="categoryForm.color === color" name="check" color="white" />
                </div>
              </div>
            </div>

            <q-input
              v-model="categoryForm.icon"
              label="Ícone (opcional)"
              filled
              hint="Nome do ícone do Material Icons"
            />

            <q-input
              v-if="categoryForm.type === 'expense'"
              v-model="categoryForm.budget"
              label="Orçamento Mensal (opcional)"
              type="number"
              min="0"
              step="0.01"
              prefix="R$"
              filled
            />

            <div class="dialog-actions">
              <q-btn 
                label="Cancelar" 
                flat 
                v-close-popup 
                color="negative"
              />
              <q-btn 
                :label="editingCategory ? 'Atualizar' : 'Salvar'" 
                type="submit" 
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de Confirmação -->
    <q-dialog v-model="showDeleteModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar Exclusão</div>
        </q-card-section>

        <q-card-section>
          <p>Tem certeza que deseja excluir esta categoria?</p>
          <p class="text-negative">Esta ação não pode ser desfeita.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn 
            flat 
            label="Excluir" 
            color="negative" 
            @click="deleteCategory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { useTransactionStore } from '@/stores/transaction'
import { useQuasar } from 'quasar'
import { formatCurrency } from '@/utils/formatters'

const $q = useQuasar()
const categoryStore = useCategoryStore()
const transactionStore = useTransactionStore()

const activeTab = ref('expense')
const showModal = ref(false)
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const editingCategory = ref(null)
const categoryToDelete = ref(null)

const categoryForm = ref({
  name: '',
  type: 'expense',
  color: '#F44336',
  icon: '',
  budget: null
})

const typeOptions = [
  { label: 'Despesa', value: 'expense' },
  { label: 'Receita', value: 'income' }
]

const colorOptions = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
  '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
]

const categories = computed(() => categoryStore.categories)
const expenseCategories = computed(() => {
  return categories.value
    .filter(c => c.type === 'expense')
    .map(category => ({
      ...category,
      transactionCount: transactionStore.getTransactionCountByCategory(category.name),
      total: transactionStore.getTotalByCategory(category.name),
      monthlyAverage: transactionStore.getMonthlyAverageByCategory(category.name),
      used: transactionStore.getMonthlyTotalByCategory(category.name),
      budget: category.budget || 0
    }))
})

const incomeCategories = computed(() => {
  return categories.value
    .filter(c => c.type === 'income')
    .map(category => ({
      ...category,
      transactionCount: transactionStore.getTransactionCountByCategory(category.name),
      total: transactionStore.getTotalByCategory(category.name),
      monthlyAverage: transactionStore.getMonthlyAverageByCategory(category.name)
    }))
})

onMounted(async () => {
  await categoryStore.fetchCategories()
})

function getCategoryIcon(categoryName) {
  const iconMap = {
    'Alimentação': 'restaurant',
    'Moradia': 'home',
    'Transporte': 'directions_car',
    'Educação': 'school',
    'Saúde': 'local_hospital',
    'Lazer': 'sports_esports',
    'Vestuário': 'checkroom',
    'Salário': 'work',
    'Freelance': 'computer',
    'Investimentos': 'trending_up',
    'Presentes': 'card_giftcard',
    'Outros': 'category'
  }
  
  return iconMap[categoryName] || 'category'
}

function calculateBudgetUsage(category) {
  if (!category.budget || category.budget === 0) return 0
  return Math.min(100, Math.round((category.used / category.budget) * 100))
}

function getBudgetColor(category) {
  const usage = calculateBudgetUsage(category)
  if (usage >= 90) return 'negative'
  if (usage >= 70) return 'warning'
  return 'positive'
}

function editCategory(category) {
  editingCategory.value = category
  categoryForm.value = { ...category }
  showModal.value = true
}

function confirmDelete(categoryId) {
  categoryToDelete.value = categoryId
  showDeleteModal.value = true
}

async function deleteCategory() {
  try {
    await categoryStore.deleteCategory(categoryToDelete.value)
    $q.notify({
      type: 'positive',
      message: 'Categoria excluída com sucesso'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao excluir categoria'
    })
  } finally {
    showDeleteModal.value = false
    categoryToDelete.value = null
  }
}

async function saveCategory() {
  try {
    if (editingCategory.value) {
      await categoryStore.updateCategory({
        id: editingCategory.value.id,
        ...categoryForm.value
      })
      $q.notify({
        type: 'positive',
        message: 'Categoria atualizada com sucesso'
      })
    } else {
      await categoryStore.createCategory(categoryForm.value)
      $q.notify({
        type: 'positive',
        message: 'Categoria criada com sucesso'
      })
    }
    
    showModal.value = false
    resetForm()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar categoria'
    })
  }
}

function resetForm() {
  categoryForm.value = {
    name: '',
    type: 'expense',
    color: '#F44336',
    icon: '',
    budget: null
  }
  editingCategory.value = null
}
</script>

<style scoped>
.category-manager {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-actions {
  display: flex;
  gap: 5px;
}

.category-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
}

.stat-value.positive {
  color: #4CAF50;
}

.stat-value.negative {
  color: #F44336;
}

.budget-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.color-picker {
  margin: 20px 0;
}

.color-picker label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

.color-options {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: transform 0.2s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #333;
  transform: scale(1.1);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #999;
}

.empty-state p {
  margin-top: 10px;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .color-options {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>