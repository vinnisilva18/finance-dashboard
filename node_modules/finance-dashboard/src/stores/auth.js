// frontend/src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

      // Para desenvolvimento, use dados mockados
      if (!import.meta.env.VITE_API_URL) {
        // Mock login for development
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser = {
          id: 1,
          name: 'Demo User',
          email: credentials.email || 'demo@example.com'
        };

        const mockToken = 'mock-jwt-token-' + Date.now();

        token.value = mockToken
        user.value = mockUser

        if (isBrowser) {
          localStorage.setItem('token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
        }

        return { success: true, data: { token: mockToken, user: mockUser } }
      }
      
      // Em produção, use a API real
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      
      token.value = data.token
      user.value = data.user
      
      if (isBrowser) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Login failed'
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      if (!import.meta.env.VITE_API_URL) {
        // Mock registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser = {
          id: Date.now(),
          name: userData.name || 'New User',
          email: userData.email
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        token.value = mockToken
        user.value = mockUser
        
        if (isBrowser) {
          localStorage.setItem('token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
        }
        
        return { success: true, data: { token: mockToken, user: mockUser } }
      }
      
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const data = await response.json();
      
      token.value = data.token
      user.value = data.user
      
      if (isBrowser) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Registration failed'
      return { success: false, message: err.message }
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