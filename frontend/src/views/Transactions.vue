<template>
  <div class="transactions">
    <h1>{{ pageTitle }}</h1>
    
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
          <div v-if="!isCustomCategory">
            <select v-model="newTransaction.category" class="form-control" @change="handleCategoryChange" required>
              <option value="" disabled>Selecione uma categoria</option>
              <option v-for="cat in existingCategories" :key="cat" :value="cat">{{ cat }}</option>
              <option value="__new__">+ Nova Categoria</option>
            </select>
          </div>
          <div v-else>
            <input v-model="newTransaction.category" type="text" required class="form-control" placeholder="Nome da categoria" ref="customCategoryInput">
            <button type="button" @click="cancelCustomCategory" class="btn-link">Selecionar existente</button>
          </div>
        </div>
        
        <div class="form-group">
          <label>Data</label>
          <input v-model="newTransaction.date" type="date" required class="form-control">
        </div>
        
        <button type="submit" :disabled="loading || formLoading" class="btn btn-primary">
          {{ (loading || formLoading) ? 'Adicionando...' : 'Adicionar Transação' }}
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
          <tr v-for="transaction in filteredTransactions" :key="transaction._id || transaction.id">
            <td>{{ formatDate(transaction.date) }}</td>
            <td>{{ transaction.description || 'Sem descrição' }}</td>
            <td>{{ getCategoryName(transaction.category) }}</td>
            <td>
              <span :class="['type-badge', transaction.type]">
                {{ transaction.type === 'income' ? 'Receita' : 'Despesa' }}
              </span>
            </td>
            <td :class="{ 'negative': transaction.amount < 0, 'positive': transaction.amount > 0 }">
              {{ formatCurrency(transaction.amount, 'BRL') }}
            </td>
            <td>
              <button @click="handleDelete(transaction._id || transaction.id)" class="btn btn-danger btn-sm">
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
import { ref, onMounted, computed, nextTick } from 'vue'
import { useTransactions } from '../composables/useTransactions'
import { useCategories } from '../composables/useCategories'
import { useCategoryStore } from '../stores/category'
import { formatCurrency, formatDate } from '../utils/formatters'

const props = defineProps({
  transactionType: {
    type: String,
    default: null
  }
})

const { transactions, loading, error, fetchTransactions, addTransaction, deleteTransaction } = useTransactions()
const categoryStore = useCategoryStore()
const { fetchCategories, addCategory: createCategory } = useCategories()

const getCategoryName = (category) => {
  if (!category) return 'Sem Categoria';
  if (typeof category === 'object' && category !== null && category.name) {
    return category.name;
  }
  if (typeof category !== 'string') return 'Inválida';

  // 1. Tenta encontrar a categoria na store pelo ID.
  const cat = categoryStore.categories.find(c => c.id === category || c._id === category);
  if (cat) {
    return cat.name;
  }

  // 2. Se não encontrar, verifica se o valor é um formato de ObjectId do MongoDB.
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);
  if (isObjectId) {
    // Se for um ID, mas a categoria não foi encontrada (pode ter sido deletada),
    // retorna um placeholder para não exibir o ID na tela.
    return 'Sem Categoria';
  }

  // 3. Se não for um ID, é provável que seja um nome de categoria antigo (legado). Exibe o nome.
  return category;
};

const formLoading = ref(false)
const showForm = ref(false)
const isCustomCategory = ref(false)
const customCategoryInput = ref(null)

const pageTitle = computed(() => {
  if (props.transactionType === 'income') return 'Receitas'
  if (props.transactionType === 'expense') return 'Despesas'
  return 'Transações'
})

const filteredTransactions = computed(() => {
  // Filtra transações inválidas (sem ID ou mal formadas) para não quebrar a tela
  const validTransactions = (transactions.value || []).filter(t => t && (t.id || t._id))
  
  if (!props.transactionType) return validTransactions
  
  return validTransactions.filter(t => t.type === props.transactionType)
})

const existingCategories = computed(() => {
  const defaults = [
    'Mercado', 'Transporte/Uber', 'Assinaturas', 'Remédios', 
    'Seguro de Celular', 'Shopping', 'Condomínio', 'Psicologia', 
    'Convênio', 'Plano Funerário', 'Enel', 'Financiamento', 
    'Internet', 'Lazer', 'Celular', 'Outros'
  ]
  
  // Pega as categorias salvas no banco (da tela Categories.vue)
  const fromStore = categoryStore.categories ? categoryStore.categories.map(c => c.name) : []
  
  // Pega categorias usadas em transações existentes (para manter histórico)
  const fromTransactions = filteredTransactions.value.map(t => getCategoryName(t.category))
  
  // Junta tudo e remove duplicadas
  const cats = new Set([
    ...defaults,
    ...fromStore,
    ...fromTransactions
  ].filter(Boolean))
  
  return [...cats].sort()
})

const getLocalDateString = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const newTransaction = ref({
  description: '',
  amount: 0,
  type: props.transactionType || 'expense',
  category: '',
  date: getLocalDateString()
})

onMounted(async () => {
  await fetchTransactions()
  await fetchCategories()
})

const handleCategoryChange = async () => {
  if (newTransaction.value.category === '__new__') {
    isCustomCategory.value = true
    newTransaction.value.category = ''
    await nextTick()
    customCategoryInput.value?.focus()
  }
}

const cancelCustomCategory = () => {
  isCustomCategory.value = false
  newTransaction.value.category = ''
}

const handleSubmit = async () => {
  if (!newTransaction.value.date) {
    alert('Por favor, selecione uma data válida.')
    return
  }

  formLoading.value = true
  try {
    // Cria a data ao meio-dia local para evitar problemas de fuso horário (UTC shift)
    const [year, month, day] = newTransaction.value.date.split('-').map(Number)
    const dateAdjusted = new Date(year, month - 1, day, 12, 0, 0)

    // Encontra o ID da categoria baseado no nome selecionado
    let categoryId = newTransaction.value.category
    const categories = categoryStore.categories || []
    const selectedCategoryObj = categories.find(c => c.name === newTransaction.value.category)
    
    if (selectedCategoryObj) {
      categoryId = selectedCategoryObj._id || selectedCategoryObj.id
    } else if (newTransaction.value.category) {
      // Se a categoria não existe (ex: digitada manualmente), cria ela antes
      const newCat = await createCategory({ name: newTransaction.value.category, type: newTransaction.value.type })
      if (newCat && (newCat._id || newCat.id)) categoryId = newCat._id || newCat.id
    }

    await addTransaction({
      ...newTransaction.value,
      category: categoryId,
      date: dateAdjusted,
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
      date: getLocalDateString()
    }
    isCustomCategory.value = false
    showForm.value = false
  } catch (err) {
    console.error('Error adding transaction:', err)
    alert('Erro ao adicionar transação. Verifique os dados e tente novamente.')
  } finally {
    formLoading.value = false
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

.btn-link {
  background: none;
  border: none;
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-top: 5px;
  font-size: 0.9em;
}
</style>