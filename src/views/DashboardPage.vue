<template>
  <div class="dashboard-container">
    <Sidebar />

    <main class="main-content">
      <div class="content-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo ao sistema de gestão de roupas</p>
      </div>

      <div class="content-body">
        <div class="welcome-card">
          <h2>Login realizado com sucesso!</h2>
          <p>Usuário: <strong>{{ authStore.user?.nome || 'N/A' }}</strong></p>
          <p>Email: <strong>{{ authStore.user?.email || 'N/A' }}</strong></p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'
import Sidebar from '../components/layout/Sidebar.vue'

const authStore = useAuthStore()
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  margin-left: 280px; /* Largura do sidebar */
  padding: 30px;
}

.content-header {
  margin-bottom: 30px;
}

.content-header h1 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 32px;
}

.content-header p {
  color: #666;
  margin: 0;
  font-size: 16px;
}

.content-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.welcome-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.welcome-card h2 {
  color: #1e3c72;
  margin: 0 0 20px 0;
  font-size: 24px;
}

.welcome-card p {
  margin: 10px 0;
  color: #555;
  font-size: 16px;
}

.welcome-card strong {
  color: #2a5298;
}

/* Responsivo */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }

  .content-header h1 {
    font-size: 24px;
  }

  .content-body {
    grid-template-columns: 1fr;
  }
}
</style>