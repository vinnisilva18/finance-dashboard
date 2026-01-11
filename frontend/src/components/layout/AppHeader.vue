<template>
  <header class="app-header glass">
    <!-- Left Section -->
    <div class="header-left">
      <button @click="$emit('toggle-sidebar')" class="menu-toggle">
        <span>☰</span>
      </button>
      <div class="breadcrumb">
        <span class="breadcrumb-item">Financeiro</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item current">{{ currentPage }}</span>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="header-center">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Buscar transações, categorias..."
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="search-clear">
          <span>×</span>
        </button>
      </div>
    </div>

    <!-- Right Section -->
    <div class="header-right">
      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="action-btn" title="Adicionar Transação" @click="addTransaction">
          <span class="action-icon">+</span>
        </button>
        <button class="action-btn" title="Notificações" @click="toggleNotifications">
          <span class="action-icon">🔔</span>
          <span v-if="unreadNotifications > 0" class="notification-badge">
            {{ unreadNotifications }}
          </span>
        </button>
        <button class="action-btn" title="Relatório Rápido" @click="generateQuickReport">
          <span class="action-icon">📊</span>
        </button>
      </div>

      <!-- User Menu -->
      <div class="user-menu">
        <div class="user-avatar" @click="toggleUserMenu">
          <img v-if="userAvatar" :src="userAvatar" :alt="userName" />
          <div v-else class="avatar-fallback" :style="{ background: userColor }">
            {{ userInitials }}
          </div>
        </div>
        
        <!-- User Dropdown -->
        <div v-if="showUserMenu" class="user-dropdown" @click.stop>
          <div class="dropdown-header">
            <h4>{{ userName }}</h4>
            <p>{{ userEmail }}</p>
          </div>
          <div class="dropdown-items">
            <router-link to="/profile" class="dropdown-item">
              <span class="dropdown-icon">👤</span>
              <span>Meu Perfil</span>
            </router-link>
            <router-link to="/settings" class="dropdown-item">
              <span class="dropdown-icon">⚙️</span>
              <span>Configurações</span>
            </router-link>
            <div class="dropdown-divider"></div>
            <button @click="logout" class="dropdown-item logout">
              <span class="dropdown-icon">🚪</span>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications Panel -->
    <div v-if="showNotifications" class="notifications-panel glass" @click.stop>
      <div class="notifications-header">
        <h4>Notificações</h4>
        <button @click="markAllAsRead" class="mark-read-btn">
          Marcar todas como lidas
        </button>
      </div>
      <div class="notifications-list">
        <div v-for="notification in notifications" :key="notification.id" 
             class="notification-item" :class="{ unread: !notification.read }">
          <div class="notification-icon" :class="notification.type">
            {{ notificationIcons[notification.type] }}
          </div>
          <div class="notification-content">
            <p class="notification-title">{{ notification.title }}</p>
            <p class="notification-message">{{ notification.message }}</p>
            <span class="notification-time">{{ notification.time }}</span>
          </div>
        </div>
      </div>
      <router-link to="/notifications" class="notifications-footer">
        Ver todas as notificações
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

defineEmits(['toggle-sidebar'])

const searchQuery = ref('')
const showUserMenu = ref(false)
const showNotifications = ref(false)
const unreadNotifications = ref(5)
const userColor = ref('#6366f1')
const userAvatar = ref(null)

const pageTitles = {
  '/': 'Dashboard',
  '/transactions': 'Transações',
  '/categories': 'Categorias',
  '/credit-cards': 'Cartões',
  '/goals': 'Metas',
  '/reports': 'Relatórios',
  '/currency': 'Câmbio',
  '/profile': 'Perfil'
}

const currentPage = computed(() => pageTitles[route.path] || 'Dashboard')

const userName = computed(() => authStore.user?.name || 'Usuário')
const userEmail = computed(() => authStore.user?.email || 'usuario@email.com')
const userInitials = computed(() => {
  const name = userName.value
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const notificationIcons = {
  payment: '💰',
  alert: '⚠️',
  success: '✅',
  info: 'ℹ️'
}

const notifications = ref([
  { id: 1, type: 'payment', title: 'Pagamento Recebido', message: 'Salário depositado na conta', time: '2 min atrás', read: false },
  { id: 2, type: 'alert', title: 'Fatura Vencendo', message: 'Visa Platinum vence em 3 dias', time: '1 hora atrás', read: false },
  { id: 3, type: 'success', title: 'Meta Atingida', message: 'Fundo de emergência atingiu 50%', time: '5 horas atrás', read: true },
  { id: 4, type: 'info', title: 'Novo Relatório', message: 'Relatório mensal disponível', time: '1 dia atrás', read: true }
])

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const addTransaction = () => {
  router.push('/transactions?action=create')
}

const generateQuickReport = () => {
  console.log('Gerando relatório rápido...')
}

const markAllAsRead = () => {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }))
  unreadNotifications.value = 0
}

const clearSearch = () => {
  searchQuery.value = ''
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu')) {
    showUserMenu.value = false
  }
  if (!event.target.closest('.header-right')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 72px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 30;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.menu-toggle {
  background: none;
  border: none;
  color: var(--gray-400);
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.breadcrumb-item {
  color: var(--gray-400);
  transition: var(--transition-fast);
}

.breadcrumb-item:hover {
  color: var(--gray-300);
}

.breadcrumb-item.current {
  color: white;
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--gray-600);
}

.header-center {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search-bar {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: white;
  font-size: 0.875rem;
  transition: var(--transition-fast);
}

.search-input::placeholder {
  color: var(--gray-500);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-500);
  font-size: 1.25rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.search-clear:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--gray-300);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
  color: var(--gray-400);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  font-size: 1.125rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(-1px);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--danger-500);
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
  border: 2px solid var(--bg-primary);
}

.user-menu {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: var(--transition-fast);
}

.user-avatar:hover {
  border-color: var(--primary-500);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1rem;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 40;
  animation: dropdownFade 0.2s ease;
}

.dropdown-header {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dropdown-header h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
}

.dropdown-header p {
  font-size: 0.875rem;
  color: var(--gray-400);
  margin: 0;
}

.dropdown-items {
  padding: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  color: var(--gray-300);
  text-decoration: none;
  transition: var(--transition-fast);
  width: 100%;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.9375rem;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.dropdown-item.logout {
  color: var(--danger-400);
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-300);
}

.dropdown-icon {
  font-size: 1.125rem;
  width: 24px;
  text-align: center;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 0.5rem 0;
}

.notifications-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 380px;
  max-height: 500px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 40;
  animation: dropdownFade 0.2s ease;
  display: flex;
  flex-direction: column;
}

.notifications-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.notifications-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.mark-read-btn {
  background: none;
  border: none;
  color: var(--primary-400);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.mark-read-btn:hover {
  background: rgba(99, 102, 241, 0.1);
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius);
  transition: var(--transition-fast);
  margin-bottom: 0.5rem;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item.unread {
  background: rgba(99, 102, 241, 0.05);
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.notification-icon.payment {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-400);
}

.notification-icon.alert {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-400);
}

.notification-icon.success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-400);
}

.notification-icon.info {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-400);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  font-size: 0.9375rem;
}

.notification-message {
  font-size: 0.875rem;
  color: var(--gray-400);
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.notifications-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  color: var(--primary-400);
  font-weight: 500;
  font-size: 0.875rem;
  transition: var(--transition-fast);
}

.notifications-footer:hover {
  color: var(--primary-300);
  background: rgba(99, 102, 241, 0.05);
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .app-header {
    padding: 0 1rem;
  }
  
  .header-center {
    display: none;
  }
  
  .notifications-panel {
    width: 320px;
    right: -1rem;
  }
}
</style>