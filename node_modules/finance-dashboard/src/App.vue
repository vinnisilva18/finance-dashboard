<template>
  <div class="app-container" :key="appKey">
    <!-- Unified Sidebar -->
    <aside v-if="isAuthenticated" class="sidebar" :class="{ 'open': showMobileSidebar, 'collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">💰</div>
          <h1 v-show="!isSidebarCollapsed">Finance<span>Pro</span></h1>
        </div>
        <button @click="toggleSidebar" class="sidebar-collapse-desktop">
          <span>◁</span>
        </button>
        <button @click="toggleSidebarMobile" class="sidebar-toggle">
          <span>×</span>
        </button>
      </div>

      <div class="sidebar-content">
        <div class="user-info">
          <div class="avatar" :style="{ backgroundColor: userColor }" :title="user?.name">
            {{ userInitials }}
          </div>
          <div class="user-details" v-show="!isSidebarCollapsed">
            <h3>{{ user?.name || 'Usuário' }}</h3>
            <p>{{ user?.email || 'user@example.com' }}</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <router-link to="/" class="nav-item" exact-active-class="active" @click="showMobileSidebar = false" :title="isSidebarCollapsed ? 'Painel' : ''">
            <span class="nav-icon">📊</span>
            <span class="nav-text" v-show="!isSidebarCollapsed">Painel</span>
          </router-link>

          <router-link to="/transactions" class="nav-item" active-class="active" @click="showMobileSidebar = false" :title="isSidebarCollapsed ? 'Transações' : ''">
            <span class="nav-icon">💳</span>
            <span class="nav-text" v-show="!isSidebarCollapsed">Transações</span>
          </router-link>

          <router-link to="/categories" class="nav-item" active-class="active" @click="showMobileSidebar = false" :title="isSidebarCollapsed ? 'Categorias' : ''">
            <span class="nav-icon">🏷️</span>
            <span class="nav-text" v-show="!isSidebarCollapsed">Categorias</span>
          </router-link>

          <router-link to="/credit-cards" class="nav-item" active-class="active" @click="showMobileSidebar = false" :title="isSidebarCollapsed ? 'Cartões' : ''">
            <span class="nav-icon">💳</span>
            <span class="nav-text" v-show="!isSidebarCollapsed">Cartões</span>
          </router-link>

          <router-link to="/goals" class="nav-item" active-class="active" @click="showMobileSidebar = false" :title="isSidebarCollapsed ? 'Metas' : ''">
            <span class="nav-icon">🎯</span>
            <span class="nav-text" v-show="!isSidebarCollapsed">Metas</span>
          </router-link>

          <router-link to="/reports" class="nav-item" active-class="active" @click="showMobileSidebar = false" :title="isSidebarCollapsed ? 'Relatórios' : ''">
            <span class="nav-icon">📈</span>
            <span class="nav-text" v-show="!isSidebarCollapsed">Relatórios</span>
          </router-link>

          <router-link to="/currency" class="nav-item" active-class="active" @click="showMobileSidebar = false" :title="isSidebarCollapsed ? 'Câmbio' : ''">
            <span class="nav-icon">🌎</span>
            <span class="nav-text" v-show="!isSidebarCollapsed">Câmbio</span>
          </router-link>

          <router-link to="/profile" class="nav-item" active-class="active" @click="showMobileSidebar = false" :title="isSidebarCollapsed ? 'Perfil' : ''">
            <span class="nav-icon">👤</span>
            <span class="nav-text" v-show="!isSidebarCollapsed">Perfil</span>
          </router-link>
        </nav>

        <div class="sidebar-footer">
          <button @click.stop="logout" class="logout-btn" :title="isSidebarCollapsed ? 'Sair' : ''">
            <span class="logout-icon">🚪</span>
            <span v-show="!isSidebarCollapsed">Sair</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile sidebar overlay -->
    <div v-if="isAuthenticated && showMobileSidebar"
         class="sidebar-overlay"
         @click="toggleSidebarMobile"></div>

    <!-- Main content -->
    <main class="main-content" :class="{ 'with-sidebar': isAuthenticated, 'collapsed': isSidebarCollapsed }">
      <!-- Top bar for mobile -->
      <header v-if="isAuthenticated" class="top-bar">
        <button @click="toggleSidebarMobile" class="menu-toggle">
          <span>☰</span>
        </button>
        <h2 class="page-title">{{ currentPageTitle }}</h2>
        <div class="top-bar-actions">
          <button class="notifications-btn">
            <span>🔔</span>
            <span v-if="unreadNotifications > 0" class="notification-badge">
              {{ unreadNotifications }}
            </span>
          </button>
        </div>
      </header>

      <!-- Page content -->
      <div class="page-container">
        <router-view />
      </div>
    </main>

    <!-- Notifications toast -->
    <div v-if="notification" class="notification-toast" :class="notification.type">
      {{ notification.message }}
      <button @click="dismissNotification" class="toast-close">×</button>
    </div>

    <!-- Loading overlay -->
    <div v-if="globalLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onActivated, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useUIStore } from './stores/ui'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

const appKey = ref(0)
const notification = ref(null)
const globalLoading = ref(false)
const unreadNotifications = ref(3)
const userColor = ref('#6366f1')

// Use computed properties to get/set from UI store
const showMobileSidebar = computed({
  get: () => uiStore.showMobileSidebar,
  set: (value) => { uiStore.showMobileSidebar = value }
})

const isSidebarCollapsed = computed({
  get: () => uiStore.isSidebarCollapsed,
  set: (value) => { uiStore.isSidebarCollapsed = value }
})

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

// Função para resetar completamente o estado da aplicação
const resetAppState = () => {
  uiStore.resetSidebar()
  notification.value = null
  globalLoading.value = false
  userColor.value = '#6366f1'
}

const toggleSidebar = () => {
  uiStore.toggleSidebar()
}

const toggleSidebarMobile = () => {
  uiStore.toggleSidebarMobile()
}

const logout = async () => {
  // Resetar estado antes de fazer logout
  resetAppState()
  
  // Fazer logout
  authStore.logout()
  
  // Forçar re-renderização completa
  appKey.value++
  
  // Aguardar próximo ciclo de renderização
  await nextTick()
  
  // Navegar para login
  router.push('/login')
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

  // Restaurar estado da sidebar apenas se estiver autenticado
  if (isAuthenticated.value) {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed')
    if (savedSidebarState === 'true') {
      uiStore.isSidebarCollapsed = true
    }
  } else {
    // Garantir que sidebar esteja resetada se não autenticado
    resetAppState()
  }
})

// Watch para a rota - IMPORTANTE: simplificado
watch(() => route.path, (newPath) => {
  // Fechar sidebar mobile sempre que a rota mudar
  uiStore.closeMobileSidebar()
  
  // Se navegou para login, resetar completamente
  if (newPath === '/login') {
    resetAppState()
    localStorage.removeItem('sidebarCollapsed')
  }
})

// Watch para autenticação - CORREÇÃO IMPORTANTE
watch(isAuthenticated, (newValue, oldValue) => {
  console.log('Auth changed from', oldValue, 'to', newValue)

  if (!newValue && oldValue !== undefined) {
    // Usuário acabou de fazer logout
    resetAppState()
  } else if (newValue && oldValue === false) {
    // Usuário acabou de fazer login
    resetAppState()
    // Sempre expandir a sidebar no login para melhor UX
  }
})

// Adicionar para debug
watch([() => uiStore.isSidebarCollapsed, () => uiStore.showMobileSidebar], 
  ([collapsed, mobile]) => {
    console.log('UI State:', { collapsed, mobile, isAuthenticated: isAuthenticated.value })
  }
)
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
  /* Garantir que a sidebar esteja fechada por padrão em mobile */
  .sidebar:not(.open) {
    transform: translateX(-100%);
  }

  .main-content.with-sidebar,
  .main-content.collapsed {
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

/* ADICIONE ESTAS REGRAS NO FINAL DO SEU CSS */

/* Garantir transições suaves */
.sidebar {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content {
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Garantir que quando não autenticado, o conteúdo ocupe 100% */
.app-container:has(.main-content:not(.with-sidebar)) .main-content {
  margin-left: 0 !important;
  width: 100% !important;
}

/* Correção para quando sidebar está colapsada */
.sidebar.collapsed ~ .main-content.collapsed {
  margin-left: 80px !important;
}

/* Correção para quando sidebar está expandida */
.sidebar:not(.collapsed) ~ .main-content.with-sidebar:not(.collapsed) {
  margin-left: 280px !important;
}

/* Garantir que a sidebar móvel funcione corretamente */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    z-index: 100;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar.collapsed,
  .sidebar:not(.collapsed) {
    width: 280px; /* Largura fixa em mobile */
  }
  
  .main-content.with-sidebar,
  .main-content.collapsed {
    margin-left: 0 !important;
    width: 100% !important;
  }
}
</style>