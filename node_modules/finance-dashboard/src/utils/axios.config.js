// frontend/src/utils/axios.config.js
import axios from 'axios';

// Helper para verificar se estamos no navegador
const isBrowser = typeof window !== 'undefined';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Apenas no navegador
    if (isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (!error.response) {
      // Network error
      console.error('Network error - please check your connection');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    const { status, data } = error.response;
    
    // Handle 401 errors only in browser
    if (status === 401 && isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Don't redirect from login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject({
      status,
      message: data?.message || 'An error occurred',
      errors: data?.errors || null
    });
  }
);

export default axiosInstance;