<template>
  <div class="transaction-list">
    <q-card class="main-card">
      <q-card-section>
        <div class="header">
          <h2>Transações</h2>
          <div class="header-actions">
            <q-btn
              color="primary"
              icon="add"
              label="Nova Transação"
              @click="showTransactionForm"
            />
            <q-btn
              icon="filter_list"
              flat
              @click="showFilters = !showFilters"
            >
              <q-badge v-if="activeFilterCount > 0" color="primary" floating>
                {{ activeFilterCount }}
              </q-badge>
            </q-btn>
            <q-btn
              icon="download"
              flat
              @click="exportTransactions"
            >
              <q-tooltip>Exportar transações</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Filtros Avançados -->
        <div v-if="showFilters" class="filters-section">
          <q-card class="filters-card">
            <q-card-section>
              <div class="filters-grid">
                <div class="filter-group">
                  <label>Tipo</label>
                  <q-select
                    v-model="filters.type"
                    :options="typeOptions"
                    multiple
                    dense
                    outlined
                    use-chips
                  />
                </div>
                <div class="filter-group">
                  <label>Categoria</label>
                  <q-select
                    v-model="filters.categories"
                    :options="categoryOptions"
                    multiple
                    dense
                    outlined
                    use-chips
                  />
                </div>
                <div class="filter-group">
                  <label>Método de Pagamento</label>
                  <q-select
                    v-model="filters.paymentMethods"
                    :options="paymentMethodOptions"
                    multiple
                    dense
                    outlined
                    use-chips
                  />
                </div>
                <div class="filter-group">
                  <label>Período</label>
                  <q-select
                    v-model="filters.period"
                    :options="periodOptions"
                    dense
                    outlined
                  />
                </div>
                <div class="filter-group">
                  <label>Data</label>
                  <div class="date-range">
                    <q-input
                      v-model="filters.dateFrom"
                      type="date"
                      dense
                      outlined
                      placeholder="De"
                    />
                    <span>até</span>
                    <q-input
                      v-model="filters.dateTo"
                      type="date"
                      dense
                      outlined
                      placeholder="Até"
                    />
                  </div>
                </div>
                <div class="filter-group">
                  <label>Valor</label>
                  <div class="value-range">
                    <q-input
                      v-model="filters.minAmount"
                      type="number"
                      dense
                      outlined
                      placeholder="Mín"
                      prefix="R$"
                    />
                    <span>até</span>
                    <q-input
                      v-model="filters.maxAmount"
                      type="number"
                      dense
                      outlined
                      placeholder="Máx"
                      prefix="R$"
                    />
                  </div>
                </div>
                <div class="filter-actions">
                  <q-btn
                    label="Aplicar"
                    color="primary"
                    @click="applyFilters"
                  />
                  <q-btn
                    label="Limpar"
                    flat
                    @click="clearFilters"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Resumo -->
        <div class="summary-section">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Total de Transações</div>
              <div class="summary-value">{{ totalTransactions }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Receitas</div>
              <div class="summary-value positive">R$ {{ formatCurrency(totalIncome) }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Despesas</div>
              <div class="summary-value negative">R$ {{ formatCurrency(totalExpense) }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Saldo</div>
              <div class="summary-value" :class="balanceClass">
                R$ {{ formatCurrency(balance) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de Transações -->
        <div class="table-section">
          <q-table
            :rows="filteredTransactions"
            :columns="columns"
            row-key="id"
            :pagination="pagination"
            :loading="loading"
            :filter="searchFilter"
            flat
            bordered
            separator="cell"
            class="transactions-table"
          >
            <!-- Slot de busca -->
            <template v-slot:top-right>
              <q-input
                v-model="searchFilter"
                placeholder="Buscar transações..."
                dense
                outlined
                style="width: 300px;"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <!-- Slot de ações em lote -->
            <template v-slot:top-left>
              <div v-if="selected.length > 0" class="batch-actions">
                <span class="selected-count">{{ selected.length }} selecionadas</span>
                <q-btn
                  icon="delete"
                  flat
                  dense
                  color="negative"
                  @click="deleteSelected"
                  title="Excluir selecionadas"
                />
                <q-btn
                  icon="edit"
                  flat
                  dense
                  color="warning"
                  @click="editSelected"
                  title="Editar selecionadas"
                />
                <q-btn
                  icon="file_download"
                  flat
                  dense
                  color="primary"
                  @click="exportSelected"
                  title="Exportar selecionadas"
                />
              </div>
            </template>

            <!-- Coluna de seleção -->
            <template v-slot:header-selection="scope">
              <q-checkbox
                v-model="scope.selected"
                @update:model-value="toggleSelectAll"
              />
            </template>

            <template v-slot:body-selection="scope">
              <q-checkbox
                v-model="scope.selected"
                @update:model-value="toggleSelection(scope.row.id)"
              />
            </template>

            <!-- Coluna de Data -->
            <template v-slot:body-cell-date="props">
              <q-td :props="props">
                <div class="date-cell">
                  <div class="date-day">{{ getDay(props.row.date) }}</div>
                  <div class="date-month">{{ getMonth(props.row.date) }}</div>
                  <div class="date-year">{{ getYear(props.row.date) }}</div>
                </div>
              </q-td>
            </template>

            <!-- Coluna de Categoria -->
            <template v-slot:body-cell-category="props">
              <q-td :props="props">
                <q-chip
                  :label="props.row.category"
                  :color="getCategoryColor(props.row.category)"
                  text-color="white"
                  size="sm"
                  dense
                />
              </q-td>
            </template>

            <!-- Coluna de Valor -->
            <template v-slot:body-cell-amount="props">
              <q-td :props="props">
                <div class="amount-cell" :class="props.row.type">
                  <q-icon :name="props.row.type === 'income' ? 'trending_up' : 'trending_down'" />
                  <span class="amount-value">
                    R$ {{ formatCurrency(props.row.amount) }}
                  </span>
                </div>
              </q-td>
            </template>

            <!-- Coluna de Método de Pagamento -->
            <template v-slot:body-cell-paymentMethod="props">
              <q-td :props="props">
                <div class="payment-method">
                  <q-icon :name="getPaymentMethodIcon(props.row.paymentMethod)" size="16px" />
                  <span>{{ getPaymentMethodLabel(props.row.paymentMethod) }}</span>
                </div>
              </q-td>
            </template>

            <!-- Coluna de Status -->
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :label="getStatusLabel(props.row.status)"
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  size="sm"
                  dense
                />
              </q-td>
            </template>

            <!-- Coluna de Ações -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div class="action-buttons">
                  <q-btn
                    icon="edit"
                    size="sm"
                    flat
                    dense
                    color="primary"
                    @click="editTransaction(props.row)"
                    title="Editar"
                  />
                  <q-btn
                    icon="content_copy"
                    size="sm"
                    flat
                    dense
                    color="warning"
                    @click="duplicateTransaction(props.row)"
                    title="Duplicar"
                  />
                  <q-btn
                    icon="delete"
                    size="sm"
                    flat
                    dense
                    color="negative"
                    @click="deleteTransaction(props.row.id)"
                    title="Excluir"
                  />
                  <q-btn
                    v-if="props.row.receipt"
                    icon="receipt"
                    size="sm"
                    flat
                    dense
                    color="info"
                    @click="viewReceipt(props.row)"
                    title="Ver comprovante"
                  />
                </div>
              </q-td>
            </template>

            <!-- Slot de vazio -->
            <template v-slot:no-data>
              <div class="empty-state">
                <q-icon name="receipt" size="64px" color="grey-5" />
                <p>Nenhuma transação encontrada</p>
                <p class="subtitle">Adicione sua primeira transação</p>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Nova Transação"
                  @click="showTransactionForm"
                />
              </div>
            </template>

            <!-- Slot de rodapé -->
            <template v-slot:bottom-row>
              <q-tr>
                <q-td colspan="4" class="text-right">
                  <strong>Totais:</strong>
                </q-td>
                <q-td class="text-right">
                  <div class="total-income">R$ {{ formatCurrency(pageIncome) }}</div>
                </q-td>
                <q-td class="text-right">
                  <div class="total-expense">R$ {{ formatCurrency(pageExpense) }}</div>
                </q-td>
                <q-td colspan="3"></q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <!-- Visualização em Grupo -->
        <div class="grouped-view">
          <q-expansion-item
            label="Visualização Agrupada"
            icon="view_list"
            default-closed
            header-class="grouped-header"
          >
            <div class="grouped-content">
              <div class="group-options">
                <q-radio
                  v-model="groupBy"
                  val="category"
                  label="Por Categoria"
                />
                <q-radio
                  v-model="groupBy"
                  val="date"
                  label="Por Data"
                />
                <q-radio
                  v-model="groupBy"
                  val="paymentMethod"
                  label="Por Método de Pagamento"
                />
              </div>

              <div v-if="groupedTransactions.length > 0" class="groups-container">
                <div
                  v-for="group in groupedTransactions"
                  :key="group.key"
                  class="group-item"
                >
                  <div class="group-header">
                    <div class="group-title">{{ group.label }}</div>
                    <div class="group-total" :class="group.total >= 0 ? 'positive' : 'negative'">
                      R$ {{ formatCurrency(Math.abs(group.total)) }}
                    </div>
                  </div>
                  <div class="group-transactions">
                    <div
                      v-for="transaction in group.transactions"
                      :key="transaction.id"
                      class="group-transaction"
                    >
                      <div class="transaction-description">
                        {{ transaction.description }}
                      </div>
                      <div class="transaction-amount" :class="transaction.type">
                        R$ {{ formatCurrency(transaction.amount) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de Detalhes -->
    <TransactionDetailModal
      v-model="showDetailModal"
      :transaction="selectedTransaction"
      @edit="editSelectedTransaction"
      @delete="deleteSelectedTransaction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { useQuasar } from 'quasar'
import TransactionDetailModal from '@/components/modals/TransactionDetailModal.vue'
import { formatCurrency } from '@/utils/formatters'
import { exportToExcel } from '@/utils/export'

const props = defineProps({
  initialType: { type: String, default: null }
})

const $q = useQuasar()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const showFilters = ref(false)
const loading = ref(false)
const showDetailModal = ref(false)
const searchFilter = ref('')
const groupBy = ref('category')
const selected = ref([])
const selectedTransaction = ref(null)

const filters = ref({
  type: [],
  categories: [],
  paymentMethods: [],
  period: 'all',
  dateFrom: '',
  dateTo: '',
  minAmount: null,
  maxAmount: null
})

const pagination = ref({
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 15
})

const columns = [
  {
    name: 'selection',
    label: '',
    field: 'selection',
    align: 'left',
    style: 'width: 50px'
  },
  {
    name: 'date',
    label: 'Data',
    field: 'date',
    align: 'left',
    sortable: true
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
    sortable: true
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category',
    align: 'left',
    sortable: true
  },
  {
    name: 'amount',
    label: 'Valor',
    field: 'amount',
    align: 'right',
    sortable: true
  },
  {
    name: 'paymentMethod',
    label: 'Método',
    field: 'paymentMethod',
    align: 'center'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center'
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'center',
    style: 'width: 200px'
  }
]

const typeOptions = [
  { label: 'Receita', value: 'income' },
  { label: 'Despesa', value: 'expense' }
]

const periodOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Hoje', value: 'today' },
  { label: 'Esta semana', value: 'week' },
  { label: 'Este mês', value: 'month' },
  { label: 'Este ano', value: 'year' },
  { label: 'Personalizado', value: 'custom' }
]

const paymentMethodOptions = [
  { label: 'Dinheiro', value: 'cash' },
  { label: 'Cartão de Crédito', value: 'credit_card' },
  { label: 'Cartão de Débito', value: 'debit_card' },
  { label: 'Transferência', value: 'bank_transfer' },
  { label: 'PIX', value: 'pix' },
  { label: 'Outro', value: 'other' }
]

onMounted(async () => {
  await Promise.all([
    transactionStore.fetchTransactions(),
    categoryStore.fetchCategories()
  ])
  
  if (props.initialType) {
    filters.value.type = [props.initialType]
  }
})

// Computed Properties
const categoryOptions = computed(() => {
  return categoryStore.categories.map(cat => ({
    label: cat.name,
    value: cat.name
  }))
})

const activeFilterCount = computed(() => {
  return Object.values(filters.value).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length
    if (filter !== null && filter !== '' && filter !== 'all') return count + 1
    return count
  }, 0)
})

const transactions = computed(() => transactionStore.transactions)

const filteredTransactions = computed(() => {
  let filtered = [...transactions.value]

  // Aplicar filtros
  if (filters.value.type.length > 0) {
    filtered = filtered.filter(t => filters.value.type.includes(t.type))
  }

  if (filters.value.categories.length > 0) {
    filtered = filtered.filter(t => filters.value.categories.includes(t.category))
  }

  if (filters.value.paymentMethods.length > 0) {
    filtered = filtered.filter(t => filters.value.paymentMethods.includes(t.paymentMethod))
  }

  // Aplicar período
  if (filters.value.period !== 'all') {
    const today = new Date()
    let startDate = new Date()

    switch (filters.value.period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(today.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(today.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1)
        break
    }

    filtered = filtered.filter(t => new Date(t.date) >= startDate)
  }

  // Aplicar datas personalizadas
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom)
    filtered = filtered.filter(t => new Date(t.date) >= fromDate)
  }

  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo)
    toDate.setHours(23, 59, 59, 999)
    filtered = filtered.filter(t => new Date(t.date) <= toDate)
  }

  // Aplicar valor mínimo
  if (filters.value.minAmount !== null) {
    filtered = filtered.filter(t => t.amount >= filters.value.minAmount)
  }

  // Aplicar valor máximo
  if (filters.value.maxAmount !== null) {
    filtered = filtered.filter(t => t.amount <= filters.value.maxAmount)
  }

  // Aplicar busca
  if (searchFilter.value) {
    const search = searchFilter.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(search) ||
      t.category.toLowerCase().includes(search)
    )
  }

  return filtered
})

const totalTransactions = computed(() => filteredTransactions.value.length)
const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})
const totalExpense = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})
const balance = computed(() => totalIncome.value - totalExpense.value)
const balanceClass = computed(() => balance.value >= 0 ? 'positive' : 'negative')

const pageIncome = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  return filteredTransactions.value
    .slice(start, end)
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const pageExpense = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  return filteredTransactions.value
    .slice(start, end)
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const groupedTransactions = computed(() => {
  const groups = {}
  
  filteredTransactions.value.forEach(transaction => {
    let key
    let label
    
    switch (groupBy.value) {
      case 'category':
        key = transaction.category
        label = transaction.category
        break
      case 'date':
        const date = new Date(transaction.date)
        key = date.toISOString().split('T')[0]
        label = date.toLocaleDateString('pt-BR')
        break
      case 'paymentMethod':
        key = transaction.paymentMethod
        label = getPaymentMethodLabel(transaction.paymentMethod)
        break
      default:
        key = transaction.category
        label = transaction.category
    }
    
    if (!groups[key]) {
      groups[key] = {
        key,
        label,
        transactions: [],
        total: 0
      }
    }
    
    groups[key].transactions.push(transaction)
    groups[key].total += transaction.type === 'income' ? transaction.amount : -transaction.amount
  })
  
  // Converter para array e ordenar
  return Object.values(groups)
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
})

// Methods
function getDay(dateString) {
  const date = new Date(dateString)
  return date.getDate().toString().padStart(2, '0')
}

function getMonth(dateString) {
  const date = new Date(dateString)
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return months[date.getMonth()]
}

function getYear(dateString) {
  const date = new Date(dateString)
  return date.getFullYear()
}

function getCategoryColor(category) {
  const categoryObj = categoryStore.categories.find(c => c.name === category)
  return categoryObj?.color || '#9E9E9E'
}

function getPaymentMethodIcon(method) {
  const icons = {
    cash: 'payments',
    credit_card: 'credit_card',
    debit_card: 'credit_card',
    bank_transfer: 'account_balance',
    pix: 'qr_code',
    other: 'more_horiz'
  }
  return icons[method] || 'payment'
}

function getPaymentMethodLabel(method) {
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

function getStatusLabel(status) {
  const labels = {
    pending: 'Pendente',
    completed: 'Concluído',
    canceled: 'Cancelado',
    recurring: 'Recorrente'
  }
  return labels[status] || status
}

function getStatusColor(status) {
  const colors = {
    pending: 'warning',
    completed: 'positive',
    canceled: 'negative',
    recurring: 'info'
  }
  return colors[status] || 'grey'
}

function applyFilters() {
  showFilters.value = false
  $q.notify({
    type: 'positive',
    message: 'Filtros aplicados'
  })
}

function clearFilters() {
  filters.value = {
    type: [],
    categories: [],
    paymentMethods: [],
    period: 'all',
    dateFrom: '',
    dateTo: '',
    minAmount: null,
    maxAmount: null
  }
  searchFilter.value = ''
  selected.value = []
  $q.notify({
    type: 'info',
    message: 'Filtros limpos'
  })
}

function toggleSelectAll(selected) {
  if (selected) {
    selected.value = filteredTransactions.value.map(t => t.id)
  } else {
    selected.value = []
  }
}

function toggleSelection(id) {
  const index = selected.value.indexOf(id)
  if (index > -1) {
    selected.value.splice(index, 1)
  } else {
    selected.value.push(id)
  }
}

function deleteSelected() {
  if (selected.value.length === 0) return
  
  $q.dialog({
    title: 'Excluir Transações',
    message: `Tem certeza que deseja excluir ${selected.value.length} transação(ões) selecionada(s)?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      for (const id of selected.value) {
        await transactionStore.deleteTransaction(id)
      }
      selected.value = []
      $q.notify({
        type: 'positive',
        message: 'Transações excluídas com sucesso'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir transações'
      })
    }
  })
}

function editSelected() {
  if (selected.value.length === 1) {
    const transaction = filteredTransactions.value.find(t => t.id === selected.value[0])
    editTransaction(transaction)
  } else {
    $q.notify({
      type: 'warning',
      message: 'Selecione apenas uma transação para editar'
    })
  }
}

function exportSelected() {
  if (selected.value.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'Selecione transações para exportar'
    })
    return
  }
  
  const data = filteredTransactions.value
    .filter(t => selected.value.includes(t.id))
    .map(t => ({
      Data: new Date(t.date).toLocaleDateString('pt-BR'),
      Descrição: t.description,
      Categoria: t.category,
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Valor: t.amount,
      'Método de Pagamento': getPaymentMethodLabel(t.paymentMethod),
      Status: getStatusLabel(t.status)
    }))
  
  exportToExcel(data, `transacoes-selecionadas-${new Date().toISOString().split('T')[0]}`)
}

function showTransactionForm() {
  // Emitir evento para abrir modal de transação
  // emit('show-transaction-form')
  $q.notify({
    type: 'info',
    message: 'Abrindo formulário de transação'
  })
}

function editTransaction(transaction) {
  selectedTransaction.value = transaction
  showDetailModal.value = true
}

function duplicateTransaction(transaction) {
  const duplicated = {
    ...transaction,
    id: null,
    description: `${transaction.description} (Cópia)`,
    date: new Date().toISOString().split('T')[0]
  }
  
  transactionStore.createTransaction(duplicated)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Transação duplicada com sucesso'
      })
    })
    .catch(error => {
      $q.notify({
        type: 'negative',
        message: error.message || 'Erro ao duplicar transação'
      })
    })
}

function deleteTransaction(id) {
  $q.dialog({
    title: 'Excluir Transação',
    message: 'Tem certeza que deseja excluir esta transação?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await transactionStore.deleteTransaction(id)
      $q.notify({
        type: 'positive',
        message: 'Transação excluída com sucesso'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir transação'
      })
    }
  })
}

function viewReceipt(transaction) {
  // Abrir visualizador de comprovante
  $q.notify({
    type: 'info',
    message: 'Visualizando comprovante...'
  })
}

function exportTransactions() {
  const data = filteredTransactions.value.map(t => ({
    Data: new Date(t.date).toLocaleDateString('pt-BR'),
    Descrição: t.description,
    Categoria: t.category,
    Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
    Valor: t.amount,
    'Método de Pagamento': getPaymentMethodLabel(t.paymentMethod),
    Status: getStatusLabel(t.status),
    'Cartão de Crédito': t.creditCard?.name || '',
    Recorrente: t.recurring?.isRecurring ? 'Sim' : 'Não',
    Tags: t.tags?.join(', ') || ''
  }))
  
  exportToExcel(data, `transacoes-${new Date().toISOString().split('T')[0]}`)
  
  $q.notify({
    type: 'positive',
    message: 'Transações exportadas com sucesso'
  })
}

function editSelectedTransaction() {
  // Emitir evento para editar transação selecionada
  // emit('edit-transaction', selectedTransaction.value)
  showDetailModal.value = false
}

function deleteSelectedTransaction() {
  deleteTransaction(selectedTransaction.value.id)
  showDetailModal.value = false
}
</script>

<style scoped>
.transaction-list {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filters-section {
  margin-bottom: 30px;
}

.filters-card {
  background: #f8f9fa;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #2c3e50;
}

.date-range, .value-range {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
}

.date-range span, .value-range span {
  text-align: center;
  color: #666;
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}

.summary-section {
  margin-bottom: 30px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-item {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.summary-value.positive {
  color: #4CAF50;
}

.summary-value.negative {
  color: #F44336;
}

.table-section {
  margin-bottom: 30px;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: #e3f2fd;
  border-radius: 6px;
  border: 1px solid #bbdefb;
}

.selected-count {
  font-weight: 500;
  color: #1976d2;
}

.date-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.date-day {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
}

.date-month {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.date-year {
  font-size: 0.7rem;
  color: #999;
}

.amount-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  font-weight: 600;
}

.amount-cell.income {
  color: #4CAF50;
}

.amount-cell.expense {
  color: #F44336;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.empty-state {
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

.total-income, .total-expense {
  font-weight: 600;
}

.total-income {
  color: #4CAF50;
}

.total-expense {
  color: #F44336;
}

.grouped-view {
  margin-top: 30px;
}

:deep(.grouped-header) {
  background: #f8f9fa;
  border-radius: 8px;
  font-weight: 600;
}

.grouped-content {
  padding: 20px;
}

.group-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.group-item {
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.group-title {
  font-weight: 600;
  color: #2c3e50;
}

.group-total {
  font-weight: 700;
  font-size: 1.1rem;
}

.group-total.positive {
  color: #4CAF50;
}

.group-total.negative {
  color: #F44336;
}

.group-transactions {
  padding: 15px;
}

.group-transaction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
}

.group-transaction:last-child {
  border-bottom: none;
}

.transaction-description {
  flex: 1;
  color: #2c3e50;
}

.transaction-amount {
  font-weight: 600;
  min-width: 100px;
  text-align: right;
}

.transaction-amount.income {
  color: #4CAF50;
}

.transaction-amount.expense {
  color: #F44336;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .batch-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .group-options {
    flex-direction: column;
  }
  
  :deep(.transactions-table) .q-table__top {
    flex-direction: column;
    gap: 15px;
  }
  
  :deep(.transactions-table) .q-table__control {
    width: 100%;
  }
}
</style>