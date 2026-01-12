// frontend/src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '../services/apiService'

// Helper para verificar se estamos no navegador
const isBrowser = typeof window !== 'undefined';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(isBrowser ? localStorage.getItem('token') : null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      // Check for demo login
      if (credentials.email === 'demo@financontrol.com' && credentials.password === 'demopass123') {
        // Mock demo login
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockUser = {
          id: 1,
          name: 'Demo User',
          email: 'demo@financontrol.com'
        };

        const mockToken = 'mock-demo-jwt-token-' + Date.now();

        token.value = mockToken
        user.value = mockUser

        if (isBrowser) {
          localStorage.setItem('token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
        }

        return { success: true, data: { token: mockToken, user: mockUser } }
      }

      // Check for mock admin login
      if (credentials.email === 'admin@admin.com' && credentials.password === '123') {
        // Mock admin login
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockUser = {
          id: 1,
          name: 'Admin User',
          email: 'admin@admin.com'
        };

        const mockToken = 'mock-admin-jwt-token-' + Date.now();

        token.value = mockToken
        user.value = mockUser

        if (isBrowser) {
          localStorage.setItem('token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
        }

        return { success: true, data: { token: mockToken, user: mockUser } }
      }

      // Em produção, use a API real
      const response = await apiService.post('/auth/login', credentials)
      const data = response.data
      
      token.value = data.token
      user.value = data.user
      
      if (isBrowser) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return { success: true, data }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.post('/auth/register', userData)
      const data = response.data
      
      token.value = data.token
      user.value = data.user
      
      if (isBrowser) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return { success: true, data }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    if (isBrowser) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const initialize = () => {
    if (isBrowser) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch (e) {
          console.error('Error parsing stored user:', e)
          localStorage.removeItem('user')
        }
      }
    }
  }

  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData }
    if (isBrowser) {
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    initialize,
    updateUser
  }
})