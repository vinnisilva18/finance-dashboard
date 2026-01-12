<template>
  <div class="transaction-form">
    <q-card class="form-card">
      <q-card-section>
        <div class="form-header">
          <h2>{{ editingTransaction ? 'Editar Transação' : 'Nova Transação' }}</h2>
          <q-btn
            icon="close"
            flat
            round
            dense
            @click="$emit('close')"
          />
        </div>

        <q-form @submit="submitForm" class="q-gutter-md">
          <!-- Tipo de Transação -->
          <div class="form-section">
            <div class="section-title">Tipo de Transação</div>
            <div class="type-selector">
              <q-btn
                :label="type === 'income' ? 'Receita' : 'Despesa'"
                :color="type === 'income' ? 'positive' : 'negative'"
                :icon="type === 'income' ? 'trending_up' : 'trending_down'"
                @click="type = type === 'income' ? 'expense' : 'income'"
                class="type-toggle"
              />
              <div class="type-description">
                {{ type === 'income' ? 'Dinheiro entrando na sua conta' : 'Dinheiro saindo da sua conta' }}
              </div>
            </div>
          </div>

          <!-- Valor e Data -->
          <div class="form-row">
            <div class="form-group">
              <label for="amount">Valor *</label>
              <q-input
                id="amount"
                v-model="form.amount"
                type="number"
                min="0"
                step="0.01"
                :prefix="currencySymbol"
                filled
                :rules="[val => val > 0 || 'Valor deve ser maior que zero']"
                placeholder="0.00"
                class="amount-input"
              />
            </div>

            <div class="form-group">
              <label for="date">Data *</label>
              <q-input
                id="date"
                v-model="form.date"
                type="date"
                filled
                :rules="[val => !!val || 'Data é obrigatória']"
              />
            </div>
          </div>

          <!-- Categoria e Descrição -->
          <div class="form-row">
            <div class="form-group">
              <label for="category">Categoria *</label>
              <q-select
                id="category"
                v-model="form.category"
                :options="categoryOptions"
                filled
                use-input
                @filter="filterCategories"
                :rules="[val => !!val || 'Categoria é obrigatória']"
                placeholder="Selecione uma categoria"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon :name="getCategoryIcon(scope.opt.label)" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div class="category-actions">
                <q-btn
                  icon="add"
                  label="Nova Categoria"
                  flat
                  dense
                  size="sm"
                  @click="showCategoryModal = true"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="description">Descrição *</label>
              <q-input
                id="description"
                v-model="form.description"
                filled
                :rules="[val => !!val || 'Descrição é obrigatória']"
                placeholder="Ex: Salário mensal, Supermercado, etc."
              />
            </div>
          </div>

          <!-- Investimento (Apenas para Despesas) -->
          <div v-if="type === 'expense'" class="form-section">
            <div class="section-title">
              <q-checkbox
                v-model="form.isInvestment"
                label="É um investimento?"
              />
            </div>
            
            <div v-if="form.isInvestment" class="investment-options q-pa-md bg-grey-1 rounded-borders">
              <div class="form-row">
                <div class="form-group">
                  <label>Tipo de Investimento</label>
                  <q-select
                    v-model="form.investmentType"
                    :options="investmentOptions"
                    filled
                    label="Selecione o tipo"
                  />
                </div>
                <div class="form-group">
                  <label>Valor BRL - Real *</label>
                  <q-input
                    v-model="form.amountBRL"
                    type="number"
                    min="0"
                    step="0.01"
                    prefix="R$"
                    filled
                    :rules="[val => val > 0 || 'Valor em reais é obrigatório']"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Valor USD - Dólar *</label>
                  <q-input
                    v-model="form.amountUSD"
                    type="number"
                    min="0"
                    step="0.01"
                    prefix="$"
                    filled
                    :rules="[val => val > 0 || 'Valor em dólares é obrigatório']"
                    placeholder="0.00"
                  />
                </div>
                <div class="form-group" v-if="form.investmentType === 'Dólar'">
                  <label>Valor em Dólar (Estimado)</label>
                  <div class="text-h6 q-mt-sm text-primary">
                    $ {{ formatCurrency(convertedValue, 'USD') }}
                  </div>
                  <div class="text-caption text-grey">Cotação: R$ {{ dollarRate.toFixed(4) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Método de Pagamento -->
          <div class="form-section">
            <div class="section-title">Método de Pagamento</div>
            <div class="payment-methods">
              <q-btn-toggle
                v-model="form.paymentMethod"
                :options="paymentMethods"
                spread
                :color="type === 'income' ? 'positive' : 'negative'"
                class="payment-toggle"
              />
            </div>
          </div>

          <!-- Cartão de Crédito (se aplicável) -->
          <div v-if="form.paymentMethod === 'credit_card'" class="form-section">
            <div class="section-title">Cartão de Crédito</div>
            <q-select
              v-model="form.creditCardId"
              :options="creditCardOptions"
              filled
              label="Selecione o cartão"
              :rules="[val => !!val || 'Selecione um cartão']"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="credit_card" :color="scope.opt.color" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>
                      Limite: R$ {{ formatCurrency(scope.opt.limit) }} | 
                      Disponível: R$ {{ formatCurrency(scope.opt.available) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Recorrência -->
          <div class="form-section">
            <div class="section-title">
              <q-checkbox
                v-model="form.recurring.isRecurring"
                label="Transação Recorrente"
              />
            </div>
            
            <div v-if="form.recurring.isRecurring" class="recurring-options">
              <div class="form-row">
                <div class="form-group">
                  <label>Frequência</label>
                  <q-select
                    v-model="form.recurring.frequency"
                    :options="frequencyOptions"
                    filled
                  />
                </div>
                <div class="form-group">
                  <label>Data Final (opcional)</label>
                  <q-input
                    v-model="form.recurring.endDate"
                    type="date"
                    filled
                  />
                </div>
              </div>
              <div class="recurring-preview">
                <q-icon name="calendar_today" />
                <span>Próximas ocorrências:</span>
                <div class="occurrence-dates">
                  <span v-for="date in nextOccurrences" :key="date">
                    {{ formatDate(date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tags e Anexos -->
          <div class="form-section">
            <div class="section-title">Detalhes Adicionais</div>
            <div class="form-row">
              <div class="form-group">
                <label>Tags</label>
                <q-select
                  v-model="form.tags"
                  multiple
                  :options="tagOptions"
                  use-chips
                  use-input
                  @filter="filterTags"
                  filled
                  hint="Pressione enter para adicionar"
                />
              </div>

              <div class="form-group">
                <label>Anexos</label>
                <q-file
                  v-model="form.attachments"
                  multiple
                  filled
                  label="Clique para anexar arquivos"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  max-files="5"
                  max-file-size="5242880"
                  @rejected="onFileRejected"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
            </div>
          </div>

          <!-- Notas -->
          <div class="form-section">
            <label for="notes">Notas (opcional)</label>
            <q-input
              id="notes"
              v-model="form.notes"
              type="textarea"
              filled
              autogrow
              placeholder="Adicione observações sobre esta transação..."
              rows="3"
            />
          </div>

          <!-- Resumo -->
          <div class="summary-section">
            <div class="summary-title">Resumo da Transação</div>
            <div class="summary-details">
              <div class="summary-item">
                <span>Tipo:</span>
                <span :class="type === 'income' ? 'positive' : 'negative'">
                  {{ type === 'income' ? 'Receita' : 'Despesa' }}
                </span>
              </div>
              <div class="summary-item">
                <span>Valor:</span>
                <span class="amount">{{ currencySymbol }} {{ formatCurrency(form.amount) }}</span>
              </div>
              <div class="summary-item">
                <span>Categoria:</span>
                <span>{{ getCategoryName(form.category) || 'Não selecionada' }}</span>
              </div>
              <div class="summary-item">
                <span>Data:</span>
                <span>{{ form.date ? formatDate(form.date) : 'Não selecionada' }}</span>
              </div>
              <div v-if="form.isInvestment" class="summary-item">
                <span>Investimento:</span>
                <span>{{ form.investmentType }}</span>
              </div>
              <div v-if="form.recurring.isRecurring" class="summary-item">
                <span>Recorrência:</span>
                <span>{{ getFrequencyLabel(form.recurring.frequency) }}</span>
              </div>
            </div>
          </div>

          <!-- Ações do Formulário -->
          <div class="form-actions">
            <q-btn
              label="Cancelar"
              flat
              color="negative"
              @click="$emit('close')"
            />
            <q-btn
              :label="editingTransaction ? 'Atualizar' : 'Salvar'"
              type="submit"
              :color="type === 'income' ? 'positive' : 'negative'"
              :loading="submitting"
            />
            <q-btn
              v-if="!editingTransaction"
              label="Salvar e Adicionar Outra"
              type="button"
              color="primary"
              flat
              @click="saveAndAddAnother"
              :loading="submitting"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Modal de Nova Categoria -->
    <q-dialog v-model="showCategoryModal">
      <CategoryModal @submit="handleCategorySubmit" />
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useCategoryStore } from '@/stores/category'
import { useCardStore } from '@/stores/card'
import CategoryModal from '@/components/modals/CategoryModal.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'

const $q = useQuasar()
const categoryStore = useCategoryStore()
const cardStore = useCardStore()

const props = defineProps({
  editingTransaction: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'close'])

const type = ref('expense')
const showCategoryModal = ref(false)
const submitting = ref(false)
const allCategories = ref([])
const filteredCategories = ref([])
const allTags = ref([])
const filteredTags = ref([])

const form = ref({
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  category: '',
  description: '',
  paymentMethod: 'cash',
  creditCardId: null,
  recurring: {
    isRecurring: false,
    frequency: 'monthly',
    endDate: ''
  },
  isInvestment: false,
  investmentType: 'CDI',
  amountBRL: 0,
  amountUSD: 0,
  tags: [],
  attachments: [],
  notes: ''
})

// Initialize form if editing
if (props.editingTransaction) {
  const trans = props.editingTransaction
  type.value = trans.type
  form.value = {
    amount: trans.amount,
    date: trans.date.split('T')[0],
    category: trans.category,
    description: trans.description,
    paymentMethod: trans.paymentMethod || 'cash',
    creditCardId: trans.creditCard || null,
    recurring: {
      isRecurring: trans.recurring?.isRecurring || false,
      frequency: trans.recurring?.frequency || 'monthly',
      endDate: trans.recurring?.endDate?.split('T')[0] || ''
    },
    isInvestment: trans.isInvestment || false,
    investmentType: trans.investmentType || 'CDI',
    tags: trans.tags || [],
    attachments: [],
    notes: trans.notes || ''
  }
}

// Computed Properties
const currencySymbol = computed(() => 'R$')

const categoryOptions = computed(() => {
  return filteredCategories.value
    .filter(cat => cat.type === type.value)
    .map(cat => ({
      label: cat.name,
      value: cat.id,
      color: cat.color,
      icon: getCategoryIcon(cat.name)
    }))
})

const creditCardOptions = computed(() => {
  return cardStore.cards
    .filter(card => card.isActive)
    .map(card => ({
      label: card.name,
      value: card.id,
      color: card.color,
      limit: card.limit,
      available: card.available
    }))
})

const paymentMethods = [
  { label: 'Dinheiro', value: 'cash', icon: 'payments' },
  { label: 'Cartão de Crédito', value: 'credit_card', icon: 'credit_card' },
  { label: 'Cartão de Débito', value: 'debit_card', icon: 'credit_card' },
  { label: 'Transferência', value: 'bank_transfer', icon: 'account_balance' },
  { label: 'PIX', value: 'pix', icon: 'qr_code' },
  { label: 'Outro', value: 'other', icon: 'more_horiz' }
]

const investmentOptions = ['CDI', 'Dólar', 'Tesouro Direto', 'Ações', 'FIIs', 'Cripto', 'Poupança']

const frequencyOptions = [
  { label: 'Diária', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensal', value: 'monthly' },
  { label: 'Anual', value: 'yearly' }
]

const tagOptions = computed(() => {
  return filteredTags.value.map(tag => ({
    label: tag,
    value: tag
  }))
})

const nextOccurrences = computed(() => {
  if (!form.value.recurring.isRecurring) return []
  
  const occurrences = []
  const startDate = new Date(form.value.date)
  const frequency = form.value.recurring.frequency
  
  for (let i = 1; i <= 3; i++) {
    const nextDate = new Date(startDate)
    
    switch (frequency) {
      case 'daily':
        nextDate.setDate(startDate.getDate() + i)
        break
      case 'weekly':
        nextDate.setDate(startDate.getDate() + (i * 7))
        break
      case 'monthly':
        nextDate.setMonth(startDate.getMonth() + i)
        break
      case 'yearly':
        nextDate.setFullYear(startDate.getFullYear() + i)
        break
    }
    
    // Check if end date is reached
    if (form.value.recurring.endDate) {
      const endDate = new Date(form.value.recurring.endDate)
      if (nextDate > endDate) break
    }
    
    occurrences.push(nextDate.toISOString().split('T')[0])
  }
  
  return occurrences
})

const dollarRate = ref(0)
const convertedValue = ref(0)

async function updateDollarRate() {
  try {
    const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
    const data = await res.json()
    dollarRate.value = parseFloat(data.USDBRL.bid)
  } catch (e) {
    console.error('Erro ao buscar cotação do dólar', e)
  }
}

function updateConversion() {
  if (form.value.investmentType === 'Dólar' && dollarRate.value > 0) {
    convertedValue.value = form.value.amount / dollarRate.value
  } else {
    convertedValue.value = 0
  }
}

watch(() => form.value.amount, updateConversion)
watch(() => form.value.investmentType, async (newVal) => {
  if (newVal === 'Dólar') {
    await updateDollarRate()
  }
  updateConversion()
})

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    cardStore.fetchCards()
  ])
  
  allCategories.value = categoryStore.categories
  filteredCategories.value = allCategories.value
  
  // Load common tags
  allTags.value = [
    'Alimentação', 'Transporte', 'Lazer', 'Trabalho',
    'Casa', 'Saúde', 'Educação', 'Compras',
    'Viagem', 'Presente', 'Urgente', 'Planejado'
  ]
  filteredTags.value = allTags.value
})

// Methods
function getCategoryIcon(categoryName) {
  const iconMap = {
    'Alimentação': 'restaurant',
    'Moradia': 'home',
    'Transporte': 'directions_car',
    'Educação': 'school',
    'Saúde': 'local_hospital',
    'Lazer': 'sports_esports',
    'Salário': 'work',
    'Freelance': 'computer',
    'Investimentos': 'trending_up',
    'Presentes': 'card_giftcard',
    'Outros': 'category'
  }
  return iconMap[categoryName] || 'receipt'
}

function getCategoryName(id) {
  const cat = allCategories.value?.find(c => c.id === id || c.name === id)
  return cat ? cat.name : id
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

function filterTags(val, update) {
  if (val === '') {
    update(() => {
      filteredTags.value = allTags.value
    })
    return
  }
  
  update(() => {
    const search = val.toLowerCase()
    filteredTags.value = allTags.value.filter(
      tag => tag.toLowerCase().includes(search)
    )
  })
}

function getFrequencyLabel(frequency) {
  const labels = {
    daily: 'Diária',
    weekly: 'Semanal',
    monthly: 'Mensal',
    yearly: 'Anual'
  }
  return labels[frequency] || frequency
}

function onFileRejected(rejectedEntries) {
  const messages = rejectedEntries.map(entry => {
    if (entry.failedPropValidation === 'max-file-size') {
      return `Arquivo muito grande: ${entry.file.name} (máximo: 5MB)`
    }
    if (entry.failedPropValidation === 'max-files') {
      return 'Máximo de 5 arquivos permitidos'
    }
    return `Tipo de arquivo não suportado: ${entry.file.name}`
  })
  
  $q.notify({
    type: 'negative',
    message: messages.join(', '),
    timeout: 5000
  })
}

async function submitForm() {
  submitting.value = true
  
  try {
    const transactionData = {
      type: type.value,
      amount: parseFloat(form.value.amount),
      date: form.value.date,
      category: form.value.category,
      description: form.value.description,
      paymentMethod: form.value.paymentMethod,
      creditCardId: form.value.creditCardId,
      recurring: form.value.recurring.isRecurring ? {
        isRecurring: true,
        frequency: form.value.recurring.frequency,
        endDate: form.value.recurring.endDate || null
      } : null,
      isInvestment: form.value.isInvestment,
      investmentType: form.value.isInvestment ? form.value.investmentType : null,
      amountBRL: form.value.isInvestment ? parseFloat(form.value.amountBRL) : null,
      amountUSD: form.value.isInvestment ? parseFloat(form.value.amountUSD) : null,
      tags: form.value.tags,
      notes: form.value.notes
    }
    
    if (props.editingTransaction) {
      transactionData.id = props.editingTransaction.id
    }
    
    emit('submit', transactionData)
    
    if (!props.editingTransaction) {
      resetForm()
    }
    
    $q.notify({
      type: 'positive',
      message: props.editingTransaction ? 
        'Transação atualizada com sucesso' : 
        'Transação criada com sucesso'
    })
    
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar transação'
    })
  } finally {
    submitting.value = false
  }
}

function saveAndAddAnother() {
  submitForm().then(() => {
    // Keep form open for another transaction
    if (!props.editingTransaction) {
      resetForm()
    }
  })
}

function resetForm() {
  form.value = {
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    paymentMethod: 'cash',
    creditCardId: null,
    recurring: {
      isRecurring: false,
      frequency: 'monthly',
      endDate: ''
    },
    isInvestment: false,
    investmentType: 'CDI',
    amountBRL: 0,
    amountUSD: 0,
    tags: [],
    attachments: [],
    notes: ''
  }
}

function handleCategorySubmit(categoryData) {
  categoryStore.createCategory(categoryData).then(() => {
    showCategoryModal.value = false
    $q.notify({
      type: 'positive',
      message: 'Categoria criada com sucesso'
    })
  })
}

// Watch for type changes
watch(type, () => {
  form.value.category = ''
})
</script>

<style scoped>
.transaction-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
}

.form-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.form-section {
  margin-bottom: 25px;
}

.section-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.type-selector {
  display: flex;
  align-items: center;
  gap: 20px;
}

.type-toggle {
  min-width: 120px;
  height: 48px;
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
}

.type-description {
  color: #666;
  font-size: 0.9rem;
  flex: 1;
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

.amount-input {
  font-size: 1.2rem;
  font-weight: 600;
}

.category-actions {
  margin-top: 8px;
  text-align: right;
}

.payment-methods {
  margin-top: 10px;
}

.payment-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.payment-toggle :deep(.q-btn) {
  padding: 10px 5px;
  text-transform: none;
}

.recurring-options {
  margin-top: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.recurring-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.recurring-preview .q-icon {
  color: #2196F3;
}

.occurrence-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 10px;
}

.occurrence-dates span {
  padding: 4px 8px;
  background: #e3f2fd;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #1976d2;
}

.summary-section {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.summary-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.summary-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
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

.summary-item .negative {
  color: #F44336;
}

.summary-item .amount {
  font-size: 1.1rem;
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