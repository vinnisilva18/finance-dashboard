<template>
  <div class="transactions">
    <h1>Transações</h1>
    
    <div class="controls">
      <button @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? 'Cancelar' : 'Adicionar Transação' }}
      </button>
    </div>

    <div v-if="showForm" class="transaction-form card">
      <h3>Adicionar Nova Transação</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Descrição</label>
          <input v-model="newTransaction.description" type="text" required class="form-control">
        </div>
        
        <div class="form-group">
          <label>Valor</label>
          <input v-model.number="newTransaction.amount" type="number" step="0.01" required class="form-control">
        </div>
        
        <div class="form-group">
          <label>Tipo</label>
          <select v-model="newTransaction.type" class="form-control">
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Categoria</label>
          <input v-model="newTransaction.category" type="text" required class="form-control">
        </div>
        
        <div class="form-group">
          <label>Data</label>
          <input v-model="newTransaction.date" type="date" required class="form-control">
        </div>
        
        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Adicionando...' : 'Adicionar Transação' }}
        </button>
      </form>
    </div>

    <div v-if="loading" class="loading">Carregando...</div>
    
    <div v-if="error" class="error">{{ error }}</div>

    <div class="transactions-list">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ formatDate(transaction.date) }}</td>
            <td>{{ transaction.description }}</td>
            <td>{{ transaction.category }}</td>
            <td>
              <span :class="['type-badge', transaction.type]">
                {{ transaction.type === 'income' ? 'Receita' : 'Despesa' }}
              </span>
            </td>
            <td :class="{ 'negative': transaction.amount < 0, 'positive': transaction.amount > 0 }">
              {{ formatCurrency(transaction.amount, 'BRL') }}
            </td>
            <td>
              <button @click="handleDelete(transaction.id)" class="btn btn-danger btn-sm">
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTransactions } from '../composables/useTransactions'
import { formatCurrency, formatDate } from '../utils/formatters'

const { transactions, loading, error, fetchTransactions, addTransaction, deleteTransaction } = useTransactions()

const showForm = ref(false)
const newTransaction = ref({
  description: '',
  amount: 0,
  type: 'expense',
  category: '',
  date: new Date().toISOString().split('T')[0]
})

onMounted(() => {
  fetchTransactions()
})

const handleSubmit = async () => {
  try {
    await addTransaction({
      ...newTransaction.value,
      amount: newTransaction.value.type === 'expense' 
        ? -Math.abs(newTransaction.value.amount)
        : Math.abs(newTransaction.value.amount)
    })
    
    // Reset form
    newTransaction.value = {
      description: '',
      amount: 0,
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0]
    }
    showForm.value = false
  } catch (err) {
    console.error('Error adding transaction:', err)
  }
}

const handleDelete = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    await deleteTransaction(id)
  }
}
</script>

<style scoped>
.transactions {
  padding: 20px;
}

.transactions h1 {
  color: #4b5563;
  margin-bottom: 1rem;
}

.transactions h3 {
  color: #4b5563;
  margin-bottom: 1rem;
}

.controls {
  margin-bottom: 20px;
}

.transaction-form {
  margin-bottom: 30px;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  text-transform: capitalize;
}

.type-badge.income {
  background: #d4edda;
  color: #155724;
}

.type-badge.expense {
  background: #f8d7da;
  color: #721c24;
}

.positive {
  color: #16a34a;
}

.negative {
  color: #dc2626;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.8em;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}
</style>