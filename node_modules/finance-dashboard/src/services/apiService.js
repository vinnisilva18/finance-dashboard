import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://finance-dashboard-backend-ashy.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  // Garante que não envia "undefined" ou "null" como string, o que causa erro no backend
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token.trim()}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    // Se o backend retornar 401 (Token inválido/expirado), faz logout forçado
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redireciona para login se não estiver lá
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default {
  get(resource, params) {
    return apiClient.get(resource, { params })
  },
  post(resource, data) {
    return apiClient.post(resource, data)
  },
  put(resource, data) {
    return apiClient.put(resource, data)
  },
  delete(resource) {
    return apiClient.delete(resource)
  }
}