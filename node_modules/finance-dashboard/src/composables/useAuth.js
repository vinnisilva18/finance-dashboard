import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  
  const loading = ref(false)
  const error = ref(null)

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authStore.login(credentials)
      if (result.success) {
        router.push('/')
      } else {
        error.value = result.message
      }
    } catch (err) {
      error.value = 'Login failed. Please try again.'
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authStore.logout()
    router.push('/login')
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulação de registro
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (userData.email && userData.password) {
        return { success: true, message: 'Registration successful' }
      } else {
        throw new Error('Invalid registration data')
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    loading,
    error,
    login,
    logout,
    register
  }
}