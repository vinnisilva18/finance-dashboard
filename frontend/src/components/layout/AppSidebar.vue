<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <span>💰</span>
        </div>
        <div class="logo-text">
          <h1>Finan<span class="text-gradient">C</span>ontrol</h1>
          <p class="logo-subtitle">Dashboard Financeiro</p>
        </div>
      </div>
      <button v-if="isMobile" @click="$emit('close')" class="sidebar-close">
        <span>×</span>
      </button>
    </div>

    <!-- User Profile -->
    <div class="user-profile glass">
      <div class="user-avatar" :style="{ background: userColor }">
        {{ userInitials }}
      </div>
      <div class="user-info">
        <h3>{{ userName }}</h3>
        <p>{{ userEmail }}</p>
      </div>
      <div class="user-status">
        <div class="status-dot active"></div>
        <span>Online</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h4 class="section-title">PRINCIPAL</h4>
        <router-link to="/" class="nav-item" exact-active-class="active">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Dashboard</span>
          <span class="nav-badge" v-if="unreadAlerts > 0">{{ unreadAlerts }}</span>
        </router-link>
        
        <router-link to="/transactions" class="nav-item" active-class="active">
          <span class="nav-icon">💳</span>
          <span class="nav-text">Transações</span>
        </router-link>
        
        <router-link to="/categories" class="nav-item" active-class="active">
          <span class="nav-icon">🏷️</span>
          <span class="nav-text">Categorias</span>
        </router-link>
      </div>

      <div class="nav-section">
        <h4 class="section-title">INVESTIMENTOS</h4>
        <router-link to="/credit-cards" class="nav-item" active-class="active">
          <span class="nav-icon">💳</span>
          <span class="nav-text">Cartões</span>
          <span class="nav-badge warning" v-if="pendingPayments > 0">{{ pendingPayments }}</span>
        </router-link>
        
        <router-link to="/goals" class="nav-item" active-class="active">
          <span class="nav-icon">🎯</span>
          <span class="nav-text">Metas</span>
        </router-link>
        
        <router-link to="/reports" class="nav-item" active-class="active">
          <span class="nav-icon">📈</span>
          <span class="nav-text">Relatórios</span>
        </router-link>
      </div>

      <div class="nav-section">
        <h4 class="section-title">CONFIGURAÇÕES</h4>
        <router-link to="/currency" class="nav-item" active-class="active">
          <span class="nav-icon">🌎</span>
          <span class="nav-text">Câmbio</span>
        </router-link>
        
        <router-link to="/profile" class="nav-item" active-class="active">
          <span class="nav-icon">👤</span>
          <span class="nav-text">Perfil</span>
        </router-link>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer glass">
      <div class="account-balance">
        <p class="balance-label">Saldo Total</p>
        <p class="balance-amount">R$ {{ formatCurrency(totalBalance) }}</p>
      </div>
      <button @click="logout" class="logout-btn">
        <span class="logout-icon">🚪</span>
        <span>Sair</span>
      </button>
    </div>

    <!-- Theme Toggle -->
    <div class="theme-toggle">
      <button @click="toggleTheme" class="theme-btn">
        <span class="theme-icon">{{ isDarkMode ? '🌙' : '☀️' }}</span>
        <span>{{ isDarkMode ? 'Modo Escuro' : 'Modo Claro' }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { formatCurrency } from '../../utils/formatters'

const router = useRouter()
const authStore = useAuthStore()

defineProps({
  isMobile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const isDarkMode = ref(true)
const unreadAlerts = ref(3)
const pendingPayments = ref(2)
const userColor = ref('#6366f1')
const totalBalance = ref(15428.75)

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

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  background: white;
  color: #1f2937;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #e5e7eb;
}

.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-500), var(--success-500));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.logo-text h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.125rem;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  opacity: 0.7;
}

.sidebar-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #f3f4f6;
  border: none;
  color: #4b5563;
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: var(--transition-fast);
}

.sidebar-close:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.user-profile {
  margin: 1.5rem;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  background: #f9fafb;
}

.user-avatar {
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

.user-info {
  flex: 1;
}

.user-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1f2937;
}

.user-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.active {
  background: var(--success-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--gray-500);
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  color: var(--gray-400);
  text-decoration: none;
  transition: var(--transition-fast);
  margin-bottom: 0.25rem;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--gray-200);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.2), transparent);
  color: white;
  border-left: 3px solid var(--primary-500);
}

.nav-icon {
  font-size: 1.125rem;
  width: 24px;
  text-align: center;
}

.nav-text {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
}

.nav-badge {
  background: var(--primary-500);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

.nav-badge.warning {
  background: var(--warning-500);
}

.sidebar-footer {
  margin: 1.5rem;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
}

.account-balance {
  margin-bottom: 1rem;
}

.balance-label {
  font-size: 0.875rem;
  color: var(--gray-400);
  margin-bottom: 0.25rem;
}

.balance-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius);
  color: var(--danger-400);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger-300);
}

.logout-icon {
  font-size: 1.125rem;
}

.theme-toggle {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.theme-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
  color: var(--gray-300);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition-fast);
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.theme-icon {
  font-size: 1.125rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 100%;
    max-width: 320px;
  }
}
</style>