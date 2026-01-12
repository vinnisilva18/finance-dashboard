<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 400px;">
      <q-card-section>
        <div class="modal-header">
          <h2>Adicionar Progresso</h2>
          <q-btn icon="close" flat round dense @click="closeModal" />
        </div>
      </q-card-section>

      <q-card-section v-if="goal" class="q-pt-none">
        <div class="goal-info">
          <div class="goal-title">{{ goal.title }}</div>
          <div class="goal-progress">
            <span>Progresso atual: {{ currentProgress }}%</span>
            <span>R$ {{ formatCurrency(goal.current) }} / R$ {{ formatCurrency(goal.target) }}</span>
          </div>
        </div>

        <q-form @submit="submitProgress" class="q-gutter-md">
          <!-- Valor do Progresso -->
          <div class="form-section">
            <div class="section-title">Valor do Progresso</div>
            <q-input
              v-model="progressForm.amount"
              type="number"
              min="0.01"
              :max="maxAmount"
              step="0.01"
              filled
              prefix="R$"
              :rules="[val => val > 0 || 'Valor deve ser maior que zero']"
              placeholder="0.00"
              hint="Quanto você quer adicionar ao progresso da meta?"
            >
              <template v-slot:after>
                <q-btn
                  label="Max"
                  flat
                  color="primary"
                  @click="progressForm.amount = maxAmount"
                  :disable="maxAmount <= 0"
                />
              </template>
            </q-input>
            
            <div class="amount-buttons">
              <q-btn
                v-for="amount in quickAmounts"
                :key="amount"
                :label="formatCurrency(amount)"
                flat
                color="primary"
                @click="progressForm.amount = amount"
                :disable="amount > maxAmount"
              />
            </div>
          </div>

          <!-- Data do Progresso -->
          <div class="form-section">
            <div class="section-title">Data do Progresso</div>
            <q-input
              v-model="progressForm.date"
              type="date"
              filled
              :max="today"
            />
          </div>

          <!-- Origem do Progresso -->
          <div class="form-section">
            <div class="section-title">Origem do Progresso</div>
            <q-select
              v-model="progressForm.source"
              :options="sourceOptions"
              filled
              label="De onde veio este valor?"
              clearable
            />
          </div>

          <!-- Descrição -->
          <div class="form-section">
            <div class="section-title">
              <span>Descrição</span>
              <small class="description-hint">(Opcional)</small>
            </div>
            <q-input
              v-model="progressForm.description"
              type="textarea"
              filled
              autogrow
              placeholder="Descreva como você conseguiu este progresso..."
              rows="2"
            />
          </div>

          <!-- Nota Fiscal -->
          <div class="form-section">
            <div class="section-title">
              <span>Comprovante</span>
              <small class="receipt-hint">(Opcional)</small>
            </div>
            <q-file
              v-model="progressForm.receipt"
              filled
              label="Anexar comprovante"
              accept=".jpg,.jpeg,.png,.pdf"
              max-file-size="5242880"
              @rejected="onFileRejected"
            >
              <template v-slot:prepend>
                <q-icon name="receipt" />
              </template>
            </q-file>
          </div>

          <!-- Resumo -->
          <div class="summary-section">
            <div class="section-title">Resumo</div>
            <div class="summary-details">
              <div class="summary-item">
                <span>Progresso Atual:</span>
                <span>{{ currentProgress }}%</span>
              </div>
              <div class="summary-item">
                <span>Progresso Adicionado:</span>
                <span class="positive">{{ formatCurrency(progressForm.amount || 0) }}</span>
              </div>
              <div class="summary-item">
                <span>Novo Progresso:</span>
                <span class="new-progress">{{ newProgress }}%</span>
              </div>
              <div class="summary-item">
                <span>Restante:</span>
                <span>R$ {{ formatCurrency(remainingAfterProgress) }}</span>
              </div>
            </div>
            
            <div class="progress-bar">
              <div class="bar-labels">
                <span>Atual: {{ currentProgress }}%</span>
                <span>Novo: {{ newProgress }}%</span>
              </div>
              <div class="bar-container">
                <div class="bar-background">
                  <div 
                    class="bar-current" 
                    :style="{ width: currentProgress + '%' }"
                  ></div>
                  <div 
                    class="bar-added" 
                    :style="{ 
                      width: addedProgress + '%',
                      left: currentProgress + '%'
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações Adicionais -->
          <div class="form-section">
            <div class="section-title">Configurações</div>
            <div class="settings-options">
              <q-checkbox
                v-model="progressForm.sendNotification"
                label="Enviar notificação de atualização"
              />
              <q-checkbox
                v-model="progressForm.updateMilestone"
                label="Atualizar marcos automaticamente"
              />
              <q-checkbox
                v-model="progressForm.createTransaction"
                label="Criar transação associada"
              />
            </div>
          </div>

          <!-- Ações -->
          <div class="form-actions">
            <q-btn label="Cancelar" flat color="negative" @click="closeModal" />
            <q-btn
              label="Adicionar Progresso"
              type="submit"
              color="primary"
              :loading="submitting"
              :disable="!canSubmit"
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
import { formatCurrency } from '@/utils/formatters'

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

const progressForm = ref({
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  source: '',
  description: '',
  receipt: null,
  sendNotification: true,
  updateMilestone: true,
  createTransaction: false
})

const sourceOptions = [
  'Saldo Mensal',
  'Bônus/Extra',
  'Presente',
  'Rendimento de Investimentos',
  'Reembolso',
  'Outro'
]

const quickAmounts = [50, 100, 200, 500, 1000]

const today = new Date().toISOString().split('T')[0]

// Computed Properties
const currentProgress = computed(() => {
  if (!props.goal?.target || props.goal.target === 0) return 0
  return Math.round((props.goal.current / props.goal.target) * 100)
})

const maxAmount = computed(() => {
  if (!props.goal) return 0
  return props.goal.target - props.goal.current
})

const addedProgress = computed(() => {
  if (!props.goal?.target || props.goal.target === 0) return 0
  return Math.round((progressForm.value.amount / props.goal.target) * 100)
})

const newProgress = computed(() => {
  return Math.min(100, currentProgress.value + addedProgress.value)
})

const remainingAfterProgress = computed(() => {
  if (!props.goal) return 0
  return Math.max(0, props.goal.target - (props.goal.current + (progressForm.value.amount || 0)))
})

const canSubmit = computed(() => {
  return progressForm.value.amount > 0 && progressForm.value.amount <= maxAmount.value
})

// Methods
function onFileRejected(rejectedEntries) {
  const messages = rejectedEntries.map(entry => {
    if (entry.failedPropValidation === 'max-file-size') {
      return 'Arquivo muito grande (máximo: 5MB)'
    }
    return 'Tipo de arquivo não suportado'
  })
  
  $q.notify({
    type: 'negative',
    message: messages.join(', ')
  })
}

async function submitProgress() {
  submitting.value = true
  
  try {
    // Validate
    if (!progressForm.value.amount || progressForm.value.amount <= 0) {
      throw new Error('Valor deve ser maior que zero')
    }
    
    if (progressForm.value.amount > maxAmount.value) {
      throw new Error(`Valor não pode ultrapassar R$ ${formatCurrency(maxAmount.value)}`)
    }
    
    // Prepare data
    const progressData = {
      amount: parseFloat(progressForm.value.amount),
      date: progressForm.value.date,
      source: progressForm.value.source || null,
      description: progressForm.value.description || null,
      sendNotification: progressForm.value.sendNotification,
      updateMilestone: progressForm.value.updateMilestone,
      createTransaction: progressForm.value.createTransaction
    }
    
    emit('submit', progressData)
    
    $q.notify({
      type: 'positive',
      message: 'Progresso adicionado com sucesso!'
    })
    
    closeModal()
    
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao adicionar progresso'
    })
  } finally {
    submitting.value = false
  }
}

function closeModal() {
  showModal.value = false
  // Reset form
  progressForm.value = {
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    source: '',
    description: '',
    receipt: null,
    sendNotification: true,
    updateMilestone: true,
    createTransaction: false
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

.description-hint, .receipt-hint {
  font-weight: normal;
  color: #666;
}

.amount-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.summary-section {
  margin: 25px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.summary-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .summary-details {
    grid-template-columns: 1fr;
  }
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item span:first-child {
  color: #666;
  font-weight: 500;
}

.summary-item span:last-child {
  font-weight: 600;
  color: #2c3e50;
}

.summary-item .positive {
  color: #4CAF50;
}

.new-progress {
  color: #4CAF50;
  font-weight: 700;
}

.progress-bar {
  margin-top: 20px;
}

.bar-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
}

.bar-container {
  height: 30px;
  position: relative;
}

.bar-background {
  width: 100%;
  height: 100%;
  background: #e9ecef;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.bar-current {
  position: absolute;
  height: 100%;
  background: #2196F3;
  border-radius: 15px;
  transition: width 0.5s ease;
}

.bar-added {
  position: absolute;
  height: 100%;
  background: #4CAF50;
  border-radius: 0 15px 15px 0;
  transition: width 0.5s ease, left 0.5s ease;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
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