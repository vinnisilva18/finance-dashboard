import { ref, computed } from 'vue'
import { useCurrencyStore } from '../stores/currency'
import { localStorageService } from '../services/localStorageService'

const CURRENCIES_STORAGE_KEY = 'currencies'
const BASE_CURRENCY_STORAGE_KEY = 'base_currency'

const defaultCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, country: 'United States', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85, country: 'European Union', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73, country: 'United Kingdom', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.5, country: 'Japan', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25, country: 'Canada', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35, country: 'Australia', flag: '🇦🇺' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2, country: 'Brazil', flag: '🇧🇷' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45, country: 'China', flag: '🇨🇳' }
]

export const useCurrencies = () => {
  const currencyStore = useCurrencyStore()
  
  const error = ref(null)

  const fetchCurrencies = async () => {
    error.value = null
    try {
      let currencies = localStorageService.getData(CURRENCIES_STORAGE_KEY)
      if (!currencies) {
        currencies = defaultCurrencies
        localStorageService.saveData(CURRENCIES_STORAGE_KEY, currencies)
      }
      currencyStore.setCurrencies(currencies)

      let baseCurrency = localStorageService.getData(BASE_CURRENCY_STORAGE_KEY)
      if (!baseCurrency) {
        baseCurrency = 'BRL'
        localStorageService.saveData(BASE_CURRENCY_STORAGE_KEY, baseCurrency)
      }
      currencyStore.setBaseCurrency(baseCurrency)

    } catch (err) {
      error.value = 'Failed to fetch currencies'
    }
  }

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const from = currencyStore.currencies.find(c => c.code === fromCurrency)
    const to = currencyStore.currencies.find(c => c.code === toCurrency)
    
    if (!from || !to) return amount
    
    // Converter via USD como moeda base
    const amountInUSD = amount / from.rate
    return amountInUSD * to.rate
  }

  const updateRates = async () => {
    error.value = null
    try {
      // Atualizar taxas aleatoriamente (simulação)
      const updatedCurrencies = currencyStore.currencies.map(currency => ({
        ...currency,
        rate: currency.code === 'USD' ? 1 : currency.rate * (0.95 + Math.random() * 0.1)
      }))
      
      localStorageService.saveData(CURRENCIES_STORAGE_KEY, updatedCurrencies)
      currencyStore.setCurrencies(updatedCurrencies)
    } catch (err) {
      error.value = 'Failed to update currency rates'
    }
  }

  const setBaseCurrency = async (currencyCode) => {
    error.value = null
    try {
      localStorageService.saveData(BASE_CURRENCY_STORAGE_KEY, currencyCode)
      currencyStore.setBaseCurrency(currencyCode)
    } catch (err) {
      error.value = 'Failed to set base currency'
      throw err
    }
  }

  return {
    currencies: computed(() => currencyStore.currencies),
    baseCurrency: computed(() => currencyStore.baseCurrency),
    loading: ref(false), // Still here but not used for blocking
    error,
    fetchCurrencies,
    convertCurrency,
    updateRates,
    setBaseCurrency
  }
}