<template>
  <div>
    <h1>Dashboard</h1>
    <p>Login realizado com sucesso!</p>
    <p>Usuário: {{ authStore.user?.nome || 'N/A' }}</p>
    
    <!-- Botão de logout -->
    <button @click="handleLogout" class="btn-logout">
      Sair
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  console.log('🚪 [Dashboard] Fazendo logout')
  authStore.logout()
  router.push('/login')
  console.log('🏠 [Dashboard] Redirecionado para /login')
}
</script>

<style scoped>
div {
  padding: 20px;
  text-align: center;
}

.btn-logout {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: #d32f2f;
}
</style>