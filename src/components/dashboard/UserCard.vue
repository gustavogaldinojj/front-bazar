<template>
  <Card title="Informações do Usuário">
    <div class="user-details">
      <div class="detail-item">
        <span class="label">Nome:</span>
        <span class="value">{{ user?.nome || 'Não informado' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Email:</span>
        <span class="value">{{ user?.email || 'Não informado' }}</span>
      </div>
      <div v-if="user?.role" class="detail-item">
        <span class="label">Papel:</span>
        <span class="value">{{ user.role }}</span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '../common/Card.vue'

interface User {
  nome?: string
  email?: string
  role?: string
}

defineProps<{
  user?: User
}>()
</script>

<style scoped>
.user-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #667eea;
}

.value {
  color: #555;
}

@media (max-width: 768px) {
  .detail-item {
    flex-direction: column;
    gap: 5px;
  }
}
</style>