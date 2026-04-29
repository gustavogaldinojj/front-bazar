<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Bazar</h2>
      <p>Sistema de Gestão</p>
    </div>

    <nav class="sidebar-nav">
      <ul>
          <li>
          <router-link to="/gerenciamento" class="nav-link" :class="{ active: $route.path === '/gerenciamento' }">
            <span class="text">Gerenciamento</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard" class="nav-link" :class="{ active: $route.path === '/dashboard' }">
            <span class="text">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/produtos" class="nav-link" :class="{ active: $route.path === '/produtos' }">
            <span class="text">Produtos</span>
          </router-link>
        </li>
        <li>
          <router-link to="/vendas" class="nav-link" :class="{ active: $route.path === '/vendas' }">
            <span class="text">Vendas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/relatorios" class="nav-link" :class="{ active: $route.path === '/relatorios' }">
            <span class="text">Relatórios</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="avatar">{{ userInitials }}</div>
        <div class="user-details">
          <span class="name">{{ userName }}</span>
          <span class="role">{{ userRole }}</span>
        </div>
      </div>
      <button @click="handleLogout" class="btn-logout">
        <span class="text">Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.nome || 'Usuário')
const userRole = computed(() => authStore.user?.role || 'user')
const userInitials = computed(() => {
  const name = userName.value
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar-header {
  padding: 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.sidebar-header h2 {
  margin: 0 0 5px 0;
  font-size: 24px;
  font-weight: 700;
}

.sidebar-header p {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.sidebar-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar-nav li {
  margin-bottom: 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: #ff9800;
}

.nav-link.active {
  background-color: rgba(255, 152, 0, 0.2);
  color: white;
  border-left-color: #ff9800;
}

.nav-link .icon {
  margin-right: 15px;
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.nav-link .text {
  font-weight: 500;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff9800 0%, #ff6f00 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
}

.user-details {
  flex: 1;
}

.user-details .name {
  display: block;
  font-weight: 600;
  font-size: 14px;
}

.user-details .role {
  display: block;
  font-size: 12px;
  opacity: 0.7;
  text-transform: capitalize;
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-logout:hover {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  border-color: #ff0000;
}

.btn-logout .icon {
  margin-right: 8px;
}

.btn-logout .text {
  font-size: 14px;
}

/* Responsivo */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>