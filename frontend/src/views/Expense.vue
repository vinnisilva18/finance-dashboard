<template>
  <div class="expense-view">
    <div class="view-header">
      <div class="header-content">
        <h1 class="view-title">
          <q-icon name="trending_down" class="title-icon" />
          Despesas
        </h1>
        <p class="view-subtitle">Todas as despesas que saíram da sua conta</p>
      </div>
      <div class="header-actions">
        <q-btn
          icon="add"
          label="Nova Despesa"
          color="negative"
          @click="showTransactionForm = true"
          class="add-btn"
        />
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="filters-row">
        <div class="search-group">
          <q-input
            v-model="searchQuery"
            placeholder="Buscar despesas..."
            outlined
            dense
            class="search-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="filter-group">
          <q-select
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="Todas as categorias"
            outlined
            dense
            clearable
            class="category-filter"
          />
        </div>

        <div class="date-group">
          <q-input
            v-model="dateRange"
            type="date"
            range
            outlined
            dense
            placeholder="Selecionar período"
            class="date-filter"
          />
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-icon negative">
          <q-icon name="money_off" />
        </div>
        <div class="card-content">
          <div class="card-value">{{ formatCurrency(totalExpense) }}</div>
          <div class="card-label">Total Despesas</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon info">
          <q-icon name="receipt" />
        </div>
        <div class="card-content">
          <div class="card-value">{{ expenseTransactions.length }}</div>
          <div class="card-label">Transações</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon warning">
          <q-icon name="trending_down" />
        </div>
        <div class="card-content">
          <div class="card-value">{{ formatCurrency(averageExpense) }}</div>
          <div class="card-label">Média por Transação</div>
        </div>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="transactions-section">
      <div class="section-header">
        <h3>Lista de Despesas</h3>
        <div class="view-options">
          <q-btn-toggle
            v-model="viewMode"
            :options="viewOptions"
            flat
            dense
            class="view-toggle"
          />
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewMode === 'list'" class="transactions-list">
        <div v-if="filteredTransactions.length === 0" class="empty-state">
          <q-icon name="receipt_long" size="4rem" color="grey-5" />
          <h4>Nenhuma despesa encontrada</h4>
          <p>Adicione sua primeira despesa clicando no botão acima</p>
        </div>

        <div v-for="transaction in filteredTransactions" :key="transaction._id || transaction.id"
             class="transaction-item"
             @click="editTransaction(transaction)">
          <div class="transaction-icon">
            <q-icon :name="getCategoryIcon(transaction.category)" />
          </div>
          <div class="transaction-content">
            <div class="transaction-header">
              <h4>{{ transaction.description }}</h4>
              <div class="transaction-amount negative">
                -{{ formatCurrency(transaction.amount) }}
              </div>
            </div>
            <div class="transaction-meta">
              <span class="category">{{ getCategoryName(transaction.category) }}</span>
              <span class="date">{{ formatDate(transaction.date) }}</span>
              <span v-if="transaction.paymentMethod" class="payment-method">
                {{ getPaymentMethodLabel(transaction.paymentMethod) }}
              </span>
              <span v-if="transaction.isInvestment" class="investment-badge">
                <q-icon name="trending_up" size="sm" />
                {{ transaction.investmentType }}
              </span>
            </div>
            <div v-if="transaction.notes" class="transaction-notes">
              {{ transaction.notes }}
            </div>
          </div>
          <div class="transaction-actions">
            <q-btn
              icon="edit"
              flat
              round
              dense
              size="sm"
              @click.stop="editTransaction(transaction)"
            />
            <q-btn
              icon="delete"
              flat
              round
              dense
              size="sm"
              color="negative"
              @click.stop="deleteTransaction(transaction._id || transaction.id)"
            />
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="transactions-grid">
        <div v-if="filteredTransactions.length === 0" class="empty-state">
          <q-icon name="receipt_long" size="4rem" color="grey-5" />
          <h4>Nenhuma despesa encontrada</h4>
          <p>Adicione sua primeira despesa clicando no botão acima</p>
        </div>

        <div v-for="transaction in filteredTransactions" :key="transaction._id || transaction.id"
             class="transaction-card"
             @click="editTransaction(transaction)">
          <div class="card-header">
            <div class="card-icon">
              <q-icon :name="getCategoryIcon(transaction.category)" />
            </div>
            <div class="card-actions">
              <q-btn
                icon="edit"
                flat
                round
                dense
                size="sm"
                @click.stop="editTransaction(transaction)"
              />
              <q-btn
                icon="delete"
                flat
                round
                dense
                size="sm"
                color="negative"
                @click.stop="deleteTransaction(transaction._id || transaction.id)"
              />
            </div>
          </div>
          <div class="card-content">
            <h4 class="card-title">{{ transaction.description }}</h4>
            <div class="card-amount negative">
              -{{ formatCurrency(transaction.amount) }}
            </div>
            <div class="card-meta">
              <span class="category">{{ getCategoryName(transaction.category) }}</span>
              <span class="date">{{ formatDate(transaction.date) }}</span>
              <span v-if="transaction.isInvestment" class="investment-indicator">
                <q-icon name="trending_up" size="sm" />
                {{ transaction.investmentType }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Form Modal -->
    <q-dialog v-model="showTransactionForm" persistent>
      <TransactionForm
        :editing-transaction="editingTransaction"
        @submit="handleTransactionSubmit"
        @close="closeTransactionForm"
      />
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">
            Tem certeza que deseja excluir esta despesa?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Excluir"
            color="negative"
            @click="confirmDelete"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import TransactionForm from '@/components/TransactionForm.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'

const $q = useQuasar()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('')
const dateRange = ref('')
const viewMode = ref('list')
const showTransactionForm = ref(false)
const editingTransaction = ref(null)
const showDeleteDialog = ref(false)
const transactionToDelete = ref(null)
const deleting = ref(false)

// Computed properties
const expenseTransactions = computed(() => {
  return transactionStore.transactions.filter(t => t.type === 'expense')
})

const filteredTransactions = computed(() => {
  let transactions = [...expenseTransactions.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    transactions = transactions.filter(t =>
      t.description.toLowerCase().includes(query) ||
      getCategoryName(t.category).toLowerCase().includes(query)
    )
  }

  // Category filter
  if (selectedCategory.value) {
    transactions = transactions.filter(t => t.category === selectedCategory.value)
  }

  // Date range filter
  if (dateRange.value && dateRange.value.from && dateRange.value.to) {
    transactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const fromDate = new Date(dateRange.value.from)
      const toDate = new Date(dateRange.value.to)
      return transactionDate >= fromDate && transactionDate <= toDate
    })
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const categoryOptions = computed(() => {
  return categoryStore.categories
    .filter(cat => cat.type === 'expense')
    .map(cat => ({
      label: cat.name,
      value: cat._id || cat.id
    }))
})

const totalExpense = computed(() => {
  return filteredTransactions.value.reduce((sum, t) => sum + t.amount, 0)
})

const averageExpense = computed(() => {
  const transactions = filteredTransactions.value
  return transactions.length > 0 ? totalExpense.value / transactions.length : 0
})

const viewOptions = [
  { label: 'Lista', value: 'list', icon: 'list' },
  { label: 'Grid', value: 'grid', icon: 'grid_view' }
]

// Methods
const getCategoryIcon = (categoryId) => {
  const category = categoryStore.categories.find(c => c.id === categoryId)
  if (category) {
    return category.icon || 'category'
  }
  return 'category'
}

const getCategoryName = (categoryId) => {
  const category = categoryStore.categories.find(c => c.id === categoryId)
  return category ? category.name : 'Categoria não encontrada'
}

const getPaymentMethodLabel = (method) => {
  const labels = {
    cash: 'Dinheiro',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    bank_transfer: 'Transferência',
    pix: 'PIX',
    other: 'Outro'
  }
  return labels[method] || method
}

const editTransaction = (transaction) => {
  editingTransaction.value = transaction
  showTransactionForm.value = true
}

const closeTransactionForm = () => {
  showTransactionForm.value = false
  editingTransaction.value = null
}

const handleTransactionSubmit = async (transactionData) => {
  try {
    if (editingTransaction.value) {
      await transactionStore.updateTransaction(editingTransaction.value._id || editingTransaction.value.id, transactionData)
      $q.notify({
        type: 'positive',
        message: 'Despesa atualizada com sucesso'
      })
    } else {
      await transactionStore.addTransaction({ ...transactionData, type: 'expense' })
      $q.notify({
        type: 'positive',
        message: 'Despesa adicionada com sucesso'
      })
    }
    closeTransactionForm()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar despesa'
    })
  }
}

const deleteTransaction = (transactionId) => {
  if (!transactionId || transactionId === 'undefined') {
    $q.notify({
      type: 'negative',
      message: 'Erro: ID da transação inválido'
    })
    return
  }
  transactionToDelete.value = transactionId
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await transactionStore.deleteTransaction(transactionToDelete.value)
    $q.notify({
      type: 'positive',
      message: 'Despesa excluída com sucesso'
    })
    showDeleteDialog.value = false
    transactionToDelete.value = null
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao excluir despesa'
    })
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    transactionStore.fetchTransactions(),
    categoryStore.fetchCategories()
  ])
})

// Watchers
watch([searchQuery, selectedCategory, dateRange], () => {
  // Filters will automatically update computed properties
})
</script>

<style scoped>
.expense-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  flex: 1;
}

.view-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.title-icon {
  color: #dc2626;
  font-size: 2rem;
}

.view-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.add-btn {
  font-weight: 600;
  text-transform: none;
}

.filters-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filters-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
}

.search-group,
.filter-group,
.date-group {
  flex: 1;
}

.search-input,
.category-filter,
.date-filter {
  width: 100%;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.card-icon.negative {
  background: linear-gradient(135deg, #dc2626, #ef4444);
}

.card-icon.info {
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
}

.card-icon.warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.card-label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.transactions-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.transaction-item:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.transaction-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.transaction-content {
  flex: 1;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.transaction-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.transaction-amount {
  font-size: 1.1rem;
  font-weight: 700;
}

.transaction-amount.negative {
  color: #dc2626;
}

.transaction-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  align-items: center;
}

.investment-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.transaction-notes {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.transaction-actions {
  display: flex;
  gap: 0.5rem;
}

.transactions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.transaction-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.transaction-card:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.card-actions {
  display: flex;
  gap: 0.25rem;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.card-amount {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.card-amount.negative {
  color: #dc2626;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.investment-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #92400e;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state h4 {
  margin: 1rem 0 0.5rem 0;
  color: #374151;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .expense-view {
    padding: 1rem;
  }

  .view-title {
    font-size: 1.5rem;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .transactions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
