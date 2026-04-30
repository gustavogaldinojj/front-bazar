<template>
  <!-- Para páginas sem sidebar (login), renderizar apenas o conteúdo -->
  <router-view v-if="!showSidebar" />
  
  <!-- Para páginas com sidebar, usar o layout completo -->
  <div v-else class="app-layout">
    <Sidebar />
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './layout/Sidebar.vue'

const route = useRoute()

// Mostrar sidebar em todas as páginas exceto login
const showSidebar = computed(() => route.path !== '/login')
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 30px;
  margin-left: 280px; /* Largura do sidebar */
}

/* Responsivo */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>