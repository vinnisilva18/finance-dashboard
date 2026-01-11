<template>
  <div class="credit-cards">
    <div class="header">
      <h1>Cartões de Crédito</h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? 'Cancelar' : '+ Adicionar Cartão' }}
      </button>
    </div>

    <div class="summary-cards">
      <div class="summary-card">
        <h3>Limite de Crédito Total</h3>
        <p class="amount">{{ formatCurrency(totalCreditLimit) }}</p>
      </div>
      <div class="summary-card">
        <h3>Saldo Total</h3>
        <p class="amount">{{ formatCurrency(totalBalance) }}</p>
      </div>
      <div class="summary-card">
        <h3>Crédito Disponível</h3>
        <p class="amount positive">{{ formatCurrency(availableCredit) }}</p>
      </div>
      <div class="summary-card">
        <h3>Taxa de Utilização</h3>
        <p class="amount" :class="utilizationRate > 0.3 ? 'negative' : 'positive'">
          {{ (utilizationRate * 100).toFixed(1) }}%
        </p>
      </div>
    </div>

    <div v-if="showForm" class="card-form card">
      <h3>{{ editingCard ? 'Editar Cartão de Crédito' : 'Adicionar Novo Cartão de Crédito' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label>Nome do Cartão</label>
            <input v-model="formData.name" type="text" required class="form-control" placeholder="ex: Visa Platinum">
          </div>
          
          <div class="form-group">
            <label>Tipo de Cartão</label>
            <select v-model="formData.type" class="form-control" required>
              <option value="visa">Visa</option>
              <option value="mastercard">MasterCard</option>
              <option value="amex">American Express</option>
              <option value="discover">Discover</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Últimos 4 Dígitos</label>
            <input v-model="formData.lastFourDigits" type="text" maxlength="4" required class="form-control" placeholder="1234">
          </div>
          
          <div class="form-group">
            <label>Limite de Crédito</label>
            <input v-model.number="formData.limit" type="number" step="0.01" required class="form-control" placeholder="10000">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Saldo Atual</label>
            <input v-model.number="formData.balance" type="number" step="0.01" required class="form-control" placeholder="4500">
          </div>
          
          <div class="form-group">
            <label>Data de Vencimento</label>
            <input v-model="formData.dueDate" type="date" required class="form-control">
          </div>
        </div>

        <div class="form-group">
          <label>Cor do Cartão</label>
          <div class="color-picker">
            <input v-model="formData.color" type="color" class="color-input">
            <span class="color-preview" :style="{ backgroundColor: formData.color }"></span>
            <span>{{ formData.color }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Salvando...' : (editingCard ? 'Atualizar Cartão' : 'Adicionar Cartão') }}
          </button>
          <button v-if="editingCard" @click="cancelEdit" type="button" class="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div v-if="loading && !showForm" class="loading">Carregando cartões de crédito...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="cards-grid">
      <div v-for="card in cards" :key="card.id" class="credit-card-item">
        <div class="card-front" :style="{ background: `linear-gradient(135deg, ${card.color}, ${adjustColor(card.color, -20)})` }">
          <div class="card-header">
            <div class="card-type">
              <span v-if="card.type === 'visa'" class="card-logo visa">VISA</span>
              <span v-if="card.type === 'mastercard'" class="card-logo mastercard">MasterCard</span>
              <span v-if="card.type === 'amex'" class="card-logo amex">Amex</span>
              <span v-if="card.type === 'discover'" class="card-logo discover">Discover</span>
            </div>
            <div class="card-actions">
              <button @click="editCard(card)" class="btn-icon" title="Editar">
                ✏️
              </button>
              <button @click="handleDelete(card.id)" class="btn-icon" title="Excluir">
                🗑️
              </button>
            </div>
          </div>
          
          <div class="card-number">
            {{ card.number }}
          </div>
          
          <div class="card-footer">
            <div class="card-info">
              <div class="card-name">{{ card.name }}</div>
              <div class="card-due">Vencimento: {{ formatDate(card.dueDate) }}</div>
            </div>
            <div class="card-balance">
              {{ formatCurrency(card.balance) }}
            </div>
          </div>
        </div>
        
        <div class="card-details">
          <div class="detail-row">
            <span class="label">Limite de Crédito:</span>
            <span class="value">{{ formatCurrency(card.limit) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Disponível:</span>
            <span class="value positive">{{ formatCurrency(card.limit - card.balance) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Utilização:</span>
            <span class="value" :class="(card.balance / card.limit) > 0.3 ? 'negative' : ''">
              {{ ((card.balance / card.limit) * 100).toFixed(1) }}%
            </span>
          </div>
          <div class="detail-row">
            <span class="label">Próximo Pagamento:</span>
            <span class="value">{{ daysUntilDue(card.dueDate) }} dias</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="cards.length === 0 && !loading" class="empty-state">
      <div class="empty-icon">💳</div>
      <h3>Nenhum Cartão de Crédito</h3>
      <p>Adicione seu primeiro cartão de crédito para começar</p>
      <button @click="showForm = true" class="btn btn-primary">
        Adicionar Primeiro Cartão
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useCards } from '../composables/useCards'
import { formatCurrency, formatDate } from '../utils/formatters'

const { 
  cards, 
  loading, 
  error, 
  fetchCards, 
  addCard,
  updateCard,
  deleteCard,
  totalCreditLimit,
  totalBalance,
  availableCredit,
  utilizationRate
} = useCards()

const showForm = ref(false)
const editingCard = ref(null)

const initialFormData = {
  name: '',
  type: 'visa',
  lastFourDigits: '',
  limit: 10000,
  balance: 0,
  dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
  color: '#1a237e'
}

const formData = reactive({ ...initialFormData })

onMounted(() => {
  fetchCards()
})

const adjustColor = (color, amount) => {
  const num = parseInt(color.slice(1), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

const handleSubmit = async () => {
  if (editingCard.value) {
    await updateCard(editingCard.value.id, {
      ...formData,
      number: `**** **** **** ${formData.lastFourDigits}` // Keep number format consistent
    })
  } else {
    await addCard(formData)
  }
  
  resetForm()
  showForm.value = false
  editingCard.value = null
}

const editCard = (card) => {
  editingCard.value = card
  formData.name = card.name
  formData.type = card.type
  formData.lastFourDigits = card.number.slice(-4)
  formData.limit = card.limit
  formData.balance = card.balance
  formData.dueDate = card.dueDate
  formData.color = card.color
  showForm.value = true
}

const cancelEdit = () => {
  editingCard.value = null
  resetForm()
  showForm.value = false
}

const resetForm = () => {
  Object.assign(formData, initialFormData)
  formData.dueDate = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
}

const handleDelete = async (id) => {
  if (confirm('Tem certeza que deseja excluir este cartão de crédito?')) {
    await deleteCard(id)
  }
}

const daysUntilDue = (dueDate) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}
</script>

<style scoped>
.credit-cards {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.summary-cards {
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.credit-card-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.credit-card-item:hover {
  transform: translateY(-4px);
}

.card-front {
  padding: 25px;
  color: white;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-logo {
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 1px;
}

.visa {
  color: #1a1f71;
}

.mastercard {
  color: #ff5f00;
}

.amex {
  color: #2e77bb;
}

.discover {
  color: #ff6000;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 1em;
  backdrop-filter: blur(5px);
  transition: background 0.2s;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.3);
}

.card-number {
  font-size: 1.8em;
  letter-spacing: 4px;
  text-align: center;
  font-family: 'Courier New', monospace;
  margin: 20px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.card-name {
  font-size: 1.1em;
  font-weight: 500;
}

.card-due {
  font-size: 0.9em;
  opacity: 0.9;
}

.card-balance {
  font-size: 1.3em;
  font-weight: bold;
}

.card-details {
  padding: 20px;
  background: white;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  color: #666;
  font-size: 0.9em;
}

.detail-row .value {
  font-weight: 600;
  color: #333;
}

.card-form {
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