<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <!-- Adicione mais links conforme necessário -->
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// Lógica do sidebar aqui
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #333;
  color: white;
  padding: 20px;
}
</style>