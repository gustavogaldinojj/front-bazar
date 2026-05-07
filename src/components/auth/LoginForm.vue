<template>
  <div class="login-box">
    <!-- Icon -->
    <div class="login-icon">→</div>

    <h2>Bem-vindo!</h2>
    <p class="subtitle">Entre com suas credenciais</p>

    <form @submit.prevent="handleLogin">
      <!-- Email -->
      <FormInput
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        :model-value="form.email"
        :disabled="isLoading"
        required
        @update:model-value="form.email = $event"
      />

      <!-- Senha -->
      <FormInput
        id="senha"
        label="Senha"
        type="password"
        placeholder="••••••••"
        :model-value="form.senha"
        :disabled="isLoading"
        required
        @update:model-value="form.senha = $event"
      />

      <!-- Mensagem de erro -->
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>

      <!-- Botão de login -->
      <button type="submit" class="btn-login" :disabled="isLoading">
        {{ isLoading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <!-- Link para recuperar senha -->
    <div class="footer-link">
      <a href="#" @click.prevent="handleForgotPassword">Esqueceu sua senha?</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import FormInput from '../common/FormInput.vue'

const router = useRouter()
const authStore = useAuthStore()

interface LoginForm {
  email: string
  senha: string
}

const form = ref<LoginForm>({
  email: '',
  senha: ''
})

const isLoading = ref(false)

const handleLogin = async () => {
  console.log('🔐 [LoginForm] handleLogin chamado')
  console.log('📧 Email:', form.value.email)
  console.log('🔑 Senha: [OCULTA]')

  isLoading.value = true

  try {
    const success = await authStore.login(form.value.email, form.value.senha)

    if (success) {
      await router.push('/produtos')
    } else {
    }
  } catch (error) {
    console.error('💥 [LoginForm] Erro inesperado no handleLogin:', error)
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  // Implementar lógica de recuperação de senha
}
</script>

<style scoped>
.login-box {
  width: 100%;
  max-width: 400px;
}

.login-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff9800 0%, #ff6f00 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 28px;
  font-weight: bold;
  margin: 0 auto 30px;
}

.login-box h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 30px;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  border-left: 4px solid #c62828;
}

.btn-login {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #ff9800 0%, #ff6f00 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer-link {
  text-align: center;
}

.footer-link a {
  color: #2196f3;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-link a:hover {
  color: #1976d2;
  text-decoration: underline;
}
</style>  