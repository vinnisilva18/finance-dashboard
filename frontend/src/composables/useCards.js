import { ref, computed } from 'vue'
import { useCardStore } from '../stores/card'
import { localStorageService } from '../services/localStorageService'

const CARDS_STORAGE_KEY = 'cards'

export const useCards = () => {
  const cardStore = useCardStore()
  
  const loading = ref(false)
  const error = ref(null)

  const fetchCards = async () => {
    loading.value = true
    error.value = null
    
    try {
      const cards = localStorageService.getData(CARDS_STORAGE_KEY) || []
      cardStore.setCards(cards)
    } catch (err) {
      error.value = 'Failed to fetch credit cards'
    } finally {
      loading.value = false
    }
  }

  const addCard = async (card) => {
    loading.value = true
    try {
      const newCard = {
        ...card,
        id: Date.now(),
        number: `**** **** **** ${card.lastFourDigits}`
      }
      const cards = localStorageService.getData(CARDS_STORAGE_KEY) || []
      const updatedCards = [...cards, newCard]
      localStorageService.saveData(CARDS_STORAGE_KEY, updatedCards)
      cardStore.addCard(newCard)
    } catch (err) {
      error.value = 'Failed to add credit card'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCard = async (id, updates) => {
    loading.value = true
    try {
      let cards = localStorageService.getData(CARDS_STORAGE_KEY) || []
      const index = cards.findIndex(c => c.id === id)
      if (index !== -1) {
        cards[index] = { ...cards[index], ...updates }
        localStorageService.saveData(CARDS_STORAGE_KEY, cards)
        cardStore.updateCard(id, updates)
      }
    } catch (err) {
      error.value = 'Failed to update credit card'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCard = async (id) => {
    loading.value = true
    try {
      let cards = localStorageService.getData(CARDS_STORAGE_KEY) || []
      const updatedCards = cards.filter(c => c.id !== id)
      localStorageService.saveData(CARDS_STORAGE_KEY, updatedCards)
      cardStore.deleteCard(id)
    } catch (err) {
      error.value = 'Failed to delete credit card'
      throw err
    } finally {
      loading.value = false
    }
  }

  const totalCreditLimit = computed(() => {
    return cardStore.cards.reduce((sum, card) => sum + card.limit, 0)
  })

  const totalBalance = computed(() => {
    return cardStore.cards.reduce((sum, card) => sum + card.balance, 0)
  })

  const availableCredit = computed(() => {
    return totalCreditLimit.value - totalBalance.value
  })

  const utilizationRate = computed(() => {
    return totalCreditLimit.value > 0 ? totalBalance.value / totalCreditLimit.value : 0
  })

  return {
    cards: computed(() => cardStore.cards),
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
  }
}