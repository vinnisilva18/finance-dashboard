<!-- frontend/src/views/NotFound.vue -->
<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <div class="error-code">404</div>
        <h1 class="error-title">Página não encontrada</h1>
        <p class="error-message">
          A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
        </p>
        <div class="error-actions">
          <router-link to="/" class="btn-primary">
            <span>Voltar para o Dashboard</span>
          </router-link>
          <button @click="goBack" class="btn-secondary">
            <span>Voltar à página anterior</span>
          </button>
        </div>
        <div class="error-search">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="O que você está procurando?"
              class="search-input"
            >
            <button class="search-btn">
              <span>🔍</span>
            </button>
          </div>
        </div>
      </div>
      <div class="error-illustration">
        <div class="illustration">
          <div class="astronaut">👨‍🚀</div>
          <div class="planet">🪐</div>
          <div class="stars">
            <span v-for="i in 20" :key="i" class="star">⭐</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, #1e293b 100%);
  padding: 2rem;
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
}

.error-content {
  animation: slideInLeft 0.6s ease;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary-500), var(--success-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.error-message {
  font-size: 1.125rem;
  color: var(--gray-300);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition-base);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-800));
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--gray-200);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.error-search {
  max-width: 400px;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem 1rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  color: white;
  font-size: 1rem;
  transition: var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  background: rgba(255, 255, 255, 0.12);
}

.search-input::placeholder {
  color: var(--gray-500);
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius);
  transition: var(--transition-fast);
}

.search-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.error-illustration {
  animation: slideInRight 0.6s ease;
}

.illustration {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
}

.astronaut {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8rem;
  animation: float 3s ease-in-out infinite;
}

.planet {
  position: absolute;
  top: 20%;
  right: 10%;
  font-size: 6rem;
  animation: rotate 20s linear infinite;
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.star {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.5;
  animation: twinkle 2s ease-in-out infinite;
}

.star:nth-child(odd) {
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-20px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>