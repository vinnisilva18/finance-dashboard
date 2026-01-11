import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCardStore = defineStore('card', () => {
  const cards = ref([])

  const setCards = (newCards) => {
    cards.value = newCards
  }

  const addCard = (card) => {
    cards.value.unshift(card)
  }

  const deleteCard = (id) => {
    cards.value = cards.value.filter(c => c.id !== id)
  }

  const updateCard = (id, updates) => {
    const index = cards.value.findIndex(c => c.id === id)
    if (index !== -1) {
      cards.value[index] = { ...cards.value[index], ...updates }
    }
  }

  const getCardById = (id) => {
    return cards.value.find(c => c.id === id)
  }

  return {
    cards,
    setCards,
    addCard,
    deleteCard,
    updateCard,
    getCardById
  }
})