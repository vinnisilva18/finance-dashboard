<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
    :width="280"
    :breakpoint="768"
    class="sidebar"
  >
    <!-- Logo e Header -->
    <div class="sidebar-header">
      <div class="logo" @click="$router.push('/')">
        <q-icon name="account_balance_wallet" size="32px" color="primary" />
        <div class="logo-text">
          <div class="logo-title">FinanceFlow</div>
          <div class="logo-subtitle">Dashboard</div>
        </div>
      </div>
      <q-btn
        icon="close"
        flat
        round
        dense
        class="close-btn"
        @click="toggleDrawer"
        v-if="$q.screen.lt.md"
      />
    </div>

    <!-- Usuário -->
    <div class="user-section">
      <div class="user-info">
        <q-avatar size="48px" class="user-avatar">
          <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
          <q-icon v-else name="person" size="24px" />
        </q-avatar>
        <div class="user-details">
          <div class="user-name">Olá, {{ authStore.user?.name || 'Usuário' }}</div>
          <div class="user-email" :title="authStore.user?.email">{{ authStore.user?.email || 'user@example.com' }}</div>
        </div>
        <q-btn
          icon="more_vert"
          flat
          round
          dense
          @click="showUserMenu = !showUserMenu"
        />
      </div>

      <!-- Menu do Usuário -->
      <q-menu v-model="showUserMenu" anchor="bottom end" self="top end">
        <q-list style="min-width: 200px;">
          <q-item clickable @click="$router.push('/profile')">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Meu Perfil</q-item-section>
          </q-item>
          <q-item clickable @click="$router.push('/settings')">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>Configurações</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Sair</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>

    <!-- Navegação -->
    <q-scroll-area class="sidebar-scroll">
      <q-list padding class="menu-list">
        <!-- Dashboard -->
        <q-item
          clickable
          :active="activeRoute === 'Dashboard'"
          @click="navigateTo('/')"
          active-class="active-menu-item"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
          <q-badge v-if="unreadNotifications > 0" color="red" floating>
            {{ unreadNotifications }}
          </q-badge>
        </q-item>

        <!-- Transações -->
        <q-expansion-item
          icon="swap_horiz"
          label="Transações"
          :default-opened="activeRoute === 'Transactions'"
          expand-icon-class="expansion-icon"
        >
          <q-list dense>
            <q-item
              clickable
              :active="activeRoute === 'Transactions'"
              @click="navigateTo('/transactions')"
              active-class="active-submenu-item"
            >
              <q-item-section avatar>
                <q-icon name="list" size="18px" />
              </q-item-section>
              <q-item-section>Todas as Transações</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="navigateTo('/transactions?type=income')"
            >
              <q-item-section avatar>
                <q-icon name="trending_up" size="18px" color="positive" />
              </q-item-section>
              <q-item-section>Receitas</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="navigateTo('/transactions?type=expense')"
            >
              <q-item-section avatar>
                <q-icon name="trending_down" size="18px" color="negative" />
              </q-item-section>
              <q-item-section>Despesas</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="navigateTo('/transactions?type=recurring')"
            >
              <q-item-section avatar>
                <q-icon name="autorenew" size="18px" color="warning" />
              </q-item-section>
              <q-item-section>Recorrentes</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Categorias -->
        <q-item
          clickable
          :active="activeRoute === 'Categories'"
          @click="navigateTo('/categories')"
          active-class="active-menu-item"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>Categorias</q-item-section>
        </q-item>

        <!-- Metas Financeiras -->
        <q-item
          clickable
          :active="activeRoute === 'Goals'"
          @click="navigateTo('/goals')"
          active-class="active-menu-item"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="flag" />
          </q-item-section>
          <q-item-section>Metas Financeiras</q-item-section>
          <q-badge v-if="activeGoalsCount > 0" color="warning" floating>
            {{ activeGoalsCount }}
          </q-badge>
        </q-item>

        <!-- Cartões de Crédito -->
        <q-item
          clickable
          :active="activeRoute === 'CreditCards'"
          @click="navigateTo('/cards')"
          active-class="active-menu-item"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="credit_card" />
          </q-item-section>
          <q-item-section>Cartões de Crédito</q-item-section>
          <q-badge v-if="nearDueCards > 0" color="negative" floating>
            {{ nearDueCards }}
          </q-badge>
        </q-item>

        <!-- Moedas -->
        <q-item
          clickable
          :active="activeRoute === 'Currency'"
          @click="navigateTo('/currency')"
          active-class="active-menu-item"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="currency_exchange" />
          </q-item-section>
          <q-item-section>Gerenciar Moedas</q-item-section>
        </q-item>

        <!-- Gráficos -->
        <q-item
          clickable
          :active="activeRoute === 'FinancialCharts'"
          @click="navigateTo('/charts')"
          active-class="active-menu-item"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="insights" />
          </q-item-section>
          <q-item-section>Gráficos</q-item-section>
        </q-item>

        <!-- Relatórios -->
        <q-item
          clickable
          :active="activeRoute === 'Reports'"
          @click="navigateTo('/reports')"
          active-class="active-menu-item"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>Relatórios</q-item-section>
        </q-item>

        <!-- Divider -->
        <q-separator class="q-my-md" />

        <!-- Ferramentas -->
        <q-expansion-item
          icon="build"
          label="Ferramentas"
          expand-icon-class="expansion-icon"
        >
          <q-list dense>
            <q-item clickable @click="openBudgetPlanner">
              <q-item-section avatar>
                <q-icon name="calculate" size="18px" />
              </q-item-section>
              <q-item-section>Planejador de Orçamento</q-item-section>
            </q-item>
            <q-item clickable @click="openDebtCalculator">
              <q-item-section avatar>
                <q-icon name="calculate" size="18px" color="negative" />
              </q-item-section>
              <q-item-section>Calculadora de Dívidas</q-item-section>
            </q-item>
            <q-item clickable @click="openInvestmentCalculator">
              <q-item-section avatar>
                <q-icon name="trending_up" size="18px" color="positive" />
              </q-item-section>
              <q-item-section>Simulador de Investimentos</q-item-section>
            </q-item>
            <q-item clickable @click="openTaxCalculator">
              <q-item-section avatar>
                <q-icon name="receipt" size="18px" />
              </q-item-section>
              <q-item-section>Calculadora de Impostos</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Ajuda -->
        <q-expansion-item
          icon="help"
          label="Ajuda & Suporte"
          expand-icon-class="expansion-icon"
        >
          <q-list dense>
            <q-item clickable @click="openDocumentation">
              <q-item-section avatar>
                <q-icon name="menu_book" size="18px" />
              </q-item-section>
              <q-item-section>Documentação</q-item-section>
            </q-item>
            <q-item clickable @click="openTutorial">
              <q-item-section avatar>
                <q-icon name="school" size="18px" />
              </q-item-section>
              <q-item-section>Tutoriais</q-item-section>
            </q-item>
            <q-item clickable @click="openFAQ">
              <q-item-section avatar>
                <q-icon name="help_outline" size="18px" />
              </q-item-section>
              <q-item-section>FAQ</q-item-section>
            </q-item>
            <q-item clickable @click="contactSupport">
              <q-item-section avatar>
                <q-icon name="support_agent" size="18px" />
              </q-item-section>
              <q-item-section>Suporte</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </q-scroll-area>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="quick-stats">
        <div class="stat-item">
          <div class="stat-label">Saldo</div>
          <div class="stat-value" :class="balanceClass">
            R$ {{ formatCurrency(balance) }}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Meta do Mês</div>
          <div class="stat-value">{{ monthlyGoalProgress }}%</div>
        </div>
      </div>
      
      <div class="footer-actions">
        <q-btn
          icon="add"
          color="primary"
          round
          dense
          @click="quickAddTransaction"
          class="quick-action-btn"
        >
          <q-tooltip>Nova transação rápida</q-tooltip>
        </q-btn>
        <q-btn
          icon="notifications"
          :color="unreadNotifications > 0 ? 'warning' : 'grey'"
          round
          dense
          @click="openNotifications"
          class="quick-action-btn"
        >
          <q-badge v-if="unreadNotifications > 0" color="red" floating />
          <q-tooltip>Notificações</q-tooltip>
        </q-btn>
        <q-btn
          icon="dark_mode"
          round
          dense
          @click="toggleTheme"
          class="quick-action-btn"
        >
          <q-tooltip>Alternar tema</q-tooltip>
        </q-btn>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useTransactionStore } from '@/stores/transaction'
import { useGoalStore } from '@/stores/goal'
import { useCardStore } from '@/stores/card'
import { useNotificationStore } from '@/stores/notification'
import { formatCurrency } from '@/utils/formatters'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const userStore = useUserStore()
const transactionStore = useTransactionStore()
const goalStore = useGoalStore()
const cardStore = useCardStore()
const notificationStore = useNotificationStore()

const leftDrawerOpen = ref(true)
const showUserMenu = ref(false)

// Computed Properties
const activeRoute = computed(() => {
  const nameMap = {
    'Dashboard': 'Dashboard',
    'Transactions': 'Transactions',
    'Categories': 'Categories',
    'Goals': 'Goals',
    'CreditCards': 'CreditCards',
    'Currency': 'Currency',
    'FinancialCharts': 'FinancialCharts',
    'Reports': 'Reports'
  }
  return nameMap[route.name] || ''
})

const balance = computed(() => transactionStore.balance)
const balanceClass = computed(() => balance.value >= 0 ? 'positive' : 'negative')

const activeGoalsCount = computed(() => goalStore.activeGoals.length)

const nearDueCards = computed(() => {
  const today = new Date()
  return cardStore.cards.filter(card => {
    if (!card.dueDate) return false
    const dueDate = new Date(card.dueDate)
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
    return daysUntilDue <= 7 && daysUntilDue > 0
  }).length
})

const unreadNotifications = computed(() => notificationStore.unreadCount)

const monthlyGoalProgress = computed(() => {
  const monthlyGoals = goalStore.goals.filter(goal => {
    if (goal.timeframe !== 'short') return false
    const deadline = new Date(goal.deadline)
    const today = new Date()
    const sameMonth = deadline.getMonth() === today.getMonth() && 
                     deadline.getFullYear() === today.getFullYear()
    return sameMonth
  })
  
  if (monthlyGoals.length === 0) return 0
  
  const totalProgress = monthlyGoals.reduce((sum, goal) => {
    return sum + (goal.current / goal.target) * 100
  }, 0)
  
  return Math.round(totalProgress / monthlyGoals.length)
})

// Watch for route changes on mobile
watch(() => route.path, () => {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
})

// Methods
function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function navigateTo(path) {
  router.push(path)
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
}

async function logout() {
  try {
    await userStore.logout()
    router.push('/login')
    $q.notify({
      type: 'positive',
      message: 'Logout realizado com sucesso'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao fazer logout'
    })
  }
}

function quickAddTransaction() {
  // Abrir modal rápido de transação
  // emit('quick-add-transaction')
  $q.notify({
    type: 'info',
    message: 'Modal de transação rápida'
  })
}

function openNotifications() {
  // Abrir painel de notificações
  // emit('open-notifications')
  $q.notify({
    type: 'info',
    message: 'Painel de notificações'
  })
}

function toggleTheme() {
  $q.dark.toggle()
  $q.notify({
    message: `Tema ${$q.dark.isActive ? 'escuro' : 'claro'} ativado`,
    color: $q.dark.isActive ? 'dark' : 'white',
    textColor: $q.dark.isActive ? 'white' : 'dark'
  })
}

// Ferramentas
function openBudgetPlanner() {
  $q.notify({
    type: 'info',
    message: 'Planejador de orçamento em desenvolvimento'
  })
}

function openDebtCalculator() {
  $q.notify({
    type: 'info',
    message: 'Calculadora de dívidas em desenvolvimento'
  })
}

function openInvestmentCalculator() {
  $q.notify({
    type: 'info',
    message: 'Simulador de investimentos em desenvolvimento'
  })
}

function openTaxCalculator() {
  $q.notify({
    type: 'info',
    message: 'Calculadora de impostos em desenvolvimento'
  })
}

// Ajuda
function openDocumentation() {
  window.open('https://docs.financeflow.com', '_blank')
}

function openTutorial() {
  $q.notify({
    type: 'info',
    message: 'Abrindo tutoriais...'
  })
}

function openFAQ() {
  window.open('https://financeflow.com/faq', '_blank')
}

function contactSupport() {
  window.location.href = 'mailto:support@financeflow.com'
}
</script>

<style scoped>
.sidebar {
  background: white;
  color: #2c3e50;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  border-bottom: 1px solid #eee;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.9;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
}

.logo-subtitle {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 2px;
}

.close-btn {
  color: #555;
}

.user-section {
  padding: 20px 16px;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 2px;
}

.user-email {
  font-size: 0.75rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.sidebar-scroll {
  height: calc(100vh - 280px);
}

.menu-list {
  padding: 8px 0;
}

.menu-item,
:deep(.q-expansion-item__content) .q-item {
  color: #2c3e50;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.menu-item:hover,
:deep(.q-expansion-item__content) .q-item:hover {
  background: #f5f5f5;
  border-left-color: #1976d2;
}

.active-menu-item {
  background: #e3f2fd !important;
  border-left-color: #1976d2 !important;
  color: #1976d2 !important;
}

.active-submenu-item {
  background: #e3f2fd !important;
  color: #1976d2 !important;
}

:deep(.q-expansion-item__container) .q-item {
  color: #2c3e50 !important;
}

:deep(.q-expansion-item__container) .q-item__section--avatar .q-icon {
  color: #555 !important;
}

:deep(.q-expansion-item__content) {
  background: #fafafa;
}

:deep(.expansion-icon) {
  color: #555 !important;
}

:deep(.q-focus-helper) {
  background: rgba(0, 0, 0, 0.05) !important;
}

:deep(.q-separator) {
  background: #eee;
}

.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.quick-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.7rem;
  opacity: 0.8;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.stat-value.positive {
  color: #4CAF50;
}

.stat-value.negative {
  color: #F44336;
}

.footer-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.quick-action-btn {
  background: #e0e0e0 !important;
  color: #333 !important;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background: #d5d5d5 !important;
  transform: translateY(-2px);
}

/* Responsividade */
@media (max-width: 768px) {
  .sidebar {
    background: white;
    color: #2c3e50;
  }
  
  .sidebar-header {
    border-bottom: 1px solid #eee;
  }
  
  .user-section {
    border-bottom: 1px solid #eee;
  }
  
  .menu-item,
  :deep(.q-expansion-item__content) .q-item {
    color: #2c3e50;
  }
  
  .menu-item:hover,
  :deep(.q-expansion-item__content) .q-item:hover {
    background: #f8f9fa;
  }
  
  .active-menu-item {
    background: #e3f2fd !important;
    color: #1976d2 !important;
  }
  
  :deep(.q-expansion-item__content) {
    background: #f8f9fa;
  }
  
  .sidebar-footer {
    background: #f8f9fa;
    border-top: 1px solid #eee;
  }
  
  .quick-action-btn {
    background: #e0e0e0 !important;
    color: #2c3e50 !important;
  }
}
</style>