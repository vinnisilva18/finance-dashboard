import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const api = axios.create({
    baseURL: '/api',
    headers: {
      'Authorization': token.value ? `Bearer ${token.value}` : ''
    }
  })

  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/api/auth/login', credentials)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/api/auth/register', userData)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao registrar'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/api/auth/logout')
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchProfile() {
    try {
      const response = await api.get('/api/auth/profile')
      user.value = response.data
    } catch (err) {
      logout()
    }
  }

  async function updateProfile(profileData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put('/api/auth/profile', profileData)
      user.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar perfil'
      throw err
    } finally {
      loading.value = false
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
    fetchProfile,
    updateProfile
  }
})