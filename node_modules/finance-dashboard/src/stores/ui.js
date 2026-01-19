import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isSidebarCollapsed = ref(false)
  const showMobileSidebar = ref(false)
  
  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
    // Salvar preferência apenas se o usuário estiver autenticado
    if (isSidebarCollapsed.value) {
      localStorage.setItem('sidebarCollapsed', 'true')
    } else {
      localStorage.removeItem('sidebarCollapsed')
    }
  }
  
  const toggleSidebarMobile = () => {
    showMobileSidebar.value = !showMobileSidebar.value
  }
  
  const closeMobileSidebar = () => {
    showMobileSidebar.value = false
  }
  
  const resetSidebar = () => {
    isSidebarCollapsed.value = false
    showMobileSidebar.value = false
    localStorage.removeItem('sidebarCollapsed')
  }
  
  return {
    isSidebarCollapsed,
    showMobileSidebar,
    toggleSidebar,
    toggleSidebarMobile,
    closeMobileSidebar,
    resetSidebar
  }
})