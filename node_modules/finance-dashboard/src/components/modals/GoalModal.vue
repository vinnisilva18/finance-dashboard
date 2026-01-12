<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 500px; max-width: 700px;">
      <q-card-section>
        <div class="modal-header">
          <h2>{{ editingGoal ? 'Editar Meta' : 'Nova Meta Financeira' }}</h2>
          <q-btn icon="close" flat round dense @click="closeModal" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="submitForm" class="q-gutter-md">
          <!-- Título da Meta -->
          <q-input
            v-model="goalForm.title"
            label="Título da Meta *"
            filled
            :rules="[val => !!val || 'Título é obrigatório']"
            placeholder="Ex: Reserva de Emergência, Viagem para Europa..."
            hint="Dê um nome claro e objetivo para sua meta"
          />

          <!-- Descrição -->
          <q-input
            v-model="goalForm.description"
            label="Descrição"
            type="textarea"
            filled
            autogrow
            placeholder="Descreva sua meta com mais detalhes..."
            rows="2"
          />

          <!-- Tipo e Prazo -->
          <div class="form-row">
            <div class="form-group">
              <label>Tipo de Prazo *</label>
              <q-select
                v-model="goalForm.timeframe"
                :options="timeframeOptions"
                filled
                :rules="[val => !!val || 'Prazo é obrigatório']"
              />
            </div>
            
            <div class="form-group">
              <label>Data Limite *</label>
              <q-input
                v-model="goalForm.deadline"
                type="date"
                filled
                :rules="[val => !!val || 'Data limite é obrigatória']"
                :min="minDate"
              />
            </div>
          </div>

          <!-- Valor da Meta -->
          <div class="form-section">
            <div class="section-title">Valor da Meta</div>
            <div class="form-row">
              <div class="form-group">
                <label>Valor Alvo (R$) *</label>
                <q-input
                  v-model="goalForm.target"
                  type="number"
                  min="0"
                  step="0.01"
                  filled
                  prefix="R$"
                  :rules="[val => val > 0 || 'Valor deve ser maior que zero']"
                  placeholder="0.00"
                />
              </div>
              
              <div class="form-group">
                <label>Valor Inicial (R$)</label>
                <q-input
                  v-model="goalForm.current"
                  type="number"
                  min="0"
                  step="0.01"
                  filled
                  prefix="R$"
                  :max="goalForm.target"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div class="progress-preview">
              <div class="progress-header">
                <span>Progresso Inicial</span>
                <span>{{ initialProgress }}%</span>
              </div>
              <q-linear-progress 
                :value="goalForm.current / goalForm.target" 
                :color="getProgressColor(goalForm.current / goalForm.target)"
                size="10px"
                rounded
              />
              <div class="progress-details">
                <span>R$ {{ formatCurrency(goalForm.current || 0) }}</span>
                <span>R$ {{ formatCurrency(goalForm.target || 0) }}</span>
              </div>
            </div>
          </div>

          <!-- Prioridade -->
          <div class="form-section">
            <div class="section-title">Prioridade</div>
            <q-btn-toggle
              v-model="goalForm.priority"
              :options="priorityOptions"
              spread
              class="priority-toggle"
            />
            <div class="priority-description">
              {{ getPriorityDescription(goalForm.priority) }}
            </div>
          </div>

          <!-- Categoria -->
          <div class="form-section">
            <div class="section-title">Categoria</div>
            <q-select
              v-model="goalForm.category"
              :options="categoryOptions"
              filled
              use-input
              @filter="filterCategories"
              label="Selecione uma categoria"
              clearable
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="getCategoryIcon(scope.opt.value)" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Marco de Saldo Mensal -->
          <div class="form-section">
            <div class="section-title">
              <q-checkbox
                v-model="goalForm.hasMonthlyTarget"
                label="Definir saldo mensal"
              />
            </div>
            
            <div v-if="goalForm.hasMonthlyTarget" class="monthly-target">
              <div class="form-row">
                <div class="form-group">
                  <label>Saldo Mensal (R$)</label>
                  <q-input
                    v-model="goalForm.monthlyTarget"
                    type="number"
                    min="0"
                    step="0.01"
                    filled
                    prefix="R$"
                    placeholder="0.00"
                  />
                </div>
                
                <div class="form-group">
                  <label>Dia do Depósito</label>
                  <q-input
                    v-model="goalForm.depositDay"
                    type="number"
                    min="1"
                    max="31"
                    filled
                    suffix="º dia"
                    placeholder="1-31"
                  />
                </div>
              </div>
              
              <div class="target-summary">
                <div class="summary-item">
                  <q-icon name="calendar_today" />
                  <div class="summary-content">
                    <div class="summary-label">Prazo Estimado</div>
                    <div class="summary-value">{{ estimatedCompletion }}</div>
                  </div>
                </div>
                
                <div class="summary-item">
                  <q-icon name="trending_up" />
                  <div class="summary-content">
                    <div class="summary-label">Saldo Total</div>
                    <div class="summary-value">R$ {{ formatCurrency(totalMonthlySavings) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Marcos Intermediários -->
          <div class="form-section">
            <div class="section-title">
              <q-checkbox
                v-model="goalForm.hasMilestones"
                label="Adicionar marcos intermediários"
              />
            </div>
            
            <div v-if="goalForm.hasMilestones" class="milestones-section">
              <div class="milestones-list">
                <div
                  v-for="(milestone, index) in goalForm.milestones"
                  :key="index"
                  class="milestone-item"
                >
                  <div class="milestone-header">
                    <span>Marco {{ index + 1 }}</span>
                    <q-btn
                      icon="delete"
                      flat
                      round
                      dense
                      color="negative"
                      size="sm"
                      @click="removeMilestone(index)"
                      v-if="goalForm.milestones.length > 1"
                    />
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label>Descrição</label>
                      <q-input
                        v-model="milestone.title"
                        filled
                        dense
                        placeholder="Ex: Primeiro trimestre, Metade do caminho..."
                      />
                    </div>
                    
                    <div class="form-group">
                      <label>Valor (R$)</label>
                      <q-input
                        v-model="milestone.amount"
                        type="number"
                        min="0"
                        :max="goalForm.target"
                        step="0.01"
                        filled
                        dense
                        prefix="R$"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <q-btn
                icon="add"
                label="Adicionar Marco"
                flat
                color="primary"
                @click="addMilestone"
              />
            </div>
          </div>

          <!-- Notificações -->
          <div class="form-section">
            <div class="section-title">Notificações</div>
            <div class="notifications-settings">
              <q-checkbox
                v-model="goalForm.notifications.enabled"
                label="Ativar notificações de progresso"
              />
              
              <div v-if="goalForm.notifications.enabled" class="notification-options">
                <q-checkbox
                  v-model="goalForm.notifications.weeklyUpdate"
                  label="Atualização semanal"
                />
                <q-checkbox
                  v-model="goalForm.notifications.milestoneReached"
                  label="Quando atingir um marco"
                />
                <q-checkbox
                  v-model="goalForm.notifications.deadlineReminder"
                  label="Lembrete do prazo final"
                />
              </div>
            </div>
          </div>

          <!-- Comemoração -->
          <div class="form-section">
            <div class="section-title">Comemoração</div>
            <q-input
              v-model="goalForm.celebration"
              type="textarea"
              filled
              autogrow
              placeholder="Como você vai comemorar quando alcançar esta meta?..."
              rows="2"
              hint="Definir uma recompensa pode aumentar sua motivação"
            />
          </div>

          <!-- Resumo -->
          <div class="summary-section">
            <div class="section-title">Resumo da Meta</div>
            <div class="summary-card">
              <div class="summary-header">
                <div class="summary-title">{{ goalForm.title || 'Nova Meta' }}</div>
                <div class="summary-timeframe">
                  <q-chip :label="getTimeframeLabel(goalForm.timeframe)" size="sm" dense />
                </div>
              </div>
              
              <div class="summary-content">
                <div class="summary-item">
                  <span>Valor Alvo:</span>
                  <span class="summary-value">R$ {{ formatCurrency(goalForm.target || 0) }}</span>
                </div>
                
                <div class="summary-item">
                  <span>Prazo:</span>
                  <span class="summary-value">{{ formatDate(goalForm.deadline) || 'Não definido' }}</span>
                </div>
                
                <div class="summary-item">
                  <span>Progresso Inicial:</span>
                  <span class="summary-value">{{ initialProgress }}%</span>
                </div>
                
                <div v-if="goalForm.hasMonthlyTarget" class="summary-item">
                  <span>Saldo Mensal:</span>
                  <span class="summary-value">R$ {{ formatCurrency(goalForm.monthlyTarget || 0) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="form-actions">
            <q-btn label="Cancelar" flat color="negative" @click="closeModal" />
            <q-btn
              :label="editingGoal ? 'Atualizar' : 'Criar Meta'"
              type="submit"
              color="primary"
              :loading="submitting"
            />
            <q-btn
              v-if="!editingGoal"
              label="Salvar como Rascunho"
              flat
              color="warning"
              @click="saveAsDraft"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useCategoryStore } from '@/stores/category'
import { formatCurrency, formatDate } from '@/utils/formatters'

const $q = useQuasar()
const categoryStore = useCategoryStore()

const props = defineProps({
  modelValue: Boolean,
  editingGoal: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const showModal = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const submitting = ref(false)
const allCategories = ref([])
const filteredCategories = ref([])

const minDate = new Date().toISOString().split('T')[0]

const goalForm = ref({
  title: '',
  description: '',
  timeframe: 'medium',
  deadline: '',
  target: 0,
  current: 0,
  priority: 'medium',
  category: '',
  hasMonthlyTarget: false,
  monthlyTarget: 0,
  depositDay: 1,
  hasMilestones: false,
  milestones: [
    { title: '', amount: 0, completed: false }
  ],
  notifications: {
    enabled: true,
    weeklyUpdate: true,
    milestoneReached: true,
    deadlineReminder: true
  },
  celebration: '',
  status: 'active'
})

// Initialize form if editing
if (props.editingGoal) {
  goalForm.value = {
    ...props.editingGoal,
    hasMonthlyTarget: !!props.editingGoal.monthlyTarget,
    hasMilestones: props.editingGoal.milestones && props.editingGoal.milestones.length > 0,
    milestones: props.editingGoal.milestones || [{ title: '', amount: 0, completed: false }],
    notifications: props.editingGoal.notifications || {
      enabled: true,
      weeklyUpdate: true,
      milestoneReached: true,
      deadlineReminder: true
    }
  }
}

// Options
const timeframeOptions = [
  { label: 'Curto Prazo (até 1 ano)', value: 'short' },
  { label: 'Médio Prazo (1-3 anos)', value: 'medium' },
  { label: 'Longo Prazo (mais de 3 anos)', value: 'long' }
]

const priorityOptions = [
  { label: 'Baixa', value: 'low', icon: 'low_priority', color: 'positive' },
  { label: 'Média', value: 'medium', icon: 'priority', color: 'warning' },
  { label: 'Alta', value: 'high', icon: 'priority_high', color: 'negative' }
]

const categoryOptions = computed(() => {
  return filteredCategories.value.map(cat => ({
    label: cat.name,
    value: cat.name
  }))
})

onMounted(async () => {
  await categoryStore.fetchCategories()
  allCategories.value = categoryStore.categories
  filteredCategories.value = allCategories.value
})

// Computed Properties
const initialProgress = computed(() => {
  if (!goalForm.value.target || goalForm.value.target === 0) return 0
  return Math.round((goalForm.value.current / goalForm.value.target) * 100)
})

const estimatedCompletion = computed(() => {
  if (!goalForm.value.hasMonthlyTarget || !goalForm.value.monthlyTarget) return 'Não calculado'
  
  const remaining = goalForm.value.target - goalForm.value.current
  const monthsNeeded = Math.ceil(remaining / goalForm.value.monthlyTarget)
  
  if (monthsNeeded <= 0) return 'Meta já alcançada'
  
  const completionDate = new Date()
  completionDate.setMonth(completionDate.getMonth() + monthsNeeded)
  
  return formatDate(completionDate)
})

const totalMonthlySavings = computed(() => {
  if (!goalForm.value.hasMonthlyTarget) return 0
  
  const remaining = goalForm.value.target - goalForm.value.current
  const monthsNeeded = Math.ceil(remaining / goalForm.value.monthlyTarget)
  
  return monthsNeeded * goalForm.value.monthlyTarget
})

// Methods
function getProgressColor(progress) {
  if (progress >= 0.8) return 'positive'
  if (progress >= 0.5) return 'warning'
  return 'negative'
}

function getPriorityDescription(priority) {
  const descriptions = {
    low: 'Meta importante, mas não urgente. Pode ser adiada se necessário.',
    medium: 'Meta significativa. Recomenda-se atenção regular.',
    high: 'Meta crítica. Requer atenção imediata e prioridade máxima.'
  }
  return descriptions[priority] || ''
}

function getCategoryIcon(categoryName) {
  const iconMap = {
    'Viagem': 'flight',
    'Educação': 'school',
    'Casa': 'home',
    'Carro': 'directions_car',
    'Investimentos': 'trending_up',
    'Emergência': 'warning',
    'Lazer': 'sports_esports',
    'Saúde': 'local_hospital'
  }
  return iconMap[categoryName] || 'flag'
}

function filterCategories(val, update) {
  if (val === '') {
    update(() => {
      filteredCategories.value = allCategories.value
    })
    return
  }
  
  update(() => {
    const search = val.toLowerCase()
    filteredCategories.value = allCategories.value.filter(
      cat => cat.name.toLowerCase().includes(search)
    )
  })
}

function getTimeframeLabel(timeframe) {
  const labels = {
    short: 'Curto Prazo',
    medium: 'Médio Prazo',
    long: 'Longo Prazo'
  }
  return labels[timeframe] || timeframe
}

function addMilestone() {
  goalForm.value.milestones.push({
    title: '',
    amount: 0,
    completed: false
  })
}

function removeMilestone(index) {
  goalForm.value.milestones.splice(index, 1)
}

async function submitForm() {
  submitting.value = true
  
  try {
    // Validate required fields
    if (!goalForm.value.title.trim()) {
      throw new Error('Título da meta é obrigatório')
    }
    
    if (!goalForm.value.target || goalForm.value.target <= 0) {
      throw new Error('Valor alvo deve ser maior que zero')
    }
    
    if (!goalForm.value.deadline) {
      throw new Error('Data limite é obrigatória')
    }
    
    if (goalForm.value.current > goalForm.value.target) {
      throw new Error('Valor inicial não pode ser maior que o valor alvo')
    }
    
    // Prepare data
    const goalData = {
      title: goalForm.value.title.trim(),
      description: goalForm.value.description || null,
      timeframe: goalForm.value.timeframe,
      deadline: goalForm.value.deadline,
      target: parseFloat(goalForm.value.target),
      current: parseFloat(goalForm.value.current || 0),
      priority: goalForm.value.priority,
      category: goalForm.value.category || null,
      monthlyTarget: goalForm.value.hasMonthlyTarget ? parseFloat(goalForm.value.monthlyTarget) : null,
      depositDay: goalForm.value.hasMonthlyTarget ? parseInt(goalForm.value.depositDay) : null,
      milestones: goalForm.value.hasMilestones ? 
        goalForm.value.milestones
          .filter(m => m.title.trim() && m.amount > 0)
          .map(m => ({
            title: m.title.trim(),
            amount: parseFloat(m.amount),
            completed: false
          })) : [],
      notifications: goalForm.value.notifications,
      celebration: goalForm.value.celebration || null,
      status: 'active'
    }
    
    if (props.editingGoal) {
      goalData.id = props.editingGoal.id
    }
    
    emit('submit', goalData)
    
    $q.notify({
      type: 'positive',
      message: props.editingGoal ? 
        'Meta atualizada com sucesso' : 
        'Meta criada com sucesso'
    })
    
    closeModal()
    
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar meta'
    })
  } finally {
    submitting.value = false
  }
}

function saveAsDraft() {
  goalForm.value.status = 'draft'
  submitForm()
}

function closeModal() {
  showModal.value = false
}
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-section {
  margin-bottom: 25px;
}

.section-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-preview {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
}

.priority-toggle {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.priority-toggle :deep(.q-btn) {
  padding: 10px 5px;
  text-transform: none;
}

.priority-description {
  font-size: 0.9rem;
  color: #666;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid;
}

.priority-description[data-priority="low"] {
  border-left-color: #4CAF50;
}

.priority-description[data-priority="medium"] {
  border-left-color: #FF9800;
}

.priority-description[data-priority="high"] {
  border-left-color: #F44336;
}

.monthly-target {
  margin-top: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.target-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.summary-content {
  flex: 1;
}

.summary-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 3px;
}

.summary-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.milestones-section {
  margin-top: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.milestones-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.milestone-item {
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: 500;
  color: #2c3e50;
}

.notifications-settings {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.notification-options {
  margin-top: 10px;
  padding-left: 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-section {
  margin: 25px 0;
}

.summary-card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 2px solid #e3f2fd;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.summary-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item span:first-child {
  color: #666;
  font-weight: 500;
}

.summary-item .summary-value {
  font-weight: 600;
  color: #2c3e50;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f2f5;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .q-btn {
    width: 100%;
  }
}
</style>