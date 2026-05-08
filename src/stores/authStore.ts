import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Recuperar dados do localStorage ao iniciar
 const initializeAuth = () => {
  const savedToken = localStorage.getItem('auth_token')
  const savedUser = localStorage.getItem('user')

  if (savedToken && savedUser && savedUser !== 'undefined') {
    try {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    } catch (error) {
      console.error('Erro ao parsear usuário:', error)

      // limpa dados corrompidos
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')

      token.value = null
      user.value = null
    }
  }
}

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (email: string, senha: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', {
        email,
        senha
      })

      // A API retorna apenas o token JWT
      const responseToken = response.data

      // Decodificar o payload do JWT para obter informações do usuário
      const payload = JSON.parse(atob(responseToken.split('.')[1]))

      // Criar objeto user com base no payload
      const responseUser: User = {
        id: 1, // Você pode ajustar conforme necessário
        email: payload.sub, // 'sub' contém o email
        nome: payload.sub.split('@')[0], // Usar parte do email como nome temporário
        role: 'user' // Role padrão
      }

      // Salvar no store
      token.value = responseToken
      user.value = responseUser

      // Salvar no localStorage
      localStorage.setItem('auth_token', responseToken)
      localStorage.setItem('user', JSON.stringify(responseUser))

      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    initializeAuth,
    login,
    logout
  }
})