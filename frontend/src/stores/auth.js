import { defineStore } from 'pinia'
import apiService from '../services/apiService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null, // Irá guardar o objeto do usuário: { id, name, email, ... }
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
        this.logout()
      }
    },

    /**
     * Limpa os dados de autenticação e redireciona para o login.
     */
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete apiService.defaults.headers.common['Authorization']
      window.location.href = '/login' // Redireciona para a página de login
    },
  },
})