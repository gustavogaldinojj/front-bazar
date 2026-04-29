<template>
  <div class="login-left">
    <h1>Sistema de Gestão de Roupas</h1>
    <p>Controle total sobre seu estoque, vendas e faturamento em um só lugar.</p>
  </div>
</template>

<script setup lang="ts">
// Sem lógica, apenas apresentação
</script>

<style scoped>
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 40px;
}

.login-left h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.login-left p {
  font-size: 18px;
  line-height: 1.6;
  opacity: 0.9;
  max-width: 400px;
}

@media (max-width: 768px) {
  .login-left {
    padding: 40px 20px;
    min-height: 250px;
  }

  .login-left h1 {
    font-size: 32px;
  }

  .login-left p {
    font-size: 16px;
  }
}
</style>