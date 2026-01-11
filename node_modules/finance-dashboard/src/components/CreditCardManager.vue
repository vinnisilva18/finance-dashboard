<template>
  <div class="credit-card-manager">
    <q-card class="main-card">
      <q-card-section>
        <div class="header">
          <h2>Cartões de Crédito</h2>
          <q-btn 
            color="primary" 
            icon="add_card" 
            label="Novo Cartão" 
            @click="showAddModal = true"
          />
        </div>

        <div class="cards-grid">
          <q-card 
            v-for="card in creditCards" 
            :key="card.id"
            class="credit-card"
            :style="{
              background: card.color 
                ? `linear-gradient(135deg, ${card.color}40, ${card.color}20)`
                : 'linear-gradient(135deg, #667eea40, #764ba220)',
              borderLeft: `4px solid ${card.color || '#667eea'}`
            }"
          >
            <q-card-section>
              <div class="card-header">
                <div class="card-info">
                  <div class="card-icon">
                    <q-icon name="credit_card" size="28px" />
                  </div>
                  <div>
                    <h3>{{ card.name }}</h3>
                    <div class="card-meta">
                      <span>Limite: R$ {{ formatCurrency(card.limit) }}</span>
                      <q-icon name="circle" size="4px" />
                      <span>Final {{ card.lastFourDigits }}</span>
                    </div>
                  </div>
                </div>
                <div class="card-actions">
                  <q-btn 
                    icon="edit" 
                    flat 
                    round 
                    @click="editCard(card)"
                  />
                  <q-btn 
                    icon="delete" 
                    flat 
                    round 
                    color="negative"
                    @click="confirmDelete(card.id)"
                  />
                </div>
              </div>

              <div class="card-details">
                <div class="detail">
                  <q-icon name="calendar_today" size="16px" />
                  <span>Fechamento: {{ formatDate(card.closingDate) }}</span>
                </div>
                <div class="detail">
                  <q-icon name="event" size="16px" />
                  <span>Vencimento: {{ formatDate(card.dueDate) }}</span>
                </div>
              </div>

              <div class="usage-section">
                <div class="usage-header">
                  <span>Utilização do Limite</span>
                  <span>{{ calculateUsagePercentage(card) }}%</span>
                </div>
                <q-linear-progress 
                  :value="card.used / card.limit" 
                  :color="getUsageColor(card)"
                  size="15px"
                  rounded
                />
                <div class="usage-details">
                  <div>
                    <small>Utilizado</small>
                    <div class="amount negative">R$ {{ formatCurrency(card.used) }}</div>
                  </div>
                  <div>
                    <small>Disponível</small>
                    <div class="amount positive">R$ {{ formatCurrency(card.available) }}</div>
                  </div>
                </div>
              </div>

              <!-- Próximas Faturas -->
              <div v-if="card.nextInvoices && card.nextInvoices.length > 0" class="invoices-section">
                <div class="section-title">
                  <q-icon name="receipt" />
                  <span>Próximas Faturas</span>
                </div>
                <div v-for="invoice in card.nextInvoices.slice(0, 2)" :key="invoice.id" class="invoice-item">
                  <div class="invoice-date">{{ formatDate(invoice.dueDate) }}</div>
                  <div class="invoice-amount">
                    <span :class="{ 'overdue': isInvoiceOverdue(invoice) }">
                      R$ {{ formatCurrency(invoice.amount) }}
                    </span>
                    <q-chip 
                      v-if="isInvoiceOverdue(invoice)"
                      size="sm"
                      color="negative"
                      text-color="white"
                    >
                      Atrasada
                    </q-chip>
                    <q-chip 
                      v-else-if="isInvoiceDueSoon(invoice)"
                      size="sm"
                      color="warning"
                      text-color="white"
                    >
                      Vence em {{ daysUntilDue(invoice) }} dias
                    </q-chip>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn 
                flat 
                label="Ver Faturas" 
                color="primary"
                @click="viewInvoices(card)"
              />
              <q-btn 
                flat 
                label="Adicionar Transação" 
                color="positive"
                @click="addTransactionToCard(card)"
              />
            </q-card-actions>
          </q-card>

          <div v-if="creditCards.length === 0" class="empty-state">
            <q-icon name="credit_card_off" size="64px" color="grey-5" />
            <p>Nenhum cartão de crédito cadastrado</p>
            <p class="subtitle">Adicione seu primeiro cartão para começar a gerenciar suas faturas</p>
            <q-btn 
              color="primary" 
              icon="add_card" 
              label="Adicionar Cartão" 
              @click="showAddModal = true"
            />
          </div>
        </div>

        <!-- Resumo Total -->
        <div v-if="creditCards.length > 0" class="summary-section">
          <q-card class="summary-card">
            <q-card-section>
              <h3>Resumo dos Cartões</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-label">Limite Total</div>
                  <div class="summary-value">R$ {{ formatCurrency(totalLimit) }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Utilizado Total</div>
                  <div class="summary-value negative">R$ {{ formatCurrency(totalUsed) }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Disponível Total</div>
                  <div class="summary-value positive">R$ {{ formatCurrency(totalAvailable) }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Utilização Média</div>
                  <div class="summary-value" :class="getAverageUsageClass">
                    {{ averageUsagePercentage.toFixed(1) }}%
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal Adicionar/Editar Cartão -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">
            {{ editingCard ? 'Editar Cartão' : 'Novo Cartão de Crédito' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveCard" class="q-gutter-md">
            <div class="form-row">
              <q-input
                v-model="cardForm.name"
                label="Nome do Cartão"
                :rules="[val => !!val || 'Nome é obrigatório']"
                filled
                class="col-6"
              />
              <q-input
                v-model="cardForm.lastFourDigits"
                label="Últimos 4 dígitos"
                mask="####"
                :rules="[val => val.length === 4 || 'Digite os 4 últimos dígitos']"
                filled
                class="col-6"
              />
            </div>

            <q-input
              v-model="cardForm.limit"
              label="Limite do Cartão"
              type="number"
              min="0"
              step="0.01"
              prefix="R$"
              :rules="[val => val > 0 || 'Limite deve ser maior que zero']"
              filled
            />

            <div class="form-row">
              <q-input
                v-model="cardForm.closingDate"
                label="Dia do Fechamento"
                type="number"
                min="1"
                max="31"
                :rules="[val => val >= 1 && val <= 31 || 'Dia inválido']"
                filled
                class="col-6"
              />
              <q-input
                v-model="cardForm.dueDate"
                label="Dia do Vencimento"
                type="number"
                min="1"
                max="31"
                :rules="[val => val >= 1 && val <= 31 || 'Dia inválido']"
                filled
                class="col-6"
              />
            </div>

            <div class="color-picker">
              <label>Cor do Cartão</label>
              <div class="color-options">
                <div
                  v-for="color in cardColors"
                  :key="color"
                  class="color-option"
                  :style="{ backgroundColor: color }"
                  :class="{ selected: cardForm.color === color }"
                  @click="cardForm.color = color"
                >
                  <q-icon v-if="cardForm.color === color" name="check" color="white" />
                </div>
              </div>
            </div>

            <q-checkbox
              v-model="cardForm.isActive"
              label="Cartão ativo"
            />

            <div class="dialog-actions">
              <q-btn 
                label="Cancelar" 
                flat 
                v-close-popup 
                color="negative"
              />
              <q-btn 
                :label="editingCard ? 'Atualizar' : 'Salvar'" 
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
          <p>Tem certeza que deseja excluir este cartão?</p>
          <p class="text-negative">Todas as transações associadas serão mantidas, mas perderão a referência ao cartão.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn 
            flat 
            label="Excluir" 
            color="negative" 
            @click="deleteCard"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCardStore } from '@/stores/card'
import { useQuasar } from 'quasar'
import { formatCurrency, formatDate } from '@/utils/formatters'

const $q = useQuasar()
const cardStore = useCardStore()

const showModal = ref(false)
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const editingCard = ref(null)
const cardToDelete = ref(null)

const cardForm = ref({
  name: '',
  lastFourDigits: '',
  limit: 0,
  closingDate: 1,
  dueDate: 10,
  color: '#667eea',
  isActive: true
})

const cardColors = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c',
  '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
  '#fa709a', '#fee140', '#ff9a9e', '#a18cd1'
]

const creditCards = computed(() => cardStore.cards)

const totalLimit = computed(() => {
  return creditCards.value.reduce((sum, card) => sum + card.limit, 0)
})

const totalUsed = computed(() => {
  return creditCards.value.reduce((sum, card) => sum + card.used, 0)
})

const totalAvailable = computed(() => {
  return creditCards.value.reduce((sum, card) => sum + card.available, 0)
})

const averageUsagePercentage = computed(() => {
  if (creditCards.value.length === 0) return 0
  const total = creditCards.value.reduce((sum, card) => sum + (card.used / card.limit), 0)
  return (total / creditCards.value.length) * 100
})

const getAverageUsageClass = computed(() => {
  if (averageUsagePercentage.value >= 80) return 'negative'
  if (averageUsagePercentage.value >= 60) return 'warning'
  return 'positive'
})

onMounted(async () => {
  await cardStore.fetchCards()
})

function calculateUsagePercentage(card) {
  return Math.round((card.used / card.limit) * 100)
}

function getUsageColor(card) {
  const percentage = calculateUsagePercentage(card)
  if (percentage >= 90) return 'negative'
  if (percentage >= 70) return 'warning'
  return 'positive'
}

function isInvoiceOverdue(invoice) {
  const today = new Date()
  const dueDate = new Date(invoice.dueDate)
  return dueDate < today && !invoice.paid
}

function isInvoiceDueSoon(invoice) {
  const today = new Date()
  const dueDate = new Date(invoice.dueDate)
  const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
  return daysDiff <= 7 && daysDiff > 0 && !invoice.paid
}

function daysUntilDue(invoice) {
  const today = new Date()
  const dueDate = new Date(invoice.dueDate)
  return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
}

function editCard(card) {
  editingCard.value = card
  cardForm.value = { ...card }
  showModal.value = true
}

function confirmDelete(cardId) {
  cardToDelete.value = cardId
  showDeleteModal.value = true
}

async function deleteCard() {
  try {
    await cardStore.deleteCard(cardToDelete.value)
    $q.notify({
      type: 'positive',
      message: 'Cartão excluído com sucesso'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao excluir cartão'
    })
  } finally {
    showDeleteModal.value = false
    cardToDelete.value = null
  }
}

async function saveCard() {
  try {
    if (editingCard.value) {
      await cardStore.updateCard({
        id: editingCard.value.id,
        ...cardForm.value
      })
      $q.notify({
        type: 'positive',
        message: 'Cartão atualizado com sucesso'
      })
    } else {
      await cardStore.createCard(cardForm.value)
      $q.notify({
        type: 'positive',
        message: 'Cartão criado com sucesso'
      })
    }
    
    showModal.value = false
    resetForm()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar cartão'
    })
  }
}

function resetForm() {
  cardForm.value = {
    name: '',
    lastFourDigits: '',
    limit: 0,
    closingDate: 1,
    dueDate: 10,
    color: '#667eea',
    isActive: true
  }
  editingCard.value = null
}

function viewInvoices(card) {
  // Navegar para página de faturas do cartão
  console.log('View invoices for card:', card.id)
  // router.push(`/cards/${card.id}/invoices`)
}

function addTransactionToCard(card) {
  // Abrir modal de transação pré-preenchido com o cartão
  console.log('Add transaction to card:', card.id)
  // emit('add-transaction', { creditCardId: card.id })
}
</script>

<style scoped>
.credit-card-manager {
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.credit-card {
  transition: transform 0.3s ease;
}

.credit-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(0,0,0,0.7);
  margin-top: 5px;
}

.card-actions {
  display: flex;
  gap: 5px;
}

.card-details {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.detail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.usage-section {
  margin-bottom: 20px;
}

.usage-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}

.usage-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}

.amount {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 5px;
}

.amount.positive {
  color: #4CAF50;
}

.amount.negative {
  color: #F44336;
}

.invoices-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 10px;
}

.invoice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.invoice-item:last-child {
  border-bottom: none;
}

.invoice-date {
  font-size: 0.9rem;
}

.invoice-amount {
  display: flex;
  align-items: center;
  gap: 10px;
}

.invoice-amount .overdue {
  color: #F44336;
  font-weight: 600;
}

.summary-section {
  margin-top: 30px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.summary-item {
  text-align: center;
  padding: 15px;
  background: rgba(0,0,0,0.02);
  border-radius: 8px;
}

.summary-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row > * {
  flex: 1;
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
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 8px;
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
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin-top: 10px;
  font-size: 1.1rem;
}

.empty-state .subtitle {
  font-size: 0.9rem;
  margin-bottom: 20px;
  color: #777;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .color-options {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>