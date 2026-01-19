<template>
  <div class="login-page">
    <!-- Background Animation -->
    <div class="background-animation">
    </div>

    <!-- Login Container -->
    <div class="login-container">
      <!-- Left Side - Branding -->
      <div class="login-branding">
        <div class="brand-logo">
          <div class="logo-icon">💰</div>
          <h1>Finan<span class="text-gradient">C</span>ontrol</h1>
        </div>
        <div class="brand-content">
          <h2 class="brand-title">
            Controle suas finanças de forma <span class="text-gradient">inteligente</span>
          </h2>
          <p class="brand-subtitle">
            Dashboard financeiro completo com análises em tempo real, metas personalizadas e controle total dos seus gastos.
          </p>
          <div class="brand-features">
            <div class="feature">
              <span class="feature-icon">📊</span>
              <span>Análises Detalhadas</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🎯</span>
              <span>Metas Personalizadas</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🔒</span>
              <span>Segurança Total</span>
            </div>
          </div>
        </div>
        <div class="brand-footer">
          <p>© 2024 FinanControl. Todos os direitos reservados.</p>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-form-container glass">
        <div class="form-header">
          <h2>Bem-vindo de volta!</h2>
          <p>Entre na sua conta para continuar</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- General Error Message -->
          <div v-if="errors.general" class="general-error-message">
            {{ errors.general }}
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label for="email">E-mail</label>
            <div class="input-with-icon">
              <span class="input-icon">📧</span>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="seu@email.com"
                required
                class="form-input"
                :class="{ 'error': errors.email }"
              />
            </div>
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <div class="password-header">
              <label for="password">Senha</label>
              <a href="#" class="forgot-password">Esqueceu a senha?</a>
            </div>
            <div class="input-with-icon">
              <span class="input-icon">🔒</span>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Sua senha"
                required
                class="form-input"
                :class="{ 'error': errors.password }"
              />
              <button type="button" class="password-toggle" @click="togglePassword">
                <span>{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <!-- Remember Me -->
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.remember" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">Lembrar-me</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else>Entrar na conta</span>
          </button>

          <!-- Divider -->
          <div class="divider">
            <span>ou continue com</span>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <button type="button" class="social-btn google">
              <span class="social-icon">G</span>
              <span>Google</span>
            </button>
            <button type="button" class="social-btn apple">
              <span class="social-icon"></span>
              <span>Apple</span>
            </button>
          </div>

          <!-- Register Link -->
          <div class="register-link">
            <p>Não tem uma conta? <a href="#" @click.prevent="showRegister = true">Cadastre-se agora</a></p>
          </div>
        </form>

        <!-- Demo Credentials -->
        <div class="demo-credentials">
          <p class="demo-title">Credenciais de Demonstração:</p>
          <div class="credentials">
            <div class="credential">
              <span>E-mail:</span>
              <code>demo@financontrol.com</code>
            </div>
            <div class="credential">
              <span>Senha:</span>
              <code>demopass123</code>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <div v-if="showRegister" class="modal-overlay" @click="showRegister = false">
      <div class="modal-content" @click.stop>
        <div class="form-header">
          <h3>Crie sua conta</h3>
          <p>Preencha os dados abaixo para começar</p>
        </div>

        <form @submit.prevent="handleRegister" class="login-form">
          <div class="form-group">
            <label>Nome Completo</label>
            <div class="input-with-icon">
              <span class="input-icon">👤</span>
              <input v-model="registerForm.name" type="text" required class="form-input" placeholder="Seu nome" />
            </div>
          </div>

          <div class="form-group">
            <label>E-mail</label>
            <div class="input-with-icon">
              <span class="input-icon">📧</span>
              <input v-model="registerForm.email" type="email" required class="form-input" placeholder="seu@email.com" />
            </div>
          </div>

          <div class="form-group">
            <label>Senha</label>
            <div class="input-with-icon">
              <span class="input-icon">🔒</span>
              <input v-model="registerForm.password" type="password" required class="form-input" placeholder="Sua senha" />
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else>Cadastrar</span>
          </button>
        </form>
        
        <button @click="showRegister = false" class="modal-close-text">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: 'demo@financontrol.com',
  password: 'demopass123',
  remember: false
})

const registerForm = reactive({
  name: '',
  email: '',
  password: ''
})

const errors = reactive({})
const loading = ref(false)
const showPassword = ref(false)
const showRegister = ref(false)

const particleStyle = (index) => {
  const size = Math.random() * 100 + 50
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 5
  const x = Math.random() * 100
  const y = Math.random() * 100
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    opacity: Math.random() * 0.1 + 0.05
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  
  // Simple validation
  if (!form.email.includes('@')) {
    errors.email = 'Por favor, insira um e-mail válido'
    return
  }
  
  if (form.password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres'
    return
  }
  
  loading.value = true

  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password
    })
    
    if (result.success) {
      // Se o login for bem-sucedido, apenas navega para o dashboard.
      // O estado de 'loading' não precisa ser desativado aqui, pois o componente será destruído.
      router.push('/')
    } else {
      errors.general = result.message || 'Credenciais inválidas'
      loading.value = false
    }
  } catch (error) {
    // Este erro é para falhas de rede ou problemas inesperados,
    // já que o authStore.login trata erros de API.
    errors.general = 'Erro de conexão ao tentar fazer login. Tente novamente.'
    console.error('Login error:', error)
    loading.value = false
  }
}

const handleRegister = async () => {
  errors.general = null
  loading.value = true
  
  try {
    const result = await authStore.register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password
    })

    if (result.success) {
      showRegister.value = false
      router.push('/')
    } else {
      alert(result.message || 'Erro ao criar conta')
      loading.value = false
    }
  } catch (error) {
    alert('Erro ao realizar cadastro: ' + (error.message || 'Tente novamente'))
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 2rem;
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: white;
  width: 100%;
  height: 100%;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--success-500));
  filter: blur(40px);
  animation: float 20s infinite linear;
  opacity: 0.1;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(100px, 100px) rotate(90deg);
  }
  50% {
    transform: translate(0, 200px) rotate(180deg);
  }
  75% {
    transform: translate(-100px, 100px) rotate(270deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%);
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1000px;
  width: calc(100% - 4rem);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
  animation: slideUp 0.8s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-branding {
  padding: 3rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
  display: flex;
  flex-direction: column;
  width: 50%;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-500), var(--success-500));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.brand-logo h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
}

.brand-content {
  flex: 1;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: white;
}

.brand-subtitle {
  font-size: 1.125rem;
  color: var(--gray-300);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--gray-200);
  font-size: 1rem;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.brand-footer {
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--gray-500);
  font-size: 0.875rem;
}

.login-form-container {
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  width: 50%;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--gray-400);
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-300);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--gray-500);
  font-size: 1.125rem;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  color: black;
  font-size: 1rem;
  transition: var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input::placeholder {
  color: var(--gray-500);
}

.form-input.error {
  border-color: var(--danger-500);
}

.error-message {
  font-size: 0.875rem;
  color: var(--danger-400);
}

.general-error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid #f5c6cb;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  font-size: 0.875rem;
  color: var(--primary-400);
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  color: var(--primary-300);
  text-decoration: underline;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--gray-500);
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.password-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--gray-300);
}

.form-options {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--gray-600);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
  font-size: 0.875rem;
  color: var(--gray-300);
}

.submit-btn {
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
  border: none;
  border-radius: var(--radius-lg);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-800));
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--gray-500);
  font-size: 0.875rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  color: var(--gray-300);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.social-btn.google .social-icon {
  background: #4285f4;
  color: white;
}

.social-btn.apple .social-icon {
  background: #000;
  color: white;
}

.social-icon {
  width: 24px;
  height: 24px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}

.register-link p {
  color: var(--gray-400);
  font-size: 0.875rem;
}

.register-link a {
  color: var(--primary-400);
  font-weight: 500;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.demo-credentials {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.demo-title {
  font-size: 0.875rem;
  color: var(--gray-400);
  margin-bottom: 0.75rem;
  text-align: center;
}

.credentials {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.credential {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.credential span {
  color: var(--gray-400);
  min-width: 60px;
}

.credential code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius);
  color: var(--primary-300);
  font-family: monospace;
  flex: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: slideUp 0.3s ease;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: white;
}

.modal-content p {
  color: var(--gray-300);
  margin-bottom: 1.5rem;
}

.modal-close {
  padding: 0.75rem 2rem;
  background: var(--primary-500);
  border: none;
  border-radius: var(--radius-lg);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
}

.modal-close:hover {
  background: var(--primary-600);
}

.modal-close-text {
  margin-top: 1rem;
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  font-size: 0.9rem;
}

.modal-close-text:hover {
  color: var(--gray-200);
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
  
  .login-branding {
    display: none;
  }
  .login-form-container {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-form-container {
    padding: 2rem;
  }
  
  .social-login {
    grid-template-columns: 1fr;
  }
}
</style>