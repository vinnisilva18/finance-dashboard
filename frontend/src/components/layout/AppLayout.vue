AppLayout.vue
<template>
  <div class="app-layout">
    <!-- Sidebar para Desktop -->
    <AppSidebar v-if="isAuthenticated && !isMobile" class="desktop-sidebar" />
    
    <!-- Overlay Mobile -->
    <div v-if="isAuthenticated && isMobileSidebarOpen" 
         class="mobile-overlay" 
         @click="toggleMobileSidebar" />
    
    <!-- Sidebar Mobile -->
    <AppSidebar v-if="isAuthenticated && isMobileSidebarOpen" 
                class="mobile-sidebar" 
                @close="toggleMobileSidebar" />
    
    <!-- Main Content -->
    <main class="main-content" :class="{ 'sidebar-collapsed': !isAuthenticated }">
      <!-- Header -->
      <AppHeader v-if="isAuthenticated" @toggle-sidebar="toggleMobileSidebar" />
      
      <!-- Page Content -->
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    
    <!-- Toast Notifications -->
    <div class="toast-container">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id" 
             class="toast" :class="toast.type">
          <div class="toast-icon">
            {{ toastIcons[toast.type] }}
          </div>
          <div class="toast-content">
            <p class="toast-title">{{ toast.title }}</p>
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button @click="removeToast(toast.id)" class="toast-close">
            <span>×</span>
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const authStore = useAuthStore()
const isMobileSidebarOpen = ref(false)
const toasts = ref([])
const isMobile = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const toastIcons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
}

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const showToast = (title, message, type = 'info', duration = 5000) => {
  const id = Date.now()
  toasts.value.push({ id, title, message, type })
  
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Expor métodos para componentes filhos
defineExpose({ showToast })
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.desktop-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 40;
  animation: fadeIn 0.3s ease;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  z-index: 50;
  transform: translateX(0);
  animation: slideIn 0.3s ease;
}

.main-content {
  flex: 1;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: var(--transition-base);
}

.main-content.sidebar-collapsed {
  margin-left: 0;
}

.page-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.toast {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: var(--shadow-2xl);
  border-left: 4px solid;
  animation: slideInRight 0.3s ease;
  max-width: 400px;
}

.toast.success {
  border-left-color: var(--success-500);
}

.toast.error {
  border-left-color: var(--danger-500);
}

.toast.warning {
  border-left-color: var(--warning-500);
}

.toast.info {
  border-left-color: var(--primary-500);
}

.toast-icon {
  font-size: 1.25rem;
  margin-top: 0.125rem;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: var(--gray-50);
  margin-bottom: 0.25rem;
}

.toast-message {
  font-size: 0.875rem;
  color: var(--gray-300);
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--gray-400);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--gray-200);
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>