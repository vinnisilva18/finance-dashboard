<template>
  <div class="profile">
    <h1>Configurações de Perfil</h1>
    
    <div class="profile-grid">
      <div class="profile-card card">
        <div class="profile-header">
          <div class="avatar" :style="{ backgroundColor: userColor }">
            {{ userInitials }}
          </div>
          <div class="profile-info">
            <h2>{{ user?.name || 'Nome do Usuário' }}</h2>
            <p>{{ user?.email || 'user@example.com' }}</p>
            <span class="member-since">Membro desde {{ memberSince }}</span>
          </div>
        </div>
        
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-label">Total de Transações</span>
            <span class="stat-value">{{ stats.transactions }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Categorias</span>
            <span class="stat-value">{{ stats.categories }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Metas Ativas</span>
            <span class="stat-value">{{ stats.activeGoals }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Cartões de Crédito</span>
            <span class="stat-value">{{ stats.creditCards }}</span>
          </div>
        </div>
      </div>

      <div class="settings-card card">
        <h3>Configurações da Conta</h3>
        <form @submit.prevent="updateProfile">
          <div class="form-section">
            <h4>Informações Pessoais</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Nome Completo</label>
                <input v-model="profileData.name" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Endereço de Email</label>
                <input v-model="profileData.email" type="email" class="form-control">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>Preferências</h4>
            <div class="preferences-grid">
              <div class="preference-item">
                <label class="checkbox-label">
                  <input v-model="preferences.notifications" type="checkbox">
                  <span>Notificações por Email</span>
                </label>
              </div>
              <div class="preference-item">
                <label class="checkbox-label">
                  <input v-model="preferences.weeklyReports" type="checkbox">
                  <span>Relatórios Semanais</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="saving" class="btn btn-primary">
              {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>

      <div class="data-management-card card">
        <h3>Gerenciamento de Dados</h3>
        <p>Exporte seus dados para um arquivo JSON, importe um arquivo de backup ou restaure o aplicativo para o estado inicial.</p>
        <input type="file" ref="fileInput" @change="onFileSelected" style="display: none" accept="application/json" />
        <div class="data-actions">
          <button @click="handleExport" class="btn btn-secondary">
            📤 Exportar Todos os Dados
          </button>
          <button @click="handleImport" class="btn btn-primary">
            📥 Importar Dados
          </button>
          <button @click="handleReset" class="btn btn-danger">
            🗑️ Restaurar Todos os Dados
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { localStorageService } from '../services/localStorageService'

const authStore = useAuthStore()
const userStore = useUserStore()

const user = computed(() => authStore.user || userStore.user)
const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const memberSince = computed(() => {
  return new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })
})

const userColor = ref('#4CAF50')
const fileInput = ref(null)

const stats = ref({
  transactions: 0,
  categories: 0,
  activeGoals: 0,
  creditCards: 0
})

const profileData = reactive({
  name: '',
  email: ''
})

const initializeProfileData = () => {
  if (user.value) {
    profileData.name = user.value.name || ''
    profileData.email = user.value.email || ''
  }
}

const preferences = reactive({
  notifications: true,
  weeklyReports: true,
})

const saving = ref(false)

onMounted(() => {
  const savedPreferences = localStorage.getItem('userPreferences')
  if (savedPreferences) {
    Object.assign(preferences, JSON.parse(savedPreferences))
  }
  
  const savedColor = localStorage.getItem('userColor')
  if (savedColor) {
    userColor.value = savedColor
  }
  initializeProfileData()

  // Load stats from localStorage
  stats.value.transactions = (localStorageService.getData('transactions') || []).length
  stats.value.categories = (localStorageService.getData('categories') || []).length
  stats.value.activeGoals = (localStorageService.getData('goals') || []).length
  stats.value.creditCards = (localStorageService.getData('cards') || []).length
})

const updateProfile = async () => {
  saving.value = true
  try {
    if (user.value) {
      authStore.updateUser({
        name: profileData.name,
        email: profileData.email
      })
    }
    
    userStore.setPreferences(preferences)
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Perfil atualizado com sucesso!')
  } catch (error) {
    alert('Erro ao atualizar o perfil: ' + error.message)
  } finally {
    saving.value = false
  }
}

const handleExport = () => {
  localStorageService.exportData()
}

const handleImport = () => {
  fileInput.value.click()
}

const onFileSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    await localStorageService.importData(file)
    alert('Dados importados com sucesso! A página será recarregada.')
    window.location.reload()
  } catch (error) {
    alert(`Erro ao importar dados: ${error.message}`)
  } finally {
    // Reset file input
    fileInput.value.value = ''
  }
}

const handleReset = () => {
  if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
    localStorageService.resetData()
    alert('Todos os dados foram apagados. A página será recarregada.')
    window.location.reload()
  }
}
</script>

<style scoped>
.profile {
  padding: 20px;
}

.profile-grid {
  display: grid;
  gap: 30px;
  grid-template-columns: 1fr 2fr 1fr;
}

@media (max-width: 1200px) {
  .profile-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-card {
  padding: 25px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  font-weight: bold;
  color: white;
}

.profile-info h2 {
  margin: 0 0 5px 0;
  color: #333;
}

.profile-info p {
  margin: 0 0 5px 0;
  color: #666;
}

.member-since {
  font-size: 0.9em;
  color: #999;
}

.profile-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.settings-card {
  padding: 25px;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h4 {
  margin: 0 0 20px 0;
  color: #555;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 15px;
}

.preferences-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.data-management-card {
  padding: 25px;
}

.data-management-card h3 {
  margin-top: 0;
}

.data-management-card p {
  color: #666;
  margin-bottom: 20px;
}

.data-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>