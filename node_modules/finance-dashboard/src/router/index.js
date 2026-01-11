// frontend/src/router/index.js
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/Categories.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/credit-cards',
    name: 'CreditCards',
    component: () => import('../views/CreditCards.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/goals',
    name: 'Goals',
    component: () => import('../views/Goals.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/currency',
    name: 'Currency',
    component: () => import('../views/Currency.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

// Usa hash mode para compatibilidade com Vercel/GitHub Pages
const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(), // Alternativa se history mode não funcionar
  routes
})

// Proteção de rotas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Inicializa a store
  authStore.initialize()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router