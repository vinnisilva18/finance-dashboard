// frontend/src/stores/auth.js
import { defineStore } from 'pinia'
import apiService from '../services/apiService'

// Helper para verificar se estamos no navegador
const isBrowser = typeof window !== 'undefined'

// Função auxiliar para obter o usuário do localStorage de forma segura
function getInitialUser() {
  if (!isBrowser) {
    return null
  }
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      return JSON.parse(storedUser)
    } catch (e) {
      console.error('Erro ao processar dados do usuário.', e)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return null
    }
  }
  return null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: isBrowser ? localStorage.getItem('token') || null : null,
    user: getInitialUser(),
    error: null,
    loading: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userName: (state) => state.user?.name || 'Usuário',
    userEmail: (state) => state.user?.email || '',
  },
  
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        // API real
        const response = await apiService.post('/auth/login', credentials)
        const { token, user } = response.data

        if (!token || !user) {
          throw new Error('Resposta de login inválida do servidor.')
        }

        this.token = token
        this.user = user

        if (isBrowser) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
        }

        return { success: true, data: response.data }
        
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'E-mail ou senha inválidos.'
        this.error = errorMessage
        return { success: false, message: errorMessage }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.post('/auth/register', userData)
        const { token, user } = response.data

        if (!token || !user) {
          throw new Error('Resposta de registro inválida do servidor.')
        }

        this.token = token
        this.user = user
        
        if (isBrowser) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
        }

        return { success: true, data: response.data }
        
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Não foi possível criar a conta.'
        this.error = errorMessage
        return { success: false, message: errorMessage }
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.token) return

      try {
        const response = await apiService.get('/auth/me')
        this.user = response.data
        if (isBrowser) {
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      } catch (error) {
        console.error('Falha ao buscar dados do usuário.', error)
        this.logout()
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.error = null
      this.loading = false
      
      if (isBrowser) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('sidebarCollapsed') // Limpa estado da sidebar
      }

      // IMPORTANTE: Não usar window.location.href aqui
    },

    updateUser(userData) {
      this.user = { ...this.user, ...userData }
      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    initialize() {
      // Função para inicialização, se necessário
      console.log('Auth store inicializado')
    }
  }
})