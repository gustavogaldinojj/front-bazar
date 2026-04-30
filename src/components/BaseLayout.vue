<template>
  <div v-if="showSidebar" class="app-layout">
    <Sidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>

  <router-view v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './layout/Sidebar.vue'

const route = useRoute()
const showSidebar = computed(() => route.path !== '/login')
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 30px;
  background: #f5f7fb;
}
</style>