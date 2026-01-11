<template>
  <div class="currency-manager">
    <q-card class="main-card">
      <q-card-section>
        <div class="header">
          <h2>Gerenciar Moedas</h2>
          <q-btn 
            color="primary" 
            icon="currency_exchange" 
            label="Nova Conversão" 
            @click="showConversionModal = true"
          />
        </div>

        <!-- Saldo em Diferentes Moedas -->
        <div class="balances-section">
          <h3>Saldo em Moedas</h3>
          <div class="balances-grid">
            <q-card 
              v-for="balance in currencyBalances" 
              :key="balance.currency"
              class="balance-card"
              :class="{ 'primary': balance.currency === 'BRL' }"
            >
              <q-card-section>
                <div class="balance-header">
                  <div class="currency-flag">
                    <span class="flag-icon" :class="getCurrencyFlag(balance.currency)"></span>
                    <div class="currency-code">{{ balance.currency }}</div>
                  </div>
                  <div class="balance-actions">
                    <q-btn 
                      icon="add" 
                      flat 
                      round 
                      @click="addToBalance(balance.currency)"
                    />
                    <q-btn 
                      icon="remove" 
                      flat 
                      round 
                      @click="removeFromBalance(balance.currency)"
                    />
                  </div>
                </div>

                <div class="balance-amount">
                  <div class="amount">
                    {{ formatCurrency(balance.amount, balance.currency) }}
                  </div>
                  <div class="equivalent">
                    ≈ {{ formatCurrency(balance.equivalent, 'BRL') }}
                  </div>
                </div>

                <div class="balance-change">
                  <q-icon 
                    :name="balance.change >= 0 ? 'trending_up' : 'trending_down'" 
                    :class="balance.change >= 0 ? 'positive' : 'negative'"
                  />
                  <span :class="balance.change >= 0 ? 'positive' : 'negative'">
                    {{ balance.change >= 0 ? '+' : '' }}{{ balance.change.toFixed(2) }}%
                  </span>
                  <small>últimos 30 dias</small>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Taxas de Câmbio -->
        <div class="exchange-rates-section">
          <h3>Taxas de Câmbio</h3>
          <q-card>
            <q-card-section>
              <div class="rates-header">
                <div class="rates-info">
                  <q-icon name="update" color="primary" />
                  <span>Atualizado em {{ formatDate(lastUpdate) }}</span>
                </div>
                <q-btn 
                  icon="refresh" 
                  flat 
                  round 
                  @click="refreshRates"
                  :loading="refreshing"
                >
                  <q-tooltip>Atualizar taxas</q-tooltip>
                </q-btn>
              </div>

              <div class="rates-grid">
                <div 
                  v-for="rate in exchangeRates" 
                  :key="rate.from + rate.to"
                  class="rate-item"
                >
                  <div class="rate-pair">
                    <span class="flag-icon" :class="getCurrencyFlag(rate.from)"></span>
                    1 {{ rate.from }}
                    <q-icon name="arrow_forward" />
                    <span class="flag-icon" :class="getCurrencyFlag(rate.to)"></span>
                    {{ rate.rate.toFixed(4) }} {{ rate.to }}
                  </div>
                  <div class="rate-change" :class="rate.change >= 0 ? 'positive' : 'negative'">
                    <q-icon :name="rate.change >= 0 ? 'arrow_upward' : 'arrow_downward'" />
                    {{ rate.change.toFixed(2) }}%
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Histórico de Conversões -->
        <div class="history-section">
          <div class="section-header">
            <h3>Histórico de Conversões</h3>
            <q-btn 
              icon="download" 
              flat 
              round 
              @click="exportHistory"
            >
              <q-tooltip>Exportar histórico</q-tooltip>
            </q-btn>
          </div>
          
          <q-table
            :rows="conversionHistory"
            :columns="historyColumns"
            row-key="id"
            dense
            flat
            :pagination="pagination"
          >
            <template v-slot:body-cell-fromAmount="props">
              <q-td :props="props">
                <div class="amount-cell">
                  <span class="flag-icon" :class="getCurrencyFlag(props.row.fromCurrency)"></span>
                  {{ formatCurrency(props.row.fromAmount, props.row.fromCurrency) }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-toAmount="props">
              <q-td :props="props">
                <div class="amount-cell">
                  <span class="flag-icon" :class="getCurrencyFlag(props.row.toCurrency)"></span>
                  {{ formatCurrency(props.row.toAmount, props.row.toCurrency) }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-rate="props">
              <q-td :props="props">
                <div class="rate-cell">
                  {{ props.row.rate.toFixed(4) }}
                  <small class="text-grey">({{ props.row.fromCurrency }}/{{ props.row.toCurrency }})</small>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn 
                  icon="content_copy" 
                  size="sm" 
                  flat 
                  @click="copyTransaction(props.row)"
                >
                  <q-tooltip>Copiar para transações</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Estatísticas -->
        <div class="stats-section">
          <q-card>
            <q-card-section>
              <h3>Estatísticas de Conversão</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-label">Total Convertido</div>
                  <div class="stat-value">R$ {{ formatCurrency(totalConverted) }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">Conversões Realizadas</div>
                  <div class="stat-value">{{ totalConversions }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">Maior Conversão</div>
                  <div class="stat-value">{{ formatCurrency(largestConversion.amount, largestConversion.currency) }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">Economia Total</div>
                  <div class="stat-value positive">R$ {{ formatCurrency(totalSavings) }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de Conversão -->
    <q-dialog v-model="showConversionModal" persistent>
      <q-card style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">Converter Moeda</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="performConversion" class="q-gutter-md">
            <div class="conversion-form">
              <div class="from-section">
                <div class="section-label">De</div>
                <div class="currency-selector">
                  <q-select
                    v-model="conversionForm.fromCurrency"
                    :options="currencyOptions"
                    filled
                    emit-value
                    map-options
                  >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <span class="flag-icon" :class="getCurrencyFlag(scope.opt.value)"></span>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-input
                    v-model="conversionForm.fromAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    filled
                    placeholder="0.00"
                    @input="calculateToAmount"
                  >
                    <template v-slot:prepend>
                      <span class="currency-symbol">{{ getCurrencySymbol(conversionForm.fromCurrency) }}</span>
                    </template>
                  </q-input>
                  <div class="available-balance">
                    Disponível: {{ formatCurrency(getAvailableBalance(conversionForm.fromCurrency), conversionForm.fromCurrency) }}
                  </div>
                </div>
              </div>

              <div class="swap-button">
                <q-btn 
                  icon="swap_vert" 
                  round 
                  flat 
                  @click="swapCurrencies"
                />
              </div>

              <div class="to-section">
                <div class="section-label">Para</div>
                <div class="currency-selector">
                  <q-select
                    v-model="conversionForm.toCurrency"
                    :options="currencyOptions"
                    filled
                    emit-value
                    map-options
                  >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <span class="flag-icon" :class="getCurrencyFlag(scope.opt.value)"></span>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-input
                    v-model="conversionForm.toAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    filled
                    placeholder="0.00"
                    readonly
                    class="result-input"
                  >
                    <template v-slot:prepend>
                      <span class="currency-symbol">{{ getCurrencySymbol(conversionForm.toCurrency) }}</span>
                    </template>
                  </q-input>
                  <div class="exchange-rate">
                    Taxa: 1 {{ conversionForm.fromCurrency }} = {{ currentRate.toFixed(4) }} {{ conversionForm.toCurrency }}
                  </div>
                </div>
              </div>
            </div>

            <div class="conversion-details">
              <div class="detail-row">
                <span>Taxa de Câmbio</span>
                <span>{{ currentRate.toFixed(4) }}</span>
              </div>
              <div class="detail-row">
                <span>Taxa de Serviço</span>
                <span>{{ formatCurrency(serviceFee, conversionForm.fromCurrency) }}</span>
              </div>
              <div class="detail-row total">
                <span>Total a Receber</span>
                <span class="total-amount">
                  {{ formatCurrency(conversionForm.toAmount, conversionForm.toCurrency) }}
                </span>
              </div>
            </div>

            <div class="dialog-actions">
              <q-btn 
                label="Cancelar" 
                flat 
                v-close-popup 
                color="negative"
              />
              <q-btn 
                label="Converter" 
                type="submit" 
                color="primary"
                :disable="!canConvert"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal Adicionar/Remover Saldo -->
    <q-dialog v-model="showBalanceModal">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">
            {{ balanceAction === 'add' ? 'Adicionar' : 'Remover' }} {{ selectedCurrency }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="updateBalance" class="q-gutter-md">
            <q-input
              v-model="balanceForm.amount"
              type="number"
              min="0"
              step="0.01"
              :label="`Quantidade (${selectedCurrency})`"
              filled
              :rules="[val => val > 0 || 'Valor deve ser maior que zero']"
            />

            <q-input
              v-model="balanceForm.description"
              label="Descrição (opcional)"
              filled
            />

            <div class="dialog-actions">
              <q-btn 
                label="Cancelar" 
                flat 
                v-close-popup 
                color="negative"
              />
              <q-btn 
                :label="balanceAction === 'add' ? 'Adicionar' : 'Remover'" 
                type="submit" 
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import { useQuasar } from 'quasar'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { exportToExcel } from '@/utils/export'

const $q = useQuasar()
const currencyStore = useCurrencyStore()

const showConversionModal = ref(false)
const showBalanceModal = ref(false)
const refreshing = ref(false)
const balanceAction = ref('add')
const selectedCurrency = ref('')

const conversionForm = ref({
  fromCurrency: 'BRL',
  toCurrency: 'USD',
  fromAmount: 0,
  toAmount: 0
})

const balanceForm = ref({
  amount: 0,
  description: ''
})

const pagination = ref({
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

const historyColumns = [
  { name: 'date', label: 'Data', field: 'date', align: 'left' },
  { name: 'fromAmount', label: 'De', field: 'fromAmount', align: 'left' },
  { name: 'toAmount', label: 'Para', field: 'toAmount', align: 'left' },
  { name: 'rate', label: 'Taxa', field: 'rate', align: 'right' },
  { name: 'actions', label: 'Ações', align: 'center' }
]

const currencyOptions = [
  { label: 'Real Brasileiro (BRL)', value: 'BRL' },
  { label: 'Dólar Americano (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'Libra Esterlina (GBP)', value: 'GBP' },
  { label: 'Iene Japonês (JPY)', value: 'JPY' },
  { label: 'Dólar Australiano (AUD)', value: 'AUD' },
  { label: 'Dólar Canadense (CAD)', value: 'CAD' },
  { label: 'Franco Suíço (CHF)', value: 'CHF' }
]

const currencyBalances = computed(() => currencyStore.balances)
const exchangeRates = computed(() => currencyStore.exchangeRates)
const conversionHistory = computed(() => currencyStore.conversionHistory)
const lastUpdate = computed(() => currencyStore.lastUpdate)

const currentRate = computed(() => {
  const rate = exchangeRates.value.find(
    r => r.from === conversionForm.value.fromCurrency && 
         r.to === conversionForm.value.toCurrency
  )
  return rate ? rate.rate : 1
})

const serviceFee = computed(() => {
  return conversionForm.value.fromAmount * 0.01 // 1% fee
})

const canConvert = computed(() => {
  const available = getAvailableBalance(conversionForm.value.fromCurrency)
  return conversionForm.value.fromAmount > 0 && 
         conversionForm.value.fromAmount <= available
})

const totalConverted = computed(() => {
  return conversionHistory.value.reduce((sum, conv) => 
    sum + conv.fromAmount * (conv.fromCurrency === 'BRL' ? 1 : conv.rate), 0)
})

const totalConversions = computed(() => conversionHistory.value.length)

const largestConversion = computed(() => {
  if (conversionHistory.value.length === 0) return { amount: 0, currency: 'BRL' }
  const largest = conversionHistory.value.reduce((max, conv) => 
    conv.fromAmount > max.fromAmount ? conv : max
  )
  return { amount: largest.fromAmount, currency: largest.fromCurrency }
})

const totalSavings = computed(() => {
  return conversionHistory.value.reduce((sum, conv) => {
    const marketRate = conv.rate * 1.02 // Assume 2% market spread
    const saved = conv.fromAmount * (marketRate - conv.rate)
    return sum + saved
  }, 0)
})

onMounted(async () => {
  await Promise.all([
    currencyStore.fetchBalances(),
    currencyStore.fetchExchangeRates(),
    currencyStore.fetchConversionHistory()
  ])
})

function getCurrencyFlag(currency) {
  const flags = {
    'BRL': 'br',
    'USD': 'us',
    'EUR': 'eu',
    'GBP': 'gb',
    'JPY': 'jp',
    'AUD': 'au',
    'CAD': 'ca',
    'CHF': 'ch'
  }
  return `fi fi-${flags[currency] || 'xx'} fis`
}

function getCurrencySymbol(currency) {
  const symbols = {
    'BRL': 'R$',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'CHF'
  }
  return symbols[currency] || currency
}

function getAvailableBalance(currency) {
  const balance = currencyBalances.value.find(b => b.currency === currency)
  return balance ? balance.amount : 0
}

function calculateToAmount() {
  conversionForm.value.toAmount = conversionForm.value.fromAmount * currentRate.value - serviceFee.value
}

function swapCurrencies() {
  const temp = conversionForm.value.fromCurrency
  conversionForm.value.fromCurrency = conversionForm.value.toCurrency
  conversionForm.value.toCurrency = temp
  calculateToAmount()
}

async function performConversion() {
  try {
    await currencyStore.convertCurrency({
      fromCurrency: conversionForm.value.fromCurrency,
      toCurrency: conversionForm.value.toCurrency,
      fromAmount: conversionForm.value.fromAmount,
      toAmount: conversionForm.value.toAmount,
      rate: currentRate.value
    })
    
    $q.notify({
      type: 'positive',
      message: 'Conversão realizada com sucesso'
    })
    
    showConversionModal.value = false
    resetConversionForm()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao realizar conversão'
    })
  }
}

function resetConversionForm() {
  conversionForm.value = {
    fromCurrency: 'BRL',
    toCurrency: 'USD',
    fromAmount: 0,
    toAmount: 0
  }
}

function addToBalance(currency) {
  selectedCurrency.value = currency
  balanceAction.value = 'add'
  balanceForm.value = { amount: 0, description: '' }
  showBalanceModal.value = true
}

function removeFromBalance(currency) {
  selectedCurrency.value = currency
  balanceAction.value = 'remove'
  balanceForm.value = { amount: 0, description: '' }
  showBalanceModal.value = true
}

async function updateBalance() {
  try {
    if (balanceAction.value === 'add') {
      await currencyStore.addToBalance({
        currency: selectedCurrency.value,
        amount: balanceForm.value.amount,
        description: balanceForm.value.description
      })
      $q.notify({
        type: 'positive',
        message: 'Saldo adicionado com sucesso'
      })
    } else {
      await currencyStore.removeFromBalance({
        currency: selectedCurrency.value,
        amount: balanceForm.value.amount,
        description: balanceForm.value.description
      })
      $q.notify({
        type: 'positive',
        message: 'Saldo removido com sucesso'
      })
    }
    
    showBalanceModal.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao atualizar saldo'
    })
  }
}

async function refreshRates() {
  refreshing.value = true
  try {
    await currencyStore.fetchExchangeRates()
    $q.notify({
      type: 'positive',
      message: 'Taxas atualizadas com sucesso'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar taxas'
    })
  } finally {
    refreshing.value = false
  }
}

function exportHistory() {
  const data = conversionHistory.value.map(item => ({
    Data: formatDate(item.date),
    'De Moeda': item.fromCurrency,
    'De Valor': item.fromAmount,
    'Para Moeda': item.toCurrency,
    'Para Valor': item.toAmount,
    'Taxa': item.rate.toFixed(4)
  }))
  
  exportToExcel(data, 'historico-conversoes')
}

function copyTransaction(conversion) {
  // Emitir evento para copiar para transações
  // emit('add-transaction', {
  //   type: conversion.fromCurrency === 'BRL' ? 'expense' : 'income',
  //   amount: conversion.fromAmount,
  //   currency: conversion.fromCurrency,
  //   description: `Conversão para ${conversion.toCurrency}`
  // })
  $q.notify({
    type: 'info',
    message: 'Transação copiada para o clipboard'
  })
}
</script>

<style scoped>
.currency-manager {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.balances-section {
  margin-bottom: 30px;
}

.balances-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.balance-card {
  transition: transform 0.3s ease;
}

.balance-card:hover {
  transform: translateY(-5px);
}

.balance-card.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.balance-card.primary .currency-code,
.balance-card.primary .amount,
.balance-card.primary .equivalent,
.balance-card.primary .balance-change {
  color: white !important;
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.currency-flag {
  display: flex;
  align-items: center;
  gap: 10px;
}

.flag-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-size: cover;
  display: inline-block;
}

.currency-code {
  font-weight: 600;
  font-size: 1.1rem;
}

.balance-actions {
  display: flex;
  gap: 5px;
}

.balance-amount {
  margin-bottom: 15px;
}

.amount {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.equivalent {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 5px;
}

.balance-change {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.balance-change .positive {
  color: #4CAF50;
}

.balance-change .negative {
  color: #F44336;
}

.exchange-rates-section {
  margin-bottom: 30px;
}

.rates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.rates-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.rates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.rate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f8f9fa;
}

.rate-pair {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rate-change {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
}

.rate-change.positive {
  color: #4CAF50;
}

.rate-change.negative {
  color: #F44336;
}

.history-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.amount-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rate-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stats-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-value.positive {
  color: #4CAF50;
}

.conversion-form {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: start;
}

.from-section, .to-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  font-weight: 500;
  color: #666;
}

.currency-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.available-balance, .exchange-rate {
  font-size: 0.85rem;
  color: #666;
  text-align: right;
}

.swap-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}

.currency-symbol {
  font-weight: 600;
}

.result-input {
  background: #f8f9fa;
}

.conversion-details {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row.total {
  font-weight: 600;
  font-size: 1.1rem;
}

.total-amount {
  color: #4CAF50;
  font-weight: 700;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .conversion-form {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .swap-button {
    margin: 10px 0;
    order: 2;
  }
  
  .from-section, .to-section {
    order: 1;
  }
  
  .balances-grid {
    grid-template-columns: 1fr;
  }
  
  .rates-grid {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Flag Icons CSS */
.fi {
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
  position: relative;
  display: inline-block;
  width: 1.33333333em;
  line-height: 1em;
}
.fi:before {
  content: "\00a0";
}
.fi-br {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><path fill="#009b3a" d="M0 0h640v480H0z"/><path fill="#fedf00" d="M320 91.4l109.3 80.4-41.7 127.6h-135.2L210.7 171.8z"/><circle fill="#002776" cx="320" cy="182.6" r="80.4"/><path fill="#fff" d="M320 132.1c27.9 0 50.5 22.6 50.5 50.5s-22.6 50.5-50.5 50.5"/></svg>');
}
.fi-us {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><path fill="#bd3d44" d="M0 0h640v480H0"/><path stroke="#fff" stroke-width="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/><path fill="#192f5d" d="M0 0h364.8v258.5H0"/><marker id="us-a" markerHeight="30" markerWidth="30"><path fill="#fff" d="m14 0 9 27L0 10h28L5 27z"/></marker><path fill="none" marker-mid="url(%23us-a)" d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60L0 0"/></svg>');
}
.fi-eu {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><defs><g id="eu-d"><g id="eu-b"><path id="eu-a" d="m0-1-.3 1 .5.1z"/><use transform="scale(-1 1)" xlink:href="%23eu-a"/></g><g id="eu-c"><use xlink:href="%23eu-b" transform="rotate(72)"/><use xlink:href="%23eu-b" transform="rotate(144)"/></g></g></defs><path fill="#039" d="M0 0h640v480H0z"/><g fill="#fc0" transform="translate(320 240) scale(23.25)"><use xlink:href="%23eu-d" width="100%" height="100%" y="-6"/><use xlink:href="%23eu-d" width="100%" height="100%" y="6"/><g id="eu-e"><use xlink:href="%23eu-c" width="100%" height="100%" x="-6"/><use xlink:href="%23eu-d" width="100%" height="100%" x="-3"/><use xlink:href="%23eu-d" width="100%" height="100%" x="3"/><use xlink:href="%23eu-c" width="100%" height="100%" x="6"/></g><use xlink:href="%23eu-e" width="100%" height="100%" transform="rotate(72)"/><use xlink:href="%23eu-e" width="100%" height="100%" transform="rotate(144)"/><use xlink:href="%23eu-e" width="100%" height="100%" transform="rotate(216)"/><use xlink:href="%23eu-e" width="100%" height="100%" transform="rotate(288)"/></g></svg>');
}
.fi-gb {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/><path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/><path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/><path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/></svg>');
}
.fi-jp {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><defs><clipPath id="jp-a"><path fill-opacity=".7" d="M-88 32h640v480H-88z"/></clipPath></defs><g fill-rule="evenodd" stroke-width="1pt" clip-path="url(%23jp-a)" transform="translate(88 -32)"><path fill="#fff" d="M-128 32h720v480h-720z"/><circle cx="523.1" cy="344.1" r="194.9" fill="#bc002d" transform="translate(-168.4 8.6) scale(.76554)"/></g></svg>');
}
.fi-au {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><path fill="#00008B" d="M0 0h640v480H0z"/><path fill="#fff" d="M37.5 0l122 90.5L281 0h39v31l-120 89.5 120 89V240h-40l-120-89.5L40.5 240H0v-30l119.5-89L0 32V0z"/><path fill="#fff" d="M212 140.5L320 220v20l-135.5-99.5zm-92 10l3 17.5-96 72H0zM320 0v1.5l-124.5 94 1-22L295 0zM0 0l119.5 88h-30L0 21z"/><path fill="#fff" d="M120.5 0v240h80V0zM0 80v80h320V80z"/><path fill="#C8102E" d="M0 96.5v48h320v-48zM136.5 0v240h48V0z"/><path fill="#C8102E" d="M0 0l120 90h-30L0 42zM320 0l-120 90h30L320 42zM0 198l120-90v30L0 240zM320 198l-120-90v30l120 102z"/><path fill="#fff" d="M393 335l-14 3c-1 17-13 31-29 34-17 4-34-7-38-24-4-17 7-34 24-38 16-3 32 5 37 21l14-3-2 24 54 14 3-56-27-7-5 25-15 3c-3-23-24-39-47-35-25 4-40 28-36 52 4 25 28 40 52 36 23-4 39-25 35-48z"/><path fill="#C8102E" d="M415 408l-61-16-5-23 61 16z"/></svg>');
}
.fi-ca {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><path fill="#fff" d="M150.1 0h339.7v480H150z"/><path fill="#d52b1e" d="M-19.7 0h169.8v480H-19.7zm509.5 0h169.8v480H489.8z"/><path fill="#fff" d="m210 402.1l-90.3-53.3 111.3-36.9-20.9-106.8 84.5 69.4 111.3-36.9-61.2 97.3 84.5 69.4-109.8-1.5-61.2 97.3z"/></svg>');
}
.fi-ch {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><g fill-rule="evenodd" stroke-width="1pt"><path fill="#d52b1e" d="M0 0h640v480H0z"/><path fill="#fff" d="M170 195h300v90H170z"/><path fill="#fff" d="M275 90h90v300h-90z"/></g></svg>');
}
.fi-xx {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><path fill="#999" d="M0 0h640v480H0z"/><path fill="#ccc" d="M0 0h320v240H0z"/></svg>');
}
</style>