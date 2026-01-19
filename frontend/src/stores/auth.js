import { defineStore } from 'pinia'
import apiService from '../services/apiService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userName: (state) => state.user?.name || 'Usuário',
  },
  actions: {
    async login(credentials) {
      this.error = null
      try {
        const response = await apiService.post('/auth/login', credentials)
        const { token, user } = response.data

        if (!token || !user) {
          throw new Error('Resposta de login inválida do servidor.')
        }

        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return { success: true }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'E-mail ou senha inválidos.'
        this.error = errorMessage
        return { success: false, message: errorMessage }
      }
    },

    async register(userData) {
      this.error = null
      try {
        const response = await apiService.post('/auth/register', userData)
        const { token, user } = response.data

        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Não foi possível criar a conta.'
        return { success: false, message: this.error }
      }
    },

    async fetchUser() {
      if (!this.token) return

      try {
        const response = await apiService.get('/auth/me')
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        console.error('Falha ao buscar dados do usuário.', error)
        this.logout()
      }
    },

    // MUDANÇA IMPORTANTE: Remover window.location.href
    logout() {
      this.token = null
      this.user = null
      this.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete apiService.defaults.headers.common['Authorization']
      // NÃO usar window.location.href aqui
    },
  },
})