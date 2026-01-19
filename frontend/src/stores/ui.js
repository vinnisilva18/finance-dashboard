import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isSidebarCollapsed = ref(false)
  const showMobileSidebar = ref(false)

  const resetSidebar = () => {
    isSidebarCollapsed.value = false
    showMobileSidebar.value = false
  }

  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
    // Salvar preferência no localStorage
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.value.toString())
  }

  const toggleSidebarMobile = () => {
    showMobileSidebar.value = !showMobileSidebar.value
  }

  const closeMobileSidebar = () => {
    showMobileSidebar.value = false
  }

  return {
    isSidebarCollapsed,
    showMobileSidebar,
    resetSidebar,
    toggleSidebar,
    toggleSidebarMobile,
    closeMobileSidebar
  }
})
