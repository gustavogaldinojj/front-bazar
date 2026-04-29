<template>
  <nav class="navbar">
    <div class="navbar-content">
      <h2>{{ title }}</h2>
      <div class="user-info">
        <span>Bem-vindo, {{ userName }}!</span>
        <button @click="handleLogout" class="btn-logout">
          Sair
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  userName: string
}>()

defineEmits<{
  logout: []
}>()

const handleLogout = () => {
  emit('logout')
}

const emit = defineEmits<{
  logout: []
}>()
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-content h2 {
  margin: 0;
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-logout {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 15px;
  }

  .user-info {
    flex-direction: column;
    width: 100%;
  }

  .btn-logout {
    width: 100%;
  }
}
</style>