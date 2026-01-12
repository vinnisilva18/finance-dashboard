<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 400px;">
      <q-card-section>
        <div class="modal-header">
          <h2>Ajustar Prazo da Meta</h2>
          <q-btn icon="close" flat round dense @click="closeModal" />
        </div>
      </q-card-section>

      <q-card-section v-if="goal" class="q-pt-none">
        <div class="goal-info">
          <div class="goal-title">{{ goal.title }}</div>
          <div class="goal-deadline">
            <q-icon name="calendar_today" />
            <span>Prazo atual: {{ formatDate(goal.deadline) }}</span>
          </div>
          <div class="goal-progress">
            <span>Progresso: {{ currentProgress }}%</span>
            <span>Restam: R$ {{ formatCurrency(remainingAmount) }}</span>
          </div>
        </div>

        <q-form @submit="submitDeadline" class="q-gutter-md">
          <!-- Nova Data Limite -->
          <div class="form-section">
            <div class="section-title">Nova Data Limite</div>
            <q-input
              v-model="deadlineForm.newDeadline"
              type="date"
              filled
              :min="minDate"
              :rules="[val => !!val || 'Nova data é obrigatória']"
            />
          </div>

          <!-- Motivo do Ajuste -->
          <div class="form-section">
            <div class="section-title">
              <span>Motivo do Ajuste</span>
              <small class="reason-hint">(Opcional)</small>
            </div>
            <q-select
              v-model="deadlineForm.reason"
              :options="reasonOptions"
              filled
              use-input
              @filter="filterReasons"
              label="Selecione um motivo"
              clearable
            />
            
            <div v-if="deadlineForm.reason === 'other'" class="custom-reason">
              <q-input
                v-model="deadlineForm.customReason"
                type="textarea"
                filled
                autogrow
                placeholder="Descreva o motivo do ajuste..."
                rows="2"
              />
            </div>
          </div>

          <!-- Análise do Ajuste -->
          <div class="analysis-section">
            <div class="section-title">Análise do Ajuste</div>
            
            <div class="analysis-grid">
              <div class="analysis-item">
                <div class="analysis-label">Prazo Original</div>
                <div class="analysis-value">{{ formatDate(goal.deadline) }}</div>
              </div>
              
              <div class="analysis-item">
                <div class="analysis-label">Novo Prazo</div>
                <div class="analysis-value" :class="deadlineForm.newDeadline ? 'positive' : 'negative'">
                  {{ deadlineForm.newDeadline ? formatDate(deadlineForm.newDeadline) : 'Não definido' }}
                </div>
              </div>
              
              <div class="analysis-item">
                <div class="analysis-label">Diferença</div>
                <div class="analysis-value" :class="daysDifference >= 0 ? 'positive' : 'negative'">
                  {{ daysDifference >= 0 ? '+' : '' }}{{ daysDifference }} dias
                </div>
              </div>
              
              <div class="analysis-item">
                <div class="analysis-label">Saldo Diário Necessário</div>
                <div class="analysis-value">
                  R$ {{ formatCurrency(dailyRequired) }}/dia
                </div>
              </div>
            </div>
            
            <div class="impact-analysis">
              <div class="impact-title">Impacto do Ajuste:</div>
              <div class="impact-message" :class="impactClass">
                {{ impactMessage }}
              </div>
            </div>
          </div>

          <!-- Ajuste de Saldo Mensal -->
          <div v-if="goal.monthlyTarget" class="form-section">
            <div class="section-title">
              <q-checkbox
                v-model="deadlineForm.adjustMonthlyTarget"
                label="Ajustar saldo mensal automaticamente"
              />
            </div>
            
            <div v-if="deadlineForm.adjustMonthlyTarget" class="monthly-adjustment">
              <div class="adjustment-info">
                <div class="current-monthly">
                  <span>Saldo mensal atual:</span>
                  <span>R$ {{ formatCurrency(goal.monthlyTarget) }}</span>
                </div>
                
                <div class="new-monthly">
                  <span>Novo saldo mensal:</span>
                  <span class="monthly-value">R$ {{ formatCurrency(newMonthlyTarget) }}</span>
                </div>
                
                <div class="adjustment-change">
                  <span>Variação:</span>
                  <span :class="monthlyChange >= 0 ? 'positive' : 'negative'">
                    {{ monthlyChange >= 0 ? '+' : '' }}{{ monthlyChange }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notificações -->
          <div class="form-section">
            <div class="section-title">Notificações</div>
            <div class="notification-options">
              <q-checkbox
                v-model="deadlineForm.sendNotification"
                label="Enviar notificação sobre o ajuste"
              />
              <q-checkbox
                v-model="deadlineForm.updateReminders"
                label="Atualizar lembretes automáticos"
              />
            </div>
          </div>

          <!-- Histórico -->
          <div v-if="goal.deadlineHistory && goal.deadlineHistory.length > 0" class="history-section">
            <div class="section-title">Histórico de Ajustes</div>
            <div class="history-list">
              <div v-for="adjustment in goal.deadlineHistory.slice(0, 3)" :key="adjustment.date" class="history-item">
                <div class="history-date">{{ formatDate(adjustment.date) }}</div>
                <div class="history-change">
                  <q-icon :name="adjustment.change >= 0 ? 'arrow_upward' : 'arrow_downward'" />
                  <span>{{ adjustment.change >= 0 ? '+' : '' }}{{ adjustment.change }} dias</span>
                </div>
                <div class="history-reason">{{ adjustment.reason || 'Sem motivo' }}</div>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="form-actions">
            <q-btn label="Cancelar" flat color="negative" @click="closeModal" />
            <q-btn
              label="Aplicar Ajuste"
              type="submit"
              color="primary"
              :loading="submitting"
              :disable="!canSubmit"
            />
            <q-btn
              v-if="goal.deadlineHistory && goal.deadlineHistory.length > 0"
              label="Restaurar Anterior"
              flat
              color="warning"
              @click="restorePrevious"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { formatCurrency, formatDate, getDaysBetween } from '@/utils/formatters'

const $q = useQuasar()

const props = defineProps({
  modelValue: Boolean,
  goal: Object
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
const allReasons = ref([
  'Imprevisto financeiro',
  'Mudança de prioridades',
  'Oportunidade melhor',
  'Atraso na receita',
  'Aumento de custos',
  'Meta alcançada antecipadamente',
  'Reavaliação de objetivos',
  'other'
])
const filteredReasons = ref([])

const deadlineForm = ref({
  newDeadline: '',
  reason: '',
  customReason: '',
  adjustMonthlyTarget: true,
  sendNotification: true,
  updateReminders: true
})

// Initialize form
if (props.goal) {
  const currentDate = new Date()
  const nextMonth = new Date(currentDate)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  
  deadlineForm.value.newDeadline = nextMonth.toISOString().split('T')[0]
  filteredReasons.value = allReasons.value.filter(r => r !== 'other')
}

// Computed Properties
const minDate = new Date().toISOString().split('T')[0]

const currentProgress = computed(() => {
  if (!props.goal?.target || props.goal.target === 0) return 0
  return Math.round((props.goal.current / props.goal.target) * 100)
})

const remainingAmount = computed(() => {
  if (!props.goal) return 0
  return props.goal.target - props.goal.current
})

const daysDifference = computed(() => {
  if (!deadlineForm.value.newDeadline || !props.goal?.deadline) return 0
  
  const oldDeadline = new Date(props.goal.deadline)
  const newDeadline = new Date(deadlineForm.value.newDeadline)
  
  return getDaysBetween(oldDeadline, newDeadline)
})

const dailyRequired = computed(() => {
  if (!deadlineForm.value.newDeadline || daysDifference.value === 0) return 0
  
  const remainingDays = Math.max(1, getDaysBetween(new Date(), new Date(deadlineForm.value.newDeadline)))
  return remainingAmount.value / remainingDays
})

const newMonthlyTarget = computed(() => {
  if (!deadlineForm.value.adjustMonthlyTarget || !deadlineForm.value.newDeadline) {
    return props.goal?.monthlyTarget || 0
  }
  
  const remainingMonths = Math.max(1, daysDifference.value / 30)
  return remainingAmount.value / remainingMonths
})

const monthlyChange = computed(() => {
  if (!props.goal?.monthlyTarget || props.goal.monthlyTarget === 0) return 0
  
  const change = ((newMonthlyTarget.value - props.goal.monthlyTarget) / props.goal.monthlyTarget) * 100
  return Math.round(change)
})

const impactMessage = computed(() => {
  if (daysDifference.value > 30) {
    return 'Ajuste significativo. Considere se essa é a melhor estratégia.'
  } else if (daysDifference.value > 7) {
    return 'Ajuste moderado. Mantenha o foco para alcançar a meta.'
  } else if (daysDifference.value > 0) {
    return 'Pequeno ajuste. Continue com sua rotina de saldo.'
  } else if (daysDifference.value === 0) {
    return 'Sem alteração no prazo.'
  } else if (daysDifference.value >= -7) {
    return 'Prazo reduzido. Você precisará aumentar seus esforços.'
  } else {
    return 'Redução significativa no prazo. Reavalie sua capacidade de saldo.'
  }
})

const impactClass = computed(() => {
  if (daysDifference.value > 30) return 'warning'
  if (daysDifference.value > 0) return 'info'
  if (daysDifference.value === 0) return 'neutral'
  if (daysDifference.value >= -7) return 'warning'
  return 'negative'
})

const canSubmit = computed(() => {
  return !!deadlineForm.value.newDeadline && daysDifference.value !== 0
})

// Methods
function filterReasons(val, update) {
  if (val === '') {
    update(() => {
      filteredReasons.value = allReasons.value.filter(r => r !== 'other')
    })
    return
  }
  
  update(() => {
    const search = val.toLowerCase()
    filteredReasons.value = allReasons.value.filter(
      reason => reason.toLowerCase().includes(search)
    )
  })
}

async function submitDeadline() {
  submitting.value = true
  
  try {
    // Validate
    if (!deadlineForm.value.newDeadline) {
      throw new Error('Nova data limite é obrigatória')
    }
    
    if (daysDifference.value === 0) {
      throw new Error('A nova data deve ser diferente da atual')
    }
    
    const newDeadline = new Date(deadlineForm.value.newDeadline)
    const today = new Date()
    
    if (newDeadline < today) {
      throw new Error('A nova data não pode ser anterior a hoje')
    }
    
    // Prepare data
    const deadlineData = {
      newDeadline: deadlineForm.value.newDeadline,
      reason: deadlineForm.value.reason === 'other' 
        ? deadlineForm.value.customReason 
        : deadlineForm.value.reason,
      adjustMonthlyTarget: deadlineForm.value.adjustMonthlyTarget,
      newMonthlyTarget: deadlineForm.value.adjustMonthlyTarget ? newMonthlyTarget.value : null,
      sendNotification: deadlineForm.value.sendNotification,
      updateReminders: deadlineForm.value.updateReminders
    }
    
    emit('submit', deadlineData)
    
    $q.notify({
      type: 'positive',
      message: 'Prazo ajustado com sucesso!'
    })
    
    closeModal()
    
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao ajustar prazo'
    })
  } finally {
    submitting.value = false
  }
}

function restorePrevious() {
  if (!props.goal?.deadlineHistory || props.goal.deadlineHistory.length === 0) return
  
  const lastAdjustment = props.goal.deadlineHistory[0]
  deadlineForm.value.newDeadline = lastAdjustment.previousDate
  
  $q.notify({
    type: 'info',
    message: 'Data anterior restaurada. Aplique para confirmar.'
  })
}

function closeModal() {
  showModal.value = false
  // Reset form
  deadlineForm.value = {
    newDeadline: '',
    reason: '',
    customReason: '',
    adjustMonthlyTarget: true,
    sendNotification: true,
    updateReminders: true
  }
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

.goal-info {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.goal-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
}

.goal-deadline {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  margin-bottom: 10px;
}

.goal-progress {
  display: flex;
  justify-content: space-between;
  color: #666;
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
  justify-content: space-between;
  align-items: center;
}

.reason-hint {
  font-weight: normal;
  color: #666;
}

.custom-reason {
  margin-top: 15px;
}

.analysis-section {
  margin: 25px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}

.analysis-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.analysis-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.analysis-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.analysis-value.positive {
  color: #4CAF50;
}

.analysis-value.negative {
  color: #F44336;
}

.impact-analysis {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.impact-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.impact-message {
  line-height: 1.6;
  padding: 10px;
  border-radius: 6px;
  background: #f8f9fa;
}

.impact-message.warning {
  background: #fff8e1;
  border-left: 4px solid #FF9800;
  color: #FF9800;
}

.impact-message.info {
  background: #e3f2fd;
  border-left: 4px solid #2196F3;
  color: #2196F3;
}

.impact-message.neutral {
  background: #f5f5f5;
  border-left: 4px solid #9E9E9E;
  color: #9E9E9E;
}

.impact-message.negative {
  background: #ffebee;
  border-left: 4px solid #F44336;
  color: #F44336;
}

.monthly-adjustment {
  margin-top: 15px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.adjustment-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.current-monthly, .new-monthly, .adjustment-change {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.current-monthly:last-child,
.new-monthly:last-child,
.adjustment-change:last-child {
  border-bottom: none;
}

.monthly-value {
  font-weight: 600;
  color: #2c3e50;
}

.notification-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.history-section {
  margin: 25px 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.history-date {
  min-width: 120px;
  font-size: 0.85rem;
  color: #666;
}

.history-change {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  color: #2c3e50;
}

.history-reason {
  flex: 1;
  font-size: 0.9rem;
  color: #666;
  text-align: right;
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