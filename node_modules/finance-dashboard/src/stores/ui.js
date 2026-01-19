// stores/ui.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isSidebarCollapsed = ref(false)
  const showMobileSidebar = ref(false)
  
  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
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
