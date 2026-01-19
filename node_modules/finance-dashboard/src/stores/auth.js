import { defineStore } from 'pinia'
import apiService from '../services/apiService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null, // Irá guardar o objeto do usuário: { id, name, email, ... }
    loading: false,
    error: null,
  }),
  getters: {
    /**
     * Retorna true se o usuário estiver autenticado.
     */
    isAuthenticated: (state) => !!state.token && !!state.user,
    /**
     * Retorna o nome do usuário com um fallback para 'Usuário'.
     */
    userName: (state) => state.user?.name || 'Usuário',
  },
  actions: {
    /**
     * Realiza o login do usuário.
     */
    async login(credentials) {
      this.loading = true
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
        apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return { success: true }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'E-mail ou senha inválidos.'
        this.error = errorMessage
        return { success: false, message: errorMessage }
      } finally {
        this.loading = false
      }
    },

    /**
     * Registra um novo usuário.
     */
    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await apiService.post('/auth/register', userData)
        const { token, user } = response.data

        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Não foi possível criar a conta.'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    /**
     * Busca os dados do usuário logado a partir do backend.
     */
    async fetchUser() {
      if (!this.token || this.user) return // Não faz nada se não houver token ou se o usuário já foi carregado

      try {
        // IMPORTANTE: Verifique se a rota '/api/auth/me' está correta.
        // Pode ser '/api/user', '/api/profile', etc., dependendo do seu backend.
        const response = await apiService.get('/auth/me')
        this.user = response.data
      } catch (error) {
        console.error('Falha ao buscar dados do usuário. O token pode ser inválido.', error)
        // Se falhar, o token provavelmente é inválido, então deslogamos.
        this.logout(false)
      }
    },

    /**
     * Limpa os dados de autenticação e redireciona para o login.
     */
    logout(redirect = true) {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete apiService.defaults.headers.common['Authorization']
      if (redirect) {
        window.location.href = '/login' // Redireciona para a página de login
      }
    },
  },
})