<template>
  <div class="goals">
    <div class="header">
      <h1>Metas Financeiras</h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? 'Cancelar' : '+ Nova Meta' }}
      </button>
    </div>

    <div class="goals-summary">
      <div class="summary-card">
        <h3>Meta Total</h3>
        <p class="amount">{{ formatCurrency(totalTargetAmount) }}</p>
      </div>
      <div class="summary-card">
        <h3>Total Guardado</h3>
        <p class="amount">{{ formatCurrency(totalCurrentAmount) }}</p>
      </div>
      <div class="summary-card">
        <h3>Progresso Geral</h3>
        <div class="progress-display">
          <p class="amount">{{ Math.round(totalProgress * 100) }}%</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${totalProgress * 100}%` }"></div>
          </div>
        </div>
      </div>
      <div class="summary-card">
        <h3>Metas Ativas</h3>
        <p class="amount">{{ activeGoals.length }}</p>
      </div>
    </div>

    <div v-if="showForm" class="goal-form card">
      <h3>{{ editingGoal ? 'Editar Meta' : 'Criar Nova Meta' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label>Nome da Meta</label>
            <input v-model="formData.name" type="text" required class="form-control" placeholder="Ex.: Reserva de Emergência">
          </div>

          <div class="form-group">
            <label>Categoria</label>
            <select v-model="formData.category" class="form-control" required>
              <option value="savings">Poupança</option>
              <option value="vehicle">Veículo</option>
              <option value="travel">Viagem</option>
              <option value="home">Casa</option>
              <option value="education">Educação</option>
              <option value="investment">Investimento</option>
              <option value="other">Outro</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Valor da Meta</label>
            <input v-model="formData.targetAmount" type="number" step="0.01" required class="form-control" placeholder="10000">
          </div>

          <div class="form-group">
            <label>Valor Atual</label>
            <input v-model="formData.currentAmount" type="number" step="0.01" required class="form-control" placeholder="0">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Prazo</label>
            <input v-model="formData.deadline" type="date" required class="form-control">
          </div>

          <div class="form-group">
            <label>Prioridade</label>
            <select v-model="formData.priority" class="form-control" required>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Moeda</label>
            <select v-model="formData.currency" class="form-control" required>
              <option v-for="currency in currencies" :key="currency._id" :value="currency._id">
                {{ currency.name }} ({{ currency.symbol }})
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Cor da Meta</label>
          <div class="color-picker">
            <input v-model="formData.color" type="color" class="color-input">
            <span class="color-preview" :style="{ backgroundColor: formData.color }"></span>
            <span>{{ formData.color }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>Descrição (Opcional)</label>
          <textarea v-model="formData.description" class="form-control" rows="3" placeholder="Adicione observações sobre sua meta..."></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Salvando...' : (editingGoal ? 'Atualizar Meta' : 'Criar Meta') }}
          </button>
          <button v-if="editingGoal" @click="cancelEdit" type="button" class="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div v-if="loading && !showForm" class="loading">Carregando metas...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="tabs">
      <button @click="activeTab = 'active'" :class="['tab-btn', { active: activeTab === 'active' }]">
        Metas Ativas ({{ activeGoals.length }})
      </button>
      <button @click="activeTab = 'completed'" :class="['tab-btn', { active: activeTab === 'completed' }]">
        Metas Concluídas ({{ completedGoals.length }})
      </button>
    </div>

    <div v-if="activeTab === 'active'" class="goals-grid">
      <div v-for="goal in activeGoals" :key="goal._id" class="goal-item card">
        <div class="goal-header">
          <div class="goal-color" :style="{ backgroundColor: goal.color }"></div>
          <div class="goal-info">
            <h3>{{ goal.title || goal.name }}</h3>
            <span class="goal-category">{{ getCategoryLabel(goal.category) }}</span>
            <span class="goal-priority" :class="goal.priority">
              {{ goal.priority }}
            </span>
          </div>
          <div class="goal-actions">
            <button @click="editGoal(goal)" class="btn-icon" title="Editar">
              &#x270F;&#xFE0F;
            </button>
            <button @click="deleteGoal(goal._id)" class="btn-icon" title="Excluir">
              &#x1F5D1;&#xFE0F;
            </button>
          </div>
        </div>

        <div class="goal-progress">
          <div class="progress-info">
            <span class="progress-text">
              {{ formatCurrency(goal.currentAmount) }} de {{ formatCurrency(goal.targetAmount) }}
            </span>
            <span class="progress-percentage">{{ Math.round((goal.currentAmount / goal.targetAmount) * 100) }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{
              width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
              backgroundColor: goal.color
            }"></div>
          </div>
        </div>

        <div class="goal-details">
          <div class="detail-row">
            <span class="label">Prazo:</span>
            <span class="value">{{ formatDate(goal.deadline) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Dias Restantes:</span>
            <span class="value">{{ getDaysRemaining(goal) }} dias</span>
          </div>
          <div class="detail-row">
            <span class="label">Faltam:</span>
            <span class="value">{{ formatCurrency(getAmountNeeded(goal)) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Necessário por Dia:</span>
            <span class="value">{{ formatCurrency(getDailyAmountToSave(goal)) }}/dia</span>
          </div>
          <div class="detail-row">
            <span class="label">Necessário por Mês:</span>
            <span class="value">{{ formatCurrency(getMonthlyAmountToSave(goal)) }}/mês</span>
          </div>
        </div>

        <div v-if="goal.description" class="goal-description">
          {{ goal.description }}
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'completed'" class="completed-goals">
      <div v-for="goal in completedGoals" :key="goal._id" class="completed-goal card">
        <div class="completion-badge">&#x1F389; Concluída!</div>
        <div class="goal-header">
          <div class="goal-color" :style="{ backgroundColor: goal.color }"></div>
          <div class="goal-info">
            <h3>{{ goal.title || goal.name }}</h3>
            <span class="goal-category">{{ getCategoryLabel(goal.category) }}</span>
          </div>
          <div class="goal-actions">
            <button @click="deleteGoal(goal._id)" class="btn-icon" title="Excluir">
              &#x1F5D1;&#xFE0F;
            </button>
          </div>
        </div>

        <div class="completion-info">
          <div class="info-item">
            <span class="label">Concluída em:</span>
            <span class="value">{{ formatDate(new Date().toISOString()) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Total Guardado:</span>
            <span class="value">{{ formatCurrency(goal.targetAmount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeGoals.length === 0 && !loading" class="empty-state">
      <div class="empty-icon">&#x1F3AF;</div>
      <h3>Nenhuma Meta Financeira Ainda</h3>
      <p>Comece criando sua primeira meta financeira</p>
      <button @click="showForm = true" class="btn btn-primary">
        Criar Primeira Meta
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useGoals } from '../composables/useGoals'
import { formatCurrency, formatDate } from '../utils/formatters'
import { useCurrencies } from '../composables/useCurrencies'
import { useCategories } from '../composables/useCategories'

const { currencies, fetchCurrencies } = useCurrencies()
const { categories, fetchCategories } = useCategories()

const {
  goals,
  activeGoals,
  completedGoals,
  loading,
  error,
  fetchGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  totalTargetAmount,
  totalCurrentAmount,
  totalProgress
} = useGoals()

const showForm = ref(false)
const editingGoal = ref(null)
const activeTab = ref('active')

const formData = reactive({
  name: '',
  targetAmount: 10000,
  currentAmount: 0,
  deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
  category: 'savings',
  color: '#4CAF50',
  priority: 'medium',
  currency: '507f1f77bcf86cd799439013', // BRL _id
  description: ''
})

onMounted(async () => {
  await fetchCurrencies()
  await fetchCategories()
  await fetchGoals()
})

const categoryLabelMap = {
  savings: 'Poupança',
  vehicle: 'Veículo',
  travel: 'Viagem',
  home: 'Casa',
  education: 'Educação',
  investment: 'Investimento',
  other: 'Outro'
}

const getCategoryLabel = (category) => {
  if (!category) return 'Sem categoria'

  if (typeof category === 'object') {
    return category.name || category.title || category.id || category._id || 'Sem categoria'
  }

  const mapped = categoryLabelMap[category]
  if (mapped) return mapped

  const found = (categories.value || []).find(c => c._id === category || c.id === category)
  return found?.name || category
}

const handleSubmit = async () => {
  if (editingGoal.value) {
    await updateGoal(editingGoal.value._id, formData)
    editingGoal.value = null
  } else {
    await addGoal(formData)
  }

  resetForm()
  showForm.value = false
}

const editGoal = (goal) => {
  editingGoal.value = goal
  formData.name = goal.title || goal.name || ''
  formData.targetAmount = goal.targetAmount
  formData.currentAmount = goal.currentAmount
  formData.deadline = goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''
  formData.category = goal.category
  formData.color = goal.color
  formData.priority = goal.priority
  formData.currency = goal.currency
  formData.description = goal.description || ''
  showForm.value = true
}

const cancelEdit = () => {
  editingGoal.value = null
  resetForm()
  showForm.value = false
}

const resetForm = () => {
  formData.name = ''
  formData.targetAmount = 10000
  formData.currentAmount = 0
  formData.deadline = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
  formData.category = 'savings'
  formData.color = '#4CAF50'
  formData.priority = 'medium'
  formData.currency = '507f1f77bcf86cd799439013' // BRL _id
  formData.description = ''
}

const calculateDaysRemaining = (deadline) => {
  const today = new Date()
  const due = new Date(deadline)
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

const calculateDailyRequired = (goal) => {
  const daysRemaining = calculateDaysRemaining(goal.deadline)
  if (daysRemaining <= 0) return 0

  const remainingAmount = goal.targetAmount - goal.currentAmount
  return Math.max(0, remainingAmount / daysRemaining)
}

const getAmountNeeded = (goal) => {
  if (typeof goal?.amountNeeded === 'number') return Math.max(0, goal.amountNeeded)
  return Math.max(0, (goal?.targetAmount || 0) - (goal?.currentAmount || 0))
}

const getDaysRemaining = (goal) => {
  if (typeof goal?.daysRemaining === 'number') return Math.max(0, goal.daysRemaining)
  return calculateDaysRemaining(goal?.deadline)
}

const getDailyAmountToSave = (goal) => {
  if (typeof goal?.dailyAmountToSave === 'number') return Math.max(0, goal.dailyAmountToSave)

  const amountNeeded = getAmountNeeded(goal)
  const daysRemaining = getDaysRemaining(goal)
  if (daysRemaining <= 0) return 0
  return amountNeeded / daysRemaining
}

const getMonthlyAmountToSave = (goal) => {
  if (typeof goal?.monthlyAmountToSave === 'number') return Math.max(0, goal.monthlyAmountToSave)

  const amountNeeded = getAmountNeeded(goal)
  const daysRemaining = getDaysRemaining(goal)
  if (daysRemaining <= 0) return 0

  const monthsRemaining = Math.max(1, Math.ceil(daysRemaining / 30.4375))
  return amountNeeded / monthsRemaining
}
</script>

<style scoped>
.goals {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.goals-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.summary-card h3 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 1em;
}

.summary-card .amount {
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.progress-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s;
}

.tabs {
  display: flex;
  gap: 10px;
  margin: 30px 0;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #4CAF50;
  border-bottom-color: #4CAF50;
}

.tab-btn:hover:not(.active) {
  color: #333;
}

.goals-grid, .completed-goals {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.goal-item, .completed-goal {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.goal-item:hover {
  transform: translateY(-4px);
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.goal-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.goal-info {
  flex: 1;
}

.goal-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.goal-category {
  font-size: 0.9em;
  color: #666;
  margin-right: 10px;
  text-transform: capitalize;
}

.goal-priority {
  font-size: 0.8em;
  padding: 3px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 500;
}

.goal-priority.high {
  background: #f8d7da;
  color: #721c24;
}

.goal-priority.medium {
  background: #fff3cd;
  color: #856404;
}

.goal-priority.low {
  background: #d4edda;
  color: #155724;
}

.goal-actions {
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

.goal-progress {
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-text {
  font-size: 0.9em;
  color: #666;
}

.progress-percentage {
  font-weight: bold;
  color: #4CAF50;
  font-size: 1.1em;
}

.goal-details {
  display: grid;
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-row .label {
  color: #666;
  font-size: 0.9em;
}

.detail-row .value {
  font-weight: 600;
  color: #333;
}

.goal-description {
  padding: 10px;
  background: #f0f9f0;
  border-radius: 6px;
  font-size: 0.9em;
  color: #555;
  border-left: 3px solid #4CAF50;
}

.completed-goal {
  opacity: 0.8;
  position: relative;
}

.completion-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #4CAF50;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.completion-info {
  display: grid;
  gap: 8px;
  margin-top: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item .label {
  color: #666;
  font-size: 0.9em;
}

.info-item .value {
  font-weight: 600;
  color: #333;
}

.goal-form {
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
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 400px;
  margin: 20px;
}

.modal-actions {
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
