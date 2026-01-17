<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showMobileSidebar = ref(false)
const isSidebarCollapsed = ref(false)
const notification = ref(null)
const globalLoading = ref(false)
const unreadNotifications = ref(3)
const userColor = ref('#6366f1')

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const currentPageTitle = computed(() => {
  const titles = {
    '/': 'Painel',
    '/transactions': 'Transações',
    '/categories': 'Categorias',
    '/credit-cards': 'Cartões de Crédito',
    '/goals': 'Metas Financeiras',
    '/reports': 'Relatórios',
    '/currency': 'Câmbio',
    '/profile': 'Perfil',
    '/login': 'Login'
  }
  return titles[route.path] || 'FinancePro'
})

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleSidebarMobile = () => {
  showMobileSidebar.value = !showMobileSidebar.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
  showMobileSidebar.value = false
}

const showNotification = (message, type = 'info') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 5000)
}

const dismissNotification = () => {
  notification.value = null
}

onMounted(() => {
  const savedColor = localStorage.getItem('userColor')
  if (savedColor) {
    userColor.value = savedColor
  }

  // Initialize auth on app startup
  authStore.initialize()
})

// Fechar sidebar ao navegar
watch(() => route.path, () => {
  showMobileSidebar.value = false
})
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: white;
  margin: 0;
  padding: 0;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transition: transform 0.3s ease;
  box-shadow: var(--shadow-lg);
  color: #4b5563;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-collapse-desktop {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  padding: 0.5rem;
  border-radius: var(--radius);
}

.sidebar-collapse-desktop:hover {
  background: #f3f4f6;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.logo h1 span {
  color: var(--primary-500);
}

.sidebar-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  display: none;
  align-items: center;
  justify-content: center;
}

.sidebar-toggle:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.sidebar-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  color: #4b5563;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  color: #4b5563;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.user-details h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  white-space: nowrap;
}

.user-details p {
  font-size: 0.875rem;
  color: #6b7280;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  color: #6b7280;
  text-decoration: none;
  transition: var(--transition);
  font-weight: 500;
  white-space: nowrap;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.nav-item.active {
  background: #dbeafe;
  color: var(--primary-600);
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 0.9375rem;
}

.sidebar-footer {
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: var(--radius);
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.logout-btn:hover {
  background: #e5e7eb;
  color: #4b5563;
}

.logout-icon {
  font-size: 1.25rem;
}

/* Main Content */
.main-content {
  flex: 1;
  min-height: 100vh;
  width: 100%;
  transition: margin-left 0.3s ease;
  margin: 0;
  padding: 0;
  background: #f3f4f6; /* Conteúdo cinza claro */
  color: #374151; /* Texto cinza chumbo */
}

.main-content.with-sidebar {
  margin-left: 280px;
}

.main-content.collapsed {
  margin-left: 80px;
}

/* Top Bar */
.top-bar {
  background: white; /* Faixa branca */
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 40;
  box-shadow: var(--shadow-sm);
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #cbd5e0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  align-items: center;
  justify-content: center;
}

.menu-toggle:hover {
  background: #4a5568;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937; /* Texto escuro na barra branca */
  flex: 1;
}

.top-bar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notifications-btn {
  position: relative;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6b7280;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notifications-btn:hover {
  background: #f3f4f6;
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--danger);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* Page Container */
.page-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 49;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: var(--radius);
  background: white;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 100;
  animation: slideIn 0.3s ease;
  max-width: 400px;
}

.notification-toast.info {
  border-left: 4px solid var(--info);
}

.notification-toast.success {
  border-left: 4px solid var(--secondary);
}

.notification-toast.warning {
  border-left: 4px solid var(--warning);
}

.notification-toast.danger {
  border-left: 4px solid var(--danger);
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray-500);
  margin-left: auto;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: var(--gray-700);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(75, 85, 99, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  gap: 1rem;
}

.loading-overlay p {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content.with-sidebar {
    margin-left: 0;
  }
  
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-toggle {
    display: flex;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .mobile-only {
    display: block;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .top-bar {
    padding: 0.75rem 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .notification-toast {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}

@media (max-width: 640px) {
  .sidebar {
    width: 100%;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>