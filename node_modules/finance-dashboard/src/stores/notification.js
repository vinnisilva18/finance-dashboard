import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  const addNotification = (notification) => {
    const id = Date.now()
    notifications.value.unshift({
      id,
      ...notification,
      read: false,
      timestamp: new Date().toISOString()
    })
    
    // Auto-remove após 10 segundos
    setTimeout(() => {
      removeNotification(id)
    }, 10000)
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  const clearAll = () => {
    notifications.value = []
  }

  const unreadCount = () => {
    return notifications.value.filter(n => !n.read).length
  }

  // Notificações iniciais
  const initializeNotifications = () => {
    notifications.value = [
      {
        id: 1,
        type: 'info',
        title: 'Welcome to Finance Dashboard',
        message: 'Start managing your finances effectively',
        read: true,
        timestamp: '2024-01-01T10:00:00'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Credit Card Payment Due',
        message: 'Payment for Visa Platinum is due in 3 days',
        read: false,
        timestamp: '2024-01-10T09:30:00'
      },
      {
        id: 3,
        type: 'success',
        title: 'Goal Progress',
        message: 'Emergency Fund is 65% complete!',
        read: false,
        timestamp: '2024-01-10T08:15:00'
      }
    ]
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount,
    initializeNotifications
  }
})