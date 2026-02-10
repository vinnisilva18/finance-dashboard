<template>
  <div class="financial-goals">
    <q-card class="main-card">
      <q-card-section>
        <div class="header">
          <h2>Metas Financeiras</h2>
          <div class="header-actions">
            <q-btn 
              color="primary" 
              icon="add" 
              label="Nova Meta" 
              @click="showAddModal = true"
            />
            <q-btn 
              icon="filter_list" 
              flat 
              @click="showFilters = !showFilters"
            >
              <q-badge v-if="activeFilterCount > 0" color="primary" floating>
                {{ activeFilterCount }}
              </q-badge>
            </q-btn>
          </div>
        </div>

        <!-- Filtros -->
        <div v-if="showFilters" class="filters-section">
          <q-card class="filters-card">
            <q-card-section>
              <div class="filters-grid">
                <div class="filter-group">
                  <label>Status</label>
                  <q-select
                    v-model="filters.status"
                    :options="statusOptions"
                    multiple
                    dense
                    outlined
                    use-chips
                  />
                </div>
                <div class="filter-group">
                  <label>Prazo</label>
                  <q-select
                    v-model="filters.timeframe"
                    :options="timeframeOptions"
                    multiple
                    dense
                    outlined
                    use-chips
                  />
                </div>
                <div class="filter-group">
                  <label>Prioridade</label>
                  <q-select
                    v-model="filters.priority"
                    :options="priorityOptions"
                    multiple
                    dense
                    outlined
                    use-chips
                  />
                </div>
                <div class="filter-group">
                  <label>Valor</label>
                  <div class="value-range">
                    <q-input
                      v-model="filters.minAmount"
                      type="number"
                      dense
                      outlined
                      placeholder="Mín"
                      prefix="R$"
                    />
                    <span>até</span>
                    <q-input
                      v-model="filters.maxAmount"
                      type="number"
                      dense
                      outlined
                      placeholder="Máx"
                      prefix="R$"
                    />
                  </div>
                </div>
                <div class="filter-actions">
                  <q-btn 
                    label="Aplicar" 
                    color="primary" 
                    @click="applyFilters"
                  />
                  <q-btn 
                    label="Limpar" 
                    flat 
                    @click="clearFilters"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Resumo das Metas -->
        <div class="goals-summary">
          <q-card class="summary-card">
            <q-card-section>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-icon">
                    <q-icon name="flag" size="24px" color="primary" />
                  </div>
                  <div class="summary-content">
                    <div class="summary-label">Metas Ativas</div>
                    <div class="summary-value">{{ activeGoalsCount }}</div>
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-icon">
                    <q-icon name="check_circle" size="24px" color="positive" />
                  </div>
                  <div class="summary-content">
                    <div class="summary-label">Concluídas</div>
                    <div class="summary-value">{{ completedGoalsCount }}</div>
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-icon">
                    <q-icon name="trending_up" size="24px" color="warning" />
                  </div>
                  <div class="summary-content">
                    <div class="summary-label">Progresso Médio</div>
                    <div class="summary-value">{{ averageProgress }}%</div>
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-icon">
                    <q-icon name="savings" size="24px" color="info" />
                  </div>
                  <div class="summary-content">
                    <div class="summary-label">Valor Total</div>
                    <div class="summary-value">R$ {{ formatCurrency(totalTargetAmount) }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Tabs de Metas -->
        <q-tabs
          v-model="activeTab"
          class="text-primary"
          align="left"
          indicator-color="primary"
        >
          <q-tab name="active" icon="flag" label="Ativas" />
          <q-tab name="completed" icon="check_circle" label="Concluídas" />
          <q-tab name="overdue" icon="warning" label="Atrasadas" />
          <q-tab name="archived" icon="archive" label="Arquivadas" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <!-- Metas Ativas -->
          <q-tab-panel name="active">
            <div class="goals-grid">
              <div 
                v-for="goal in filteredActiveGoals" 
                :key="goal.id"
                class="goal-card"
                :class="{
                  'priority-high': goal.priority === 'high',
                  'priority-medium': goal.priority === 'medium',
                  'priority-low': goal.priority === 'low',
                  'near-deadline': isNearDeadline(goal)
                }"
              >
                <div class="goal-header">
                  <div class="goal-title-section">
                    <h3>{{ goal.title }}</h3>
                    <div class="goal-tags">
                      <q-chip 
                        v-if="goal.priority === 'high'" 
                        size="sm" 
                        color="negative" 
                        text-color="white"
                      >
                        Alta Prioridade
                      </q-chip>
                      <q-chip 
                        v-if="goal.timeframe === 'short'" 
                        size="sm" 
                        color="warning"
                      >
                        Curto Prazo
                      </q-chip>
                      <q-chip 
                        v-if="isNearDeadline(goal)" 
                        size="sm" 
                        color="negative"
                      >
                        Prazo próximo
                      </q-chip>
                    </div>
                  </div>
                  <div class="goal-actions">
                    <q-btn 
                      icon="more_vert" 
                      flat 
                      round
                    >
                      <q-menu>
                        <q-list>
                          <q-item clickable @click="editGoal(goal)">
                            <q-item-section avatar>
                              <q-icon name="edit" />
                            </q-item-section>
                            <q-item-section>Editar</q-item-section>
                          </q-item>
                          <q-item clickable @click="addProgress(goal)">
                            <q-item-section avatar>
                              <q-icon name="add" />
                            </q-item-section>
                            <q-item-section>Adicionar Progresso</q-item-section>
                          </q-item>
                          <q-item clickable @click="archiveGoal(goal.id)">
                            <q-item-section avatar>
                              <q-icon name="archive" />
                            </q-item-section>
                            <q-item-section>Arquivar</q-item-section>
                          </q-item>
                          <q-separator />
                          <q-item clickable @click="deleteGoal(goal.id)" class="text-negative">
                            <q-item-section avatar>
                              <q-icon name="delete" />
                            </q-item-section>
                            <q-item-section>Excluir</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>

                <div class="goal-content">
                  <div class="goal-description">
                    {{ goal.description || 'Sem descrição' }}
                  </div>

                  <div class="goal-progress-section">
                    <div class="progress-info">
                      <div class="progress-header">
                        <span class="progress-label">Progresso</span>
                        <span class="progress-percentage">{{ calculateProgress(goal) }}%</span>
                      </div>
                      <q-linear-progress 
                        :value="goal.current / goal.target" 
                        :color="getProgressColor(goal)"
                        size="12px"
                        rounded
                      />
                      <div class="progress-details">
                        <span>R$ {{ formatCurrency(goal.current) }}</span>
                        <span>R$ {{ formatCurrency(goal.target) }}</span>
                      </div>
                    </div>

                    <div class="goal-stats">
                      <div class="stat">
                        <q-icon name="calendar_today" size="16px" />
                        <div class="stat-content">
                          <div class="stat-label">Prazo</div>
                          <div class="stat-value">{{ formatDate(goal.deadline) }}</div>
                        </div>
                      </div>
                      <div class="stat">
                        <q-icon name="trending_up" size="16px" />
                        <div class="stat-content">
                          <div class="stat-label">Restante</div>
                          <div class="stat-value">R$ {{ formatCurrency(goal.target - goal.current) }}</div>
                        </div>
                      </div>
                      <div class="stat">
                        <q-icon name="speed" size="16px" />
                        <div class="stat-content">
                          <div class="stat-label">Diário Necessário</div>
                          <div class="stat-value">R$ {{ formatCurrency(dailyNeeded(goal)) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="goal.milestones && goal.milestones.length > 0" class="milestones-section">
                    <div class="section-title">
                      <q-icon name="flag" />
                      <span>Marcos</span>
                    </div>
                    <div class="milestones-list">
                      <div 
                        v-for="milestone in goal.milestones" 
                        :key="milestone.id"
                        class="milestone-item"
                        :class="{ 'completed': milestone.completed }"
                      >
                        <div class="milestone-checkbox">
                          <q-checkbox 
                            v-model="milestone.completed"
                            @update:model-value="toggleMilestone(goal.id, milestone.id)"
                          />
                        </div>
                        <div class="milestone-content">
                          <div class="milestone-title">{{ milestone.title }}</div>
                          <div class="milestone-amount">R$ {{ formatCurrency(milestone.amount) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="goal-footer">
                  <div class="footer-actions">
                    <q-btn 
                      icon="add" 
                      color="positive" 
                      label="Adicionar" 
                      size="sm"
                      @click="addProgress(goal)"
                    />
                    <q-btn 
                      icon="share" 
                      color="primary" 
                      label="Compartilhar" 
                      size="sm"
                      flat
                    />
                    <q-btn 
                      icon="notifications" 
                      color="warning" 
                      label="Lembrete" 
                      size="sm"
                      flat
                      @click="setReminder(goal)"
                    />
                  </div>
                </div>
              </div>

              <div v-if="filteredActiveGoals.length === 0" class="empty-state">
                <q-icon name="flag" size="64px" color="grey-5" />
                <p>Nenhuma meta ativa encontrada</p>
                <p class="subtitle">Crie sua primeira meta para começar</p>
                <q-btn 
                  color="primary" 
                  icon="add" 
                  label="Criar Meta" 
                  @click="showAddModal = true"
                />
              </div>
            </div>
          </q-tab-panel>

          <!-- Metas Concluídas -->
          <q-tab-panel name="completed">
            <div class="goals-grid">
              <div 
                v-for="goal in completedGoals" 
                :key="goal.id"
                class="goal-card completed"
              >
                <div class="goal-header">
                  <div class="goal-title-section">
                    <div class="completed-badge">
                      <q-icon name="check_circle" color="positive" />
                      <span>Concluída</span>
                    </div>
                    <h3>{{ goal.title }}</h3>
                  </div>
                  <div class="goal-actions">
                    <q-btn 
                      icon="more_vert" 
                      flat 
                      round
                    >
                      <q-menu>
                        <q-list>
                          <q-item clickable @click="reactivateGoal(goal.id)">
                            <q-item-section avatar>
                              <q-icon name="refresh" />
                            </q-item-section>
                            <q-item-section>Reativar</q-item-section>
                          </q-item>
                          <q-item clickable @click="duplicateGoal(goal)">
                            <q-item-section avatar>
                              <q-icon name="content_copy" />
                            </q-item-section>
                            <q-item-section>Duplicar</q-item-section>
                          </q-item>
                          <q-separator />
                          <q-item clickable @click="deleteGoal(goal.id)" class="text-negative">
                            <q-item-section avatar>
                              <q-icon name="delete" />
                            </q-item-section>
                            <q-item-section>Excluir</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>

                <div class="goal-content">
                  <div class="completion-info">
                    <div class="completion-date">
                      <q-icon name="event" />
                      <span>Concluída em {{ formatDate(goal.completedAt) }}</span>
                    </div>
                    <div class="completion-time">
                      <q-icon name="schedule" />
                      <span>Concluída {{ getCompletionTime(goal) }} antes do prazo</span>
                    </div>
                  </div>

                  <div class="goal-progress-section">
                    <div class="progress-info">
                      <div class="progress-header">
                        <span class="progress-label">Progresso Final</span>
                        <span class="progress-percentage positive">100%</span>
                      </div>
                      <q-linear-progress 
                        value="1"
                        color="positive"
                        size="12px"
                        rounded
                      />
                      <div class="progress-details">
                        <span>R$ {{ formatCurrency(goal.target) }}</span>
                        <span>Meta alcançada!</span>
                      </div>
                    </div>
                  </div>

                  <div class="achievement-stats">
                    <div class="achievement-item">
                      <div class="achievement-label">Tempo Total</div>
                      <div class="achievement-value">{{ getGoalDuration(goal) }}</div>
                    </div>
                    <div class="achievement-item">
                      <div class="achievement-label">Economia Mensal</div>
                      <div class="achievement-value">R$ {{ formatCurrency(goal.monthlySaving) }}</div>
                    </div>
                    <div class="achievement-item">
                      <div class="achievement-label">Celebração</div>
                      <div class="achievement-value">{{ goal.celebration || 'Parabéns!' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- Metas Atrasadas -->
          <q-tab-panel name="overdue">
            <div class="goals-grid">
              <div 
                v-for="goal in overdueGoals" 
                :key="goal.id"
                class="goal-card overdue"
              >
                <div class="goal-header">
                  <div class="goal-title-section">
                    <div class="overdue-badge">
                      <q-icon name="warning" color="negative" />
                      <span>Atrasada</span>
                    </div>
                    <h3>{{ goal.title }}</h3>
                  </div>
                </div>

                <div class="goal-content">
                  <div class="overdue-info">
                    <div class="overdue-date">
                      <q-icon name="event_busy" />
                      <span>Prazo: {{ formatDate(goal.deadline) }}</span>
                    </div>
                    <div class="overdue-days">
                      <q-icon name="schedule" />
                      <span>Atrasada há {{ getDaysOverdue(goal) }} dias</span>
                    </div>
                  </div>

                  <div class="goal-progress-section">
                    <div class="progress-info">
                      <div class="progress-header">
                        <span class="progress-label">Progresso</span>
                        <span class="progress-percentage">{{ calculateProgress(goal) }}%</span>
                      </div>
                      <q-linear-progress 
                        :value="goal.current / goal.target" 
                        color="negative"
                        size="12px"
                        rounded
                      />
                      <div class="progress-details">
                        <span>R$ {{ formatCurrency(goal.current) }}</span>
                        <span>Faltam: R$ {{ formatCurrency(goal.target - goal.current) }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="recovery-plan">
                    <div class="plan-title">
                      <q-icon name="lightbulb" />
                      <span>Plano de Recuperação</span>
                    </div>
                    <div class="plan-suggestions">
                      <p>Aumente sua economia mensal em {{ getRecoveryPercentage(goal) }}%</p>
                      <p>Adicione R$ {{ formatCurrency(getExtraMonthly(goal)) }} por mês</p>
                    </div>
                  </div>
                </div>

                <div class="goal-footer">
                  <div class="footer-actions">
                    <q-btn 
                      icon="update" 
                      color="warning" 
                      label="Reajustar Prazo" 
                      size="sm"
                      @click="adjustDeadline(goal)"
                    />
                    <q-btn 
                      icon="trending_up" 
                      color="positive" 
                      label="Aumentar Progresso" 
                      size="sm"
                      @click="addProgress(goal)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- Metas Arquivadas -->
          <q-tab-panel name="archived">
            <div class="goals-grid">
              <div 
                v-for="goal in archivedGoals" 
                :key="goal.id"
                class="goal-card archived"
              >
                <div class="goal-header">
                  <div class="goal-title-section">
                    <div class="archived-badge">
                      <q-icon name="archive" />
                      <span>Arquivada</span>
                    </div>
                    <h3>{{ goal.title }}</h3>
                  </div>
                  <div class="goal-actions">
                    <q-btn 
                      icon="more_vert" 
                      flat 
                      round
                    >
                      <q-menu>
                        <q-list>
                          <q-item clickable @click="reactivateGoal(goal.id)">
                            <q-item-section avatar>
                              <q-icon name="refresh" />
                            </q-item-section>
                            <q-item-section>Restaurar</q-item-section>
                          </q-item>
                          <q-item clickable @click="deleteGoal(goal.id)" class="text-negative">
                            <q-item-section avatar>
                              <q-icon name="delete" />
                            </q-item-section>
                            <q-item-section>Excluir Permanentemente</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>

                <div class="goal-content">
                  <div class="archive-info">
                    <div class="archive-date">
                      <q-icon name="event" />
                      <span>Arquivada em {{ formatDate(goal.archivedAt) }}</span>
                    </div>
                    <div class="archive-reason">
                      <q-icon name="info" />
                      <span>Motivo: {{ goal.archiveReason || 'Não especificado' }}</span>
                    </div>
                  </div>

                  <div class="goal-progress-section">
                    <div class="progress-info">
                      <div class="progress-header">
                        <span class="progress-label">Progresso no Arquivamento</span>
                        <span class="progress-percentage">{{ calculateProgress(goal) }}%</span>
                      </div>
                      <q-linear-progress 
                        :value="goal.current / goal.target" 
                        color="grey"
                        size="12px"
                        rounded
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <!-- Modal Adicionar/Editar Meta -->
    <GoalModal 
      v-model="showAddModal"
      :editingGoal="editingGoal"
      @submit="handleGoalSubmit"
      @close="resetModal"
    />

    <!-- Modal Adicionar Progresso -->
    <ProgressModal 
      v-model="showProgressModal"
      :goal="selectedGoal"
      @submit="handleProgressSubmit"
    />

    <!-- Modal Ajustar Prazo -->
    <DeadlineModal 
      v-model="showDeadlineModal"
      :goal="selectedGoal"
      @submit="handleDeadlineSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGoalStore } from '@/stores/goal'
import { useQuasar } from 'quasar'
import GoalModal from '@/components/modals/GoalModal.vue'
import ProgressModal from '@/components/modals/ProgressModal.vue'
import DeadlineModal from '@/components/modals/DeadlineModal.vue'
import { formatCurrency, formatDate, getDaysBetween } from '@/utils/formatters'
import { useCurrencies } from '@/composables/useCurrencies'

const $q = useQuasar()
const goalStore = useGoalStore()
const { currencies } = useCurrencies()

const activeTab = ref('active')
const showFilters = ref(false)
const showAddModal = ref(false)
const showProgressModal = ref(false)
const showDeadlineModal = ref(false)
const editingGoal = ref(null)
const selectedGoal = ref(null)

const filters = ref({
  status: [],
  timeframe: [],
  priority: [],
  minAmount: null,
  maxAmount: null
})

const statusOptions = [
  { label: 'Ativa', value: 'active' },
  { label: 'Concluída', value: 'completed' },
  { label: 'Atrasada', value: 'overdue' }
]

const timeframeOptions = [
  { label: 'Curto Prazo', value: 'short' },
  { label: 'Médio Prazo', value: 'medium' },
  { label: 'Longo Prazo', value: 'long' }
]

const priorityOptions = [
  { label: 'Alta', value: 'high' },
  { label: 'Média', value: 'medium' },
  { label: 'Baixa', value: 'low' }
]

onMounted(async () => {
  await goalStore.fetchGoals()
})

const activeFilterCount = computed(() => {
  return Object.values(filters.value).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length
    if (filter !== null && filter !== '') return count + 1
    return count
  }, 0)
})

const activeGoals = computed(() => goalStore.activeGoals)
const completedGoals = computed(() => goalStore.completedGoals)
const overdueGoals = computed(() => goalStore.overdueGoals)
const archivedGoals = computed(() => goalStore.archivedGoals)

const activeGoalsCount = computed(() => activeGoals.value.length)
const completedGoalsCount = computed(() => completedGoals.value.length)
const averageProgress = computed(() => {
  if (activeGoals.value.length === 0) return 0
  const total = activeGoals.value.reduce((sum, goal) => sum + calculateProgress(goal), 0)
  return Math.round(total / activeGoals.value.length)
})
const totalTargetAmount = computed(() => {
  return activeGoals.value.reduce((sum, goal) => sum + goal.target, 0)
})

const filteredActiveGoals = computed(() => {
  let goals = [...activeGoals.value]
  
  // Aplicar filtros
  if (filters.value.status.length > 0) {
    // Implementar filtro por status se necessário
  }
  
  if (filters.value.timeframe.length > 0) {
    goals = goals.filter(g => filters.value.timeframe.includes(g.timeframe))
  }
  
  if (filters.value.priority.length > 0) {
    goals = goals.filter(g => filters.value.priority.includes(g.priority))
  }
  
  if (filters.value.minAmount !== null) {
    goals = goals.filter(g => g.target >= filters.value.minAmount)
  }
  
  if (filters.value.maxAmount !== null) {
    goals = goals.filter(g => g.target <= filters.value.maxAmount)
  }
  
  return goals
})

function calculateProgress(goal) {
  return Math.round((goal.current / goal.target) * 100)
}

function getProgressColor(goal) {
  const progress = calculateProgress(goal)
  if (progress >= 80) return 'positive'
  if (progress >= 50) return 'warning'
  return 'negative'
}

function isNearDeadline(goal) {
  const deadline = new Date(goal.deadline)
  const today = new Date()
  const daysUntilDeadline = getDaysBetween(today, deadline)
  return daysUntilDeadline <= 7 && daysUntilDeadline > 0
}

function dailyNeeded(goal) {
  const remaining = goal.target - goal.current
  const deadline = new Date(goal.deadline)
  const today = new Date()
  const daysRemaining = Math.max(1, getDaysBetween(today, deadline))
  return remaining / daysRemaining
}

function getDaysOverdue(goal) {
  const deadline = new Date(goal.deadline)
  const today = new Date()
  return Math.max(0, getDaysBetween(deadline, today))
}

function getRecoveryPercentage(goal) {
  const progress = calculateProgress(goal)
  const daysOverdue = getDaysOverdue(goal)
  const originalDeadline = new Date(goal.deadline)
  const extendedDeadline = new Date(originalDeadline)
  extendedDeadline.setDate(extendedDeadline.getDate() + daysOverdue * 2)
  
  const daysRemaining = getDaysBetween(new Date(), extendedDeadline)
  const remainingAmount = goal.target - goal.current
  
  if (daysRemaining <= 0) return 100
  const monthlyNeeded = (remainingAmount / daysRemaining) * 30
  const currentMonthly = goal.monthlyTarget || (goal.target / 12)
  
  return Math.round(((monthlyNeeded - currentMonthly) / currentMonthly) * 100)
}

function getExtraMonthly(goal) {
  const remaining = goal.target - goal.current
  const daysOverdue = getDaysOverdue(goal)
  const extendedDeadline = new Date(goal.deadline)
  extendedDeadline.setDate(extendedDeadline.getDate() + daysOverdue * 2)
  
  const daysRemaining = getDaysBetween(new Date(), extendedDeadline)
  const monthsRemaining = daysRemaining / 30
  
  return remaining / monthsRemaining
}

function getGoalDuration(goal) {
  const start = new Date(goal.createdAt)
  const end = new Date(goal.completedAt || new Date())
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  return `${months} meses`
}

function getCompletionTime(goal) {
  const deadline = new Date(goal.deadline)
  const completedAt = new Date(goal.completedAt)
  const daysEarly = getDaysBetween(completedAt, deadline)
  
  if (daysEarly >= 30) return `${Math.floor(daysEarly / 30)} meses`
  if (daysEarly >= 7) return `${Math.floor(daysEarly / 7)} semanas`
  return `${daysEarly} dias`
}

function applyFilters() {
  showFilters.value = false
  $q.notify({
    type: 'positive',
    message: 'Filtros aplicados'
  })
}

function clearFilters() {
  filters.value = {
    status: [],
    timeframe: [],
    priority: [],
    minAmount: null,
    maxAmount: null
  }
  $q.notify({
    type: 'info',
    message: 'Filtros limpos'
  })
}

function editGoal(goal) {
  editingGoal.value = goal
  showAddModal.value = true
}

function addProgress(goal) {
  selectedGoal.value = goal
  showProgressModal.value = true
}

function archiveGoal(goalId) {
  $q.dialog({
    title: 'Arquivar Meta',
    message: 'Tem certeza que deseja arquivar esta meta?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await goalStore.archiveGoal(goalId)
      $q.notify({
        type: 'positive',
        message: 'Meta arquivada com sucesso'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.message || 'Erro ao arquivar meta'
      })
    }
  })
}

async function deleteGoal(goalId) {
  $q.dialog({
    title: 'Excluir Meta',
    message: 'Tem certeza que deseja excluir esta meta permanentemente?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await goalStore.deleteGoal(goalId)
      $q.notify({
        type: 'positive',
        message: 'Meta excluída com sucesso'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.message || 'Erro ao excluir meta'
      })
    }
  })
}

function reactivateGoal(goalId) {
  $q.dialog({
    title: 'Reativar Meta',
    message: 'Deseja reativar esta meta?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await goalStore.reactivateGoal(goalId)
      $q.notify({
        type: 'positive',
        message: 'Meta reativada com sucesso'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.message || 'Erro ao reativar meta'
      })
    }
  })
}

function duplicateGoal(goal) {
  editingGoal.value = { ...goal, id: null, title: `${goal.title} (Cópia)` }
  showAddModal.value = true
}

function setReminder(goal) {
  $q.dialog({
    title: 'Configurar Lembrete',
    message: `Deseja configurar um lembrete para a meta "${goal.title}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Implementar configuração de lembrete
    $q.notify({
      type: 'info',
      message: 'Funcionalidade de lembrete em desenvolvimento'
    })
  })
}

function adjustDeadline(goal) {
  selectedGoal.value = goal
  showDeadlineModal.value = true
}

function toggleMilestone(goalId, milestoneId) {
  goalStore.toggleMilestone(goalId, milestoneId)
}

async function handleGoalSubmit(goalData) {
  try {
    if (editingGoal.value) {
      await goalStore.updateGoal({ id: editingGoal.value.id, ...goalData })
      $q.notify({
        type: 'positive',
        message: 'Meta atualizada com sucesso'
      })
    } else {
      await goalStore.createGoal(goalData)
      $q.notify({
        type: 'positive',
        message: 'Meta criada com sucesso'
      })
    }
    
    showAddModal.value = false
    resetModal()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar meta'
    })
  }
}

async function handleProgressSubmit(progressData) {
  try {
    await goalStore.addProgress(selectedGoal.value.id, progressData.amount)
    $q.notify({
      type: 'positive',
      message: 'Progresso adicionado com sucesso'
    })
    showProgressModal.value = false
    selectedGoal.value = null
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao adicionar progresso'
    })
  }
}

async function handleDeadlineSubmit(newDeadline) {
  try {
    await goalStore.updateGoal({
      id: selectedGoal.value.id,
      deadline: newDeadline
    })
    $q.notify({
      type: 'positive',
      message: 'Prazo ajustado com sucesso'
    })
    showDeadlineModal.value = false
    selectedGoal.value = null
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao ajustar prazo'
    })
  }
}

function resetModal() {
  editingGoal.value = null
}
</script>

<style scoped>
.financial-goals {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filters-section {
  margin-bottom: 30px;
}

.filters-card {
  background: #f8f9fa;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #2c3e50;
}

.value-range {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
}

.value-range span {
  text-align: center;
  color: #666;
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}

.goals-summary {
  margin-bottom: 30px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-content {
  flex: 1;
}

.summary-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .goals-grid {
    grid-template-columns: 1fr;
  }
}

.goal-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.goal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.goal-card.priority-high {
  border-left: 4px solid #F44336;
}

.goal-card.priority-medium {
  border-left: 4px solid #FF9800;
}

.goal-card.priority-low {
  border-left: 4px solid #4CAF50;
}

.goal-card.near-deadline {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2); }
  50% { box-shadow: 0 4px 20px rgba(244, 67, 54, 0.4); }
  100% { box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2); }
}

.goal-card.completed {
  border-left: 4px solid #4CAF50;
  opacity: 0.9;
}

.goal-card.overdue {
  border-left: 4px solid #F44336;
}

.goal-card.archived {
  border-left: 4px solid #9E9E9E;
  opacity: 0.7;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 0;
}

.goal-title-section {
  flex: 1;
}

.goal-title-section h3 {
  margin: 10px 0 5px;
  color: #2c3e50;
}

.goal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.goal-actions {
  display: flex;
  gap: 5px;
}

.goal-content {
  padding: 20px;
}

.goal-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.goal-progress-section {
  margin-bottom: 20px;
}

.progress-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-label {
  font-weight: 500;
  color: #2c3e50;
}

.progress-percentage {
  font-weight: 700;
  font-size: 1.1rem;
}

.progress-percentage.positive {
  color: #4CAF50;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
}

.goal-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #eee;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
}

.milestones-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-weight: 500;
  color: #2c3e50;
}

.milestones-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.milestone-item:hover {
  background: #e9ecef;
}

.milestone-item.completed {
  opacity: 0.7;
}

.milestone-checkbox {
  flex-shrink: 0;
}

.milestone-content {
  flex: 1;
}

.milestone-title {
  font-weight: 500;
  margin-bottom: 3px;
}

.milestone-amount {
  font-size: 0.85rem;
  color: #666;
}

.completion-info, .overdue-info, .archive-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.completion-date, .overdue-date, .archive-date,
.completion-time, .overdue-days, .archive-reason {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
}

.completed-badge, .overdue-badge, .archived-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.completed-badge {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.overdue-badge {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.archived-badge {
  background: rgba(158, 158, 158, 0.1);
  color: #9E9E9E;
}

.achievement-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.achievement-item {
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
}

.achievement-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.achievement-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.recovery-plan {
  background: #fff8e1;
  border-left: 4px solid #FF9800;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.plan-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #FF9800;
}

.plan-suggestions {
  color: #666;
  line-height: 1.6;
}

.plan-suggestions p {
  margin-bottom: 5px;
}

.plan-suggestions p:last-child {
  margin-bottom: 0;
}

.goal-footer {
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.footer-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin-top: 10px;
  font-size: 1.1rem;
}

.empty-state .subtitle {
  font-size: 0.9rem;
  margin-bottom: 20px;
  color: #777;
}
</style>