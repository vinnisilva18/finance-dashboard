<template>
  <q-card style="min-width: 400px;">
    <q-card-section>
      <div class="modal-header">
        <h2>{{ editingCategory ? 'Editar Categoria' : 'Nova Categoria' }}</h2>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-form @submit="submitForm" class="q-gutter-md">
        <!-- Nome da Categoria -->
        <q-input
          v-model="categoryForm.name"
          label="Nome da Categoria"
          filled
          :rules="[val => !!val || 'Nome é obrigatório']"
          placeholder="Ex: Alimentação, Transporte, Lazer..."
        />

        <!-- Tipo da Categoria -->
        <div class="form-section">
          <div class="section-title">Tipo</div>
          <div class="type-selector">
            <q-btn-toggle
              v-model="categoryForm.type"
              :options="typeOptions"
              spread
              :color="categoryForm.type === 'income' ? 'positive' : 'negative'"
              class="type-toggle"
            />
          </div>
        </div>

        <!-- Cor da Categoria -->
        <div class="form-section">
          <div class="section-title">Cor</div>
          <div class="color-picker">
            <div class="color-options">
              <div
                v-for="color in colorOptions"
                :key="color"
                class="color-option"
                :style="{ backgroundColor: color }"
                :class="{ selected: categoryForm.color === color }"
                @click="categoryForm.color = color"
              >
                <q-icon v-if="categoryForm.color === color" name="check" color="white" />
              </div>
            </div>
            <div class="color-preview">
              <div
                class="preview-circle"
                :style="{ backgroundColor: categoryForm.color }"
              ></div>
              <div class="preview-info">
                <div class="preview-hex">{{ categoryForm.color }}</div>
                <q-input
                  v-model="categoryForm.color"
                  dense
                  filled
                  placeholder="#000000"
                  style="width: 120px;"
                  @input="validateColor"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Ícone -->
        <div class="form-section">
          <div class="section-title">
            <span>Ícone</span>
            <small class="icon-hint">(Opcional)</small>
          </div>
          <div class="icon-selector">
            <q-select
              v-model="categoryForm.icon"
              :options="iconOptions"
              filled
              use-input
              @filter="filterIcons"
              label="Selecione um ícone"
              clearable
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.value" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div v-if="categoryForm.icon" class="selected-icon">
              <q-icon :name="categoryForm.icon" size="48px" :color="categoryForm.color" />
              <div class="icon-name">{{ getIconName(categoryForm.icon) }}</div>
            </div>
          </div>
        </div>

        <!-- Orçamento (apenas para despesas) -->
        <div v-if="categoryForm.type === 'expense'" class="form-section">
          <div class="section-title">
            <span>Orçamento Mensal</span>
            <small class="budget-hint">(Opcional)</small>
          </div>
          <q-input
            v-model="categoryForm.budget"
            type="number"
            min="0"
            step="0.01"
            filled
            prefix="R$"
            placeholder="0.00"
            hint="Defina um limite mensal para esta categoria"
          />
        </div>

        <!-- Categoria Pai -->
        <div class="form-section">
          <div class="section-title">
            <span>Categoria Pai</span>
            <small class="parent-hint">(Opcional)</small>
          </div>
          <q-select
            v-model="categoryForm.parentId"
            :options="parentCategoryOptions"
            filled
            clearable
            label="Selecione uma categoria pai"
            hint="Organize suas categorias em hierarquias"
          />
        </div>

        <!-- Descrição -->
        <div class="form-section">
          <div class="section-title">
            <span>Descrição</span>
            <small class="description-hint">(Opcional)</small>
          </div>
          <q-input
            v-model="categoryForm.description"
            type="textarea"
            filled
            autogrow
            placeholder="Descreva o propósito desta categoria..."
            rows="3"
          />
        </div>

        <!-- Configurações Avançadas -->
        <q-expansion-item
          label="Configurações Avançadas"
          icon="settings"
          dense
          header-class="advanced-header"
        >
          <div class="advanced-settings">
            <!-- Notificações -->
            <div class="setting-item">
              <q-checkbox
                v-model="categoryForm.notifications.enabled"
                label="Ativar notificações"
              />
              <div v-if="categoryForm.notifications.enabled" class="notification-settings">
                <q-input
                  v-model="categoryForm.notifications.threshold"
                  type="number"
                  min="0"
                  max="100"
                  suffix="%"
                  filled
                  dense
                  label="Limite de notificação"
                  hint="Receba alertas quando atingir este percentual do orçamento"
                />
              </div>
            </div>

            <!-- Categoria Padrão -->
            <div class="setting-item">
              <q-checkbox
                v-model="categoryForm.isDefault"
                label="Categoria padrão"
                hint="Usada automaticamente para novas transações"
              />
            </div>

            <!-- Categoria Ocultada -->
            <div class="setting-item">
              <q-checkbox
                v-model="categoryForm.isHidden"
                label="Ocultar categoria"
                hint="Não mostrar em listas e relatórios"
              />
            </div>

            <!-- Cor da Categoria -->
            <div class="setting-item">
              <q-checkbox
                v-model="categoryForm.useCustomColor"
                label="Usar cor personalizada nos gráficos"
              />
            </div>
          </div>
        </q-expansion-item>

        <!-- Visualização -->
        <div class="preview-section">
          <div class="section-title">Visualização</div>
          <div class="preview-card" :style="{ borderLeft: `4px solid ${categoryForm.color}` }">
            <div class="preview-header">
              <div class="preview-icon" v-if="categoryForm.icon">
                <q-icon :name="categoryForm.icon" :color="categoryForm.color" />
              </div>
              <div class="preview-content">
                <div class="preview-name">{{ categoryForm.name || 'Nome da Categoria' }}</div>
                <div class="preview-type">
                  <q-chip :label="categoryForm.type === 'income' ? 'Receita' : 'Despesa'" size="sm" dense />
                  <span v-if="categoryForm.budget" class="preview-budget">
                    Orçamento: R$ {{ formatCurrency(categoryForm.budget || 0) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ações do Formulário -->
        <div class="form-actions">
          <q-btn label="Cancelar" flat color="negative" @click="cancel" />
          <q-btn
            :label="editingCategory ? 'Atualizar' : 'Criar'"
            type="submit"
            color="primary"
            :loading="submitting"
          />
          <q-btn
            v-if="editingCategory"
            label="Duplicar"
            flat
            color="warning"
            @click="duplicateCategory"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useCategoryStore } from '@/stores/category'
import { formatCurrency } from '@/utils/formatters'

const $q = useQuasar()
const categoryStore = useCategoryStore()

const props = defineProps({
  editingCategory: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const submitting = ref(false)
const allIcons = ref([])
const filteredIcons = ref([])

const categoryForm = ref({
  name: '',
  type: 'expense',
  color: '#2196F3',
  icon: '',
  budget: null,
  parentId: null,
  description: '',
  notifications: {
    enabled: false,
    threshold: 80
  },
  isDefault: false,
  isHidden: false,
  useCustomColor: true
})

// Initialize form if editing
if (props.editingCategory) {
  categoryForm.value = {
    ...props.editingCategory,
    notifications: props.editingCategory.notifications || { enabled: false, threshold: 80 }
  }
}

// Options
const typeOptions = [
  { label: 'Despesa', value: 'expense', icon: 'trending_down' },
  { label: 'Receita', value: 'income', icon: 'trending_up' }
]

const colorOptions = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
  '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
]

const iconOptions = computed(() => {
  return filteredIcons.value.map(icon => ({
    label: getIconName(icon),
    value: icon
  }))
})

const parentCategoryOptions = computed(() => {
  const categories = categoryStore.categories.filter(cat => 
    cat.type === categoryForm.value.type && 
    (!props.editingCategory || cat.id !== props.editingCategory.id)
  )
  
  return categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
})

// Common Material Icons
const commonIcons = [
  'restaurant', 'home', 'directions_car', 'local_hospital',
  'school', 'sports_esports', 'shopping_cart', 'flight',
  'local_gas_station', 'local_cafe', 'movie', 'music_note',
  'sports_soccer', 'fitness_center', 'beach_access', 'spa',
  'work', 'computer', 'phone_iphone', 'wifi',
  'water', 'lightbulb', 'electric_bolt', 'pets',
  'child_care', 'elderly', 'face', 'mood'
]

onMounted(() => {
  allIcons.value = commonIcons
  filteredIcons.value = commonIcons
})

// Methods
function filterIcons(val, update) {
  if (val === '') {
    update(() => {
      filteredIcons.value = allIcons.value
    })
    return
  }
  
  update(() => {
    const search = val.toLowerCase()
    filteredIcons.value = allIcons.value.filter(
      icon => getIconName(icon).toLowerCase().includes(search)
    )
  })
}

function getIconName(icon) {
  // Convert icon name to readable format
  return icon.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function validateColor() {
  // Validate hex color
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!hexRegex.test(categoryForm.value.color)) {
    categoryForm.value.color = '#2196F3'
  }
}

async function submitForm() {
  submitting.value = true
  
  try {
    // Validate required fields
    if (!categoryForm.value.name.trim()) {
      throw new Error('Nome da categoria é obrigatório')
    }
    
    // Prepare data
    const categoryData = {
      name: categoryForm.value.name.trim(),
      type: categoryForm.value.type,
      color: categoryForm.value.color,
      icon: categoryForm.value.icon || null,
      budget: categoryForm.value.budget || null,
      parentId: categoryForm.value.parentId || null,
      description: categoryForm.value.description || null,
      notifications: categoryForm.value.notifications,
      isDefault: categoryForm.value.isDefault,
      isHidden: categoryForm.value.isHidden,
      useCustomColor: categoryForm.value.useCustomColor
    }
    
    if (props.editingCategory) {
      categoryData.id = props.editingCategory.id
    }
    
    emit('submit', categoryData)
    
    $q.notify({
      type: 'positive',
      message: props.editingCategory ? 
        'Categoria atualizada com sucesso' : 
        'Categoria criada com sucesso'
    })
    
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar categoria'
    })
  } finally {
    submitting.value = false
  }
}

function cancel() {
  emit('cancel')
}

function duplicateCategory() {
  const duplicated = {
    ...categoryForm.value,
    id: null,
    name: `${categoryForm.value.name} (Cópia)`
  }
  
  emit('submit', duplicated)
}
</script>

<style scoped>
.modal-header {
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.form-section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title small {
  font-weight: normal;
  color: #666;
}

.type-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.type-toggle :deep(.q-btn) {
  padding: 10px;
  text-transform: none;
}

.color-picker {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.color-options {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

@media (max-width: 768px) {
  .color-options {
    grid-template-columns: repeat(4, 1fr);
  }
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: transform 0.2s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #333;
  transform: scale(1.1);
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #ddd;
}

.preview-info {
  flex: 1;
}

.preview-hex {
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.icon-selector {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.selected-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.icon-name {
  font-size: 0.9rem;
  color: #666;
}

:deep(.advanced-header) {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px 16px;
  margin-bottom: 10px;
}

.advanced-settings {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.notification-settings {
  margin-top: 10px;
  padding-left: 28px;
}

.preview-section {
  margin: 25px 0;
}

.preview-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.preview-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-content {
  flex: 1;
}

.preview-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.preview-type {
  display: flex;
  align-items: center;
  gap: 15px;
}

.preview-budget {
  font-size: 0.9rem;
  color: #666;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f2f5;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .q-btn {
    width: 100%;
  }
}
</style>