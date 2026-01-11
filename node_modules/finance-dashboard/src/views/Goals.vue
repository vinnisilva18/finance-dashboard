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
        <h3>Total Target</h3>
        <p class="amount">{{ formatCurrency(totalTargetAmount) }}</p>
      </div>
      <div class="summary-card">
        <h3>Total Saved</h3>
        <p class="amount">{{ formatCurrency(totalCurrentAmount) }}</p>
      </div>
      <div class="summary-card">
        <h3>Overall Progress</h3>
        <div class="progress-display">
          <p class="amount">{{ Math.round(totalProgress * 100) }}%</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${totalProgress * 100}%` }"></div>
          </div>
        </div>
      </div>
      <div class="summary-card">
        <h3>Active Goals</h3>
        <p class="amount">{{ activeGoals.length }}</p>
      </div>
    </div>

    <div v-if="showForm" class="goal-form card">
      <h3>{{ editingGoal ? 'Edit Goal' : 'Create New Goal' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label>Goal Name</label>
            <input v-model="formData.name" type="text" required class="form-control" placeholder="e.g., Emergency Fund">
          </div>
          
          <div class="form-group">
            <label>Category</label>
            <select v-model="formData.category" class="form-control" required>
              <option value="savings">Savings</option>
              <option value="vehicle">Vehicle</option>
              <option value="travel">Travel</option>
              <option value="home">Home</option>
              <option value="education">Education</option>
              <option value="investment">Investment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Target Amount</label>
            <input v-model="formData.targetAmount" type="number" step="0.01" required class="form-control" placeholder="10000">
          </div>
          
          <div class="form-group">
            <label>Current Amount</label>
            <input v-model="formData.currentAmount" type="number" step="0.01" required class="form-control" placeholder="0">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Deadline</label>
            <input v-model="formData.deadline" type="date" required class="form-control">
          </div>
          
          <div class="form-group">
            <label>Priority</label>
            <select v-model="formData.priority" class="form-control" required>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Goal Color</label>
          <div class="color-picker">
            <input v-model="formData.color" type="color" class="color-input">
            <span class="color-preview" :style="{ backgroundColor: formData.color }"></span>
            <span>{{ formData.color }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>Description (Optional)</label>
          <textarea v-model="formData.description" class="form-control" rows="3" placeholder="Add any notes about your goal..."></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Saving...' : (editingGoal ? 'Update Goal' : 'Create Goal') }}
          </button>
          <button v-if="editingGoal" @click="cancelEdit" type="button" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div v-if="loading && !showForm" class="loading">Loading goals...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="tabs">
      <button @click="activeTab = 'active'" :class="['tab-btn', { active: activeTab === 'active' }]">
        Active Goals ({{ activeGoals.length }})
      </button>
      <button @click="activeTab = 'completed'" :class="['tab-btn', { active: activeTab === 'completed' }]">
        Completed Goals ({{ completedGoals.length }})
      </button>
    </div>

    <div v-if="activeTab === 'active'" class="goals-grid">
      <div v-for="goal in activeGoals" :key="goal.id" class="goal-item card">
        <div class="goal-header">
          <div class="goal-color" :style="{ backgroundColor: goal.color }"></div>
          <div class="goal-info">
            <h3>{{ goal.name }}</h3>
            <span class="goal-category">{{ goal.category }}</span>
            <span class="goal-priority" :class="goal.priority">
              {{ goal.priority }}
            </span>
          </div>
          <div class="goal-actions">
            <button @click="editGoal(goal)" class="btn-icon" title="Edit">
              ✏️
            </button>
            <button @click="addContribution(goal)" class="btn-icon" title="Add Contribution">
              💰
            </button>
            <button @click="deleteGoal(goal.id)" class="btn-icon" title="Delete">
              🗑️
            </button>
          </div>
        </div>
        
        <div class="goal-progress">
          <div class="progress-info">
            <span class="progress-text">
              {{ formatCurrency(goal.currentAmount) }} of {{ formatCurrency(goal.targetAmount) }}
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
            <span class="label">Deadline:</span>
            <span class="value">{{ formatDate(goal.deadline) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Days Remaining:</span>
            <span class="value">{{ calculateDaysRemaining(goal.deadline) }} days</span>
          </div>
          <div class="detail-row">
            <span class="label">Remaining:</span>
            <span class="value">{{ formatCurrency(goal.targetAmount - goal.currentAmount) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Daily Required:</span>
            <span class="value">{{ formatCurrency(calculateDailyRequired(goal)) }}/day</span>
          </div>
        </div>
        
        <div v-if="goal.description" class="goal-description">
          {{ goal.description }}
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'completed'" class="completed-goals">
      <div v-for="goal in completedGoals" :key="goal.id" class="completed-goal card">
        <div class="completion-badge">🎉 Completed!</div>
        <div class="goal-header">
          <div class="goal-color" :style="{ backgroundColor: goal.color }"></div>
          <div class="goal-info">
            <h3>{{ goal.name }}</h3>
            <span class="goal-category">{{ goal.category }}</span>
          </div>
          <div class="goal-actions">
            <button @click="deleteGoal(goal.id)" class="btn-icon" title="Delete">
              🗑️
            </button>
          </div>
        </div>
        
        <div class="completion-info">
          <div class="info-item">
            <span class="label">Completed On:</span>
            <span class="value">{{ formatDate(new Date().toISOString()) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Total Saved:</span>
            <span class="value">{{ formatCurrency(goal.targetAmount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeGoals.length === 0 && !loading" class="empty-state">
      <div class="empty-icon">🎯</div>
      <h3>No Financial Goals Yet</h3>
      <p>Start by creating your first financial goal</p>
      <button @click="showForm = true" class="btn btn-primary">
        Create First Goal
      </button>
    </div>

    <!-- Modal for adding contribution -->
    <div v-if="showContributionModal" class="modal-overlay">
      <div class="modal-content card">
        <h3>Add Contribution to {{ selectedGoal?.name }}</h3>
        <div class="form-group">
          <label>Amount</label>
          <input v-model="contributionAmount" type="number" step="0.01" class="form-control" placeholder="100">
        </div>
        <div class="modal-actions">
          <button @click="submitContribution" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Adicionando...' : 'Adicionar Contribuição' }}
          </button>
          <button @click="closeContributionModal" class="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useGoals } from '../composables/useGoals'
import { formatCurrency, formatDate } from '../utils/formatters'

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
  addContribution: addContributionToGoal,
  totalTargetAmount,
  totalCurrentAmount,
  totalProgress
} = useGoals()

const showForm = ref(false)
const editingGoal = ref(null)
const activeTab = ref('active')
const showContributionModal = ref(false)
const selectedGoal = ref(null)
const contributionAmount = ref('')

const formData = reactive({
  name: '',
  targetAmount: 10000,
  currentAmount: 0,
  deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
  category: 'savings',
  color: '#4CAF50',
  priority: 'medium',
  description: ''
})

onMounted(() => {
  fetchGoals()
})

const handleSubmit = async () => {
  if (editingGoal.value) {
    await updateGoal(editingGoal.value.id, formData)
    editingGoal.value = null
  } else {
    await addGoal(formData)
  }
  
  resetForm()
  showForm.value = false
}

const editGoal = (goal) => {
  editingGoal.value = goal
  formData.name = goal.name
  formData.targetAmount = goal.targetAmount
  formData.currentAmount = goal.currentAmount
  formData.deadline = goal.deadline
  formData.category = goal.category
  formData.color = goal.color
  formData.priority = goal.priority
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

const addContribution = (goal) => {
  selectedGoal.value = goal
  contributionAmount.value = ''
  showContributionModal.value = true
}

const submitContribution = async () => {
  if (!selectedGoal.value || !contributionAmount.value) return
  
  const amount = parseFloat(contributionAmount.value)
  if (amount <= 0) return
  
  try {
    await addContributionToGoal(selectedGoal.value.id, amount)
    closeContributionModal()
  } catch (err) {
    console.error('Error adding contribution:', err)
  }
}

const closeContributionModal = () => {
  showContributionModal.value = false
  selectedGoal.value = null
  contributionAmount.value = ''
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