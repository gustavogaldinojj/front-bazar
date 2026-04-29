<template>
  <div class="login-container">
    <LoginBanner />
    <div class="login-right">
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginBanner from '../components/auth/LoginBanner.vue'
import LoginForm from '../components/auth/LoginForm.vue'
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  background: white;
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: #f9f9f9;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-right {
    padding: 30px 20px;
  }
}
</style>