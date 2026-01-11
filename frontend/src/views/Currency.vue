<template>
  <div class="currency">
    <h1>Câmbio e Conversão de Moedas</h1>
    
    <div class="converter card">
      <h3>Conversor de Moedas</h3>
      <div class="converter-form">
        <div class="amount-section">
          <div class="input-group">
            <label>Valor</label>
            <input v-model="amount" type="number" step="0.01" class="form-control" placeholder="100">
          </div>
          
          <div class="swap-button" @click="swapCurrencies">
            🔄
          </div>
        </div>
        
        <div class="currency-section">
          <div class="currency-input">
            <label>De</label>
            <select v-model="fromCurrency" class="form-control">
              <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
              </option>
            </select>
            <div class="currency-info">
              <span>1 {{ fromCurrency }} = {{ getExchangeRate(fromCurrency, toCurrency).toFixed(4) }} {{ toCurrency }}</span>
            </div>
          </div>
          
          <div class="currency-input">
            <label>Para</label>
            <select v-model="toCurrency" class="form-control">
              <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
              </option>
            </select>
            <div class="currency-info">
              <span>1 {{ toCurrency }} = {{ getExchangeRate(toCurrency, fromCurrency).toFixed(4) }} {{ fromCurrency }}</span>
            </div>
          </div>
        </div>
        
        <div class="result-section">
          <div class="result-card">
            <div class="result-amount">
              {{ formatCurrency(parseFloat(amount) || 0, fromCurrency) }}
            </div>
            <div class="result-label">{{ fromCurrencyName }} → {{ toCurrencyName }}</div>
          </div>
          
          <div class="result-arrow">→</div>
          
          <div class="result-card highlighted">
            <div class="result-amount">
              {{ formatCurrency(convertedAmount, toCurrency) }}
            </div>
            <div class="result-label">Valor Convertido</div>
          </div>
        </div>
        
        <div class="converter-actions">
          <button @click="convert" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Convertendo...' : 'Converter' }}
          </button>
          <button @click="updateRates" class="btn btn-secondary" :disabled="loading">
            🔄 Atualizar Taxas
          </button>
        </div>
      </div>
    </div>

    <div class="currency-settings card">
      <h3>Configurações de Moeda Base</h3>
      <div class="settings-form">
        <div class="form-group">
          <label>Moeda Base</label>
          <select v-model="baseCurrency" @change="setBaseCurrency" class="form-control">
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>
        <p class="settings-info">
          Todos os valores serão exibidos em sua moeda base. As taxas de câmbio são atualizadas automaticamente.
        </p>
      </div>
    </div>

    <div class="exchange-rates card">
      <div class="rates-header">
        <h3>Taxas de Câmbio (Base: {{ baseCurrency }})</h3>
        <span class="last-updated">Última atualização: {{ lastUpdated }}</span>
      </div>
      
      <div v-if="loading" class="loading">Carregando taxas de câmbio...</div>
      <div v-if="error" class="error">{{ error }}</div>
      
      <div class="rates-grid">
        <div v-for="currency in currencies" :key="currency.code" class="rate-item" 
             :class="{ 'highlighted': currency.code === baseCurrency }">
          <div class="rate-flag">{{ currency.flag }}</div>
          <div class="rate-info">
            <div class="rate-code">{{ currency.code }}</div>
            <div class="rate-name">{{ currency.name }}</div>
          </div>
          <div class="rate-value">
            <div class="rate-amount">
              1 {{ baseCurrency }} = {{ formatRate(1 / getExchangeRate(baseCurrency, currency.code)) }} {{ currency.code }}
            </div>
            <div class="rate-change" :class="getChangeClass(currency.code)">
              {{ getChangePercentage(currency.code) }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="rates-actions">
        <button @click="updateRates" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Updating...' : 'Refresh Rates' }}
        </button>
        <button @click="exportRates" class="btn btn-secondary">
          📊 Export Rates
        </button>
      </div>
    </div>

    <div class="currency-chart card">
      <h3>Exchange Rate Trends</h3>
      <div class="chart-wrapper">
        <canvas ref="trendChart"></canvas>
      </div>
      <div class="chart-controls">
        <select v-model="trendCurrency" @change="updateTrendChart" class="form-control">
          <option v-for="currency in currencies.filter(c => c.code !== baseCurrency)" 
                  :key="currency.code" :value="currency.code">
            {{ currency.flag }} {{ currency.code }}
          </option>
        </select>
        <select v-model="trendPeriod" @change="updateTrendChart" class="form-control">
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="90d">90 Days</option>
          <option value="1y">1 Year</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useCurrencies } from '../composables/useCurrencies'
import { formatCurrency } from '../utils/formatters'
import { exportToCSV } from '../utils/export'

Chart.register(...registerables)

const { 
  currencies, 
  baseCurrency, 
  loading, 
  error, 
  fetchCurrencies, 
  convertCurrency, 
  updateRates, 
  setBaseCurrency 
} = useCurrencies()

const amount = ref('100')
const fromCurrency = ref('USD')
const toCurrency = ref('EUR')
const trendChart = ref(null)
const trendCurrency = ref('EUR')
const trendPeriod = ref('30d')

let chartInstance = null

// Dados simulados para tendências
const historicalRates = ref({
  USD_EUR: [0.85, 0.86, 0.84, 0.87, 0.85, 0.83, 0.86],
  USD_GBP: [0.73, 0.74, 0.72, 0.75, 0.73, 0.71, 0.74],
  USD_JPY: [110.5, 112.3, 109.8, 111.2, 110.7, 109.5, 111.8]
})

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const fromCurrencyName = computed(() => {
  const currency = currencies.value.find(c => c.code === fromCurrency.value)
  return currency ? currency.name : ''
})

const toCurrencyName = computed(() => {
  const currency = currencies.value.find(c => c.code === toCurrency.value)
  return currency ? currency.name : ''
})

const convertedAmount = computed(() => {
  if (!amount.value) return 0
  return convertCurrency(parseFloat(amount.value), fromCurrency.value, toCurrency.value)
})

const getExchangeRate = (from, to) => {
  if (from === to) return 1
  
  const fromCurr = currencies.value.find(c => c.code === from)
  const toCurr = currencies.value.find(c => c.code === to)
  
  if (!fromCurr || !toCurr) return 1
  
  // Converter via USD como base
  return toCurr.rate / fromCurr.rate
}

const formatRate = (rate) => {
  if (rate >= 1) {
    return rate.toFixed(4)
  } else {
    return rate.toFixed(6)
  }
}

const getChangePercentage = (currencyCode) => {
  // Simulação de mudança
  const change = (Math.random() - 0.5) * 2
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
}

const getChangeClass = (currencyCode) => {
  const change = Math.random() - 0.5
  return change >= 0 ? 'positive' : 'negative'
}

const swapCurrencies = () => {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
}

const convert = async () => {
  // A conversão já é computada em tempo real
  console.log('Converted:', amount.value, fromCurrency.value, 'to', toCurrency.value)
}

const exportRates = () => {
  const ratesData = currencies.value.map(currency => ({
    Currency: `${currency.flag} ${currency.code}`,
    Name: currency.name,
    Rate: `1 ${baseCurrency.value} = ${formatRate(1 / getExchangeRate(baseCurrency.value, currency.code))} ${currency.code}`,
    Country: currency.country
  }))
  
  exportToCSV(ratesData, 'exchange-rates')
}

const updateTrendChart = () => {
  renderTrendChart()
}

const renderTrendChart = () => {
  if (!trendChart.value) return
  
  const ctx = trendChart.value.getContext('2d')
  
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  // Dados simulados
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const ratesKey = `USD_${trendCurrency.value}`
  const data = historicalRates.value[ratesKey] || Array(7).fill(1).map(() => 0.85 + Math.random() * 0.1)
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${baseCurrency.value}/${trendCurrency.value}`,
        data,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: `Rate (1 ${baseCurrency.value} = X ${trendCurrency.value})`
          }
        }
      }
    }
  })
}

onMounted(() => {
  fetchCurrencies().then(() => {
    renderTrendChart()
  })
})
</script>

<style scoped>
.currency {
  padding: 20px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

h1 {
  margin: 0 0 30px 0;
  color: #4b5563;
}

.converter-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.amount-section {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.swap-button {
  font-size: 1.5em;
  cursor: pointer;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: background 0.2s;
}

.swap-button:hover {
  background: #e0e0e0;
}

.currency-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.currency-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.currency-input label {
  font-weight: 500;
  color: #555;
}

.currency-info {
  font-size: 0.9em;
  color: #666;
  padding: 5px 0;
}

.result-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.result-card {
  flex: 1;
  padding: 25px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #e0e0e0;
}

.result-card.highlighted {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border-color: #4CAF50;
}

.result-amount {
  font-size: 2.2em;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;
}

.result-label {
  font-size: 0.9em;
  opacity: 0.8;
}

.result-arrow {
  font-size: 2em;
  color: #666;
}

.converter-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.currency-settings {
  margin-top: 30px;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.settings-info {
  color: #666;
  font-size: 0.9em;
  margin-top: 10px;
}

.exchange-rates {
  margin-top: 30px;
}

.rates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.last-updated {
  color: #666;
  font-size: 0.9em;
}

.rates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin: 25px 0;
}

.rate-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.rate-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.rate-item.highlighted {
  border-color: #4CAF50;
  background: #f0f9f0;
}

.rate-flag {
  font-size: 2em;
}

.rate-info {
  flex: 1;
}

.rate-code {
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.rate-name {
  font-size: 0.9em;
  color: #666;
}

.rate-value {
  text-align: right;
}

.rate-amount {
  font-weight: 500;
  margin-bottom: 5px;
  font-family: 'Courier New', monospace;
}

.rate-change {
  font-size: 0.85em;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

.rate-change.positive {
  background: #d4edda;
  color: #155724;
}

.rate-change.negative {
  background: #f8d7da;
  color: #721c24;
}

.rates-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.currency-chart {
  margin-top: 30px;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  margin: 25px 0;
}

.chart-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.loading {
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