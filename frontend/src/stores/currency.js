import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const currencies = ref([])
  const baseCurrency = ref('USD')

  const setCurrencies = (newCurrencies) => {
    currencies.value = newCurrencies
  }

  const setBaseCurrency = (currencyCode) => {
    baseCurrency.value = currencyCode
  }

  const getCurrencyByCode = (code) => {
    return currencies.value.find(c => c.code === code)
  }

  return {
    currencies,
    baseCurrency,
    setCurrencies,
    setBaseCurrency,
    getCurrencyByCode
  }
})