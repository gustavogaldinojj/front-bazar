<template>
  <div class="page-container">
    <header class="page-header">
      <div>
        <h1>Gerenciamento de Usuários</h1>
        <p>Crie, edite e gerencie os usuários do sistema</p>
      </div>
    </header>

<section class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-title">Total Usuários</div>
        <div class="stat-value">{{ totalUsuarios }}</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-title">Administradores</div>
        <div class="stat-value">{{ usuariosPorPerfil.ADMIN || 0 }}</div>
      </div>
      <div class="stat-card sky">
        <div class="stat-title">Gerentes</div>
        <div class="stat-value">{{ usuariosPorPerfil.GERENTE || 0 }}</div>
      </div>
      <div class="stat-card green">
        <div class="stat-title">Vendedores</div>
        <div class="stat-value">{{ usuariosPorPerfil.VENDEDOR || 0 }}</div>
      </div>
    </section>

    <section class="content-grid">
      <div class="card form-card">
      <h2>Novo Usuário</h2>
      <form class="user-form">

        <label>Nome Completo</label>
        <input type="text" placeholder="Ex: João Silva" v-model="form.nome" />

        <label>Email</label>
        <input type="email" placeholder="usuario@email.com" v-model="form.email" />

        <label>Senha</label>
        <input type="password" placeholder="••••••••" v-model="form.senha" />

        <div class="grid-2">
          <div>
            <label>Perfil de Acesso</label>
            <select v-model="form.nivelUsuario">
              <option value="VENDEDOR">Vendedor</option>
              <option value="GERENTE">Gerente</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label>CEP</label>
            <input type="text" placeholder="00000-000" v-model="form.endereco.cep" />
          </div>
        </div>

        <label>Logradouro</label>
        <input type="text" placeholder="Ex: Rua das Flores" v-model="form.endereco.logradouro" />

        <div class="grid-2">
          <div>
            <label>Número</label>
            <input type="text" placeholder="Ex: 123" v-model="form.endereco.numero" />
          </div>
          <div>
            <label>Complemento</label>
            <input type="text" placeholder="Ex: Apto 45" v-model="form.endereco.complemento" />
          </div>
        </div>

        <div class="grid-2">
          <div>
            <label>Bairro</label>
            <input type="text" placeholder="Ex: Centro" v-model="form.endereco.bairro" />
          </div>
          <div>
            <label>Cidade</label>
            <input type="text" placeholder="Ex: São Paulo" v-model="form.endereco.cidade" />
          </div>
        </div>

        <label>Estado (UF)</label>
        <input type="text" placeholder="Ex: SP" maxlength="2" v-model="form.endereco.uf" />

        <div v-if="erro" class="error-message">{{ erro }}</div>

        <button type="button" class="btn-primary" @click="cadastrar" :disabled="isLoading">
          {{ isLoading ? 'Cadastrando...' : 'Cadastrar Usuário' }}
        </button>

      </form>
    </div>

      <div class="card table-card">
        <div class="table-header">
          <h2>Usuários Cadastrados</h2>
          <input type="search" placeholder="Buscar usuários..." v-model="busca" />
        </div>
<!-- 
        <div v-if="isLoading" class="loading">Carregando usuários...</div>

        <div v-else-if="erro" class="error-message">{{ erro }}</div> -->

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
            <td>{{ usuario.nome }}</td>
            <td>{{ usuario.email }}</td>
            <td>
              <span class="badge" :class="badgePerfil(usuario.nivelUsuario)">
                {{ usuario.nivelUsuario }}
              </span>
            </td>
            <td class="actions">
              <span @click="editar(usuario)">✏️</span>
              <span @click="excluir(usuario.id)">🗑️</span>
            </td>
          </tr>

          <tr v-if="usuariosFiltrados.length === 0">
            <td colspan="6" style="text-align: center; color: #999;">
              Nenhum usuário encontrado
            </td>
          </tr>
        </tbody>
        </table>
      </div>
    </section>
  </div>

  <div v-if="showModal" class="modal-overlay">
  <div class="modal card">
    <h2>Editar Usuário</h2>

    <form class="user-form">

      <label>Nome Completo</label>
      <input type="text" v-model="formEdit.nome" />

      <label>Email</label>
      <input type="email" v-model="formEdit.email" />

      <div class="grid-2">
        <div>
          <label>Perfil de Acesso</label>
          <select v-model="formEdit.nivelUsuario">
            <option value="VENDEDOR">Vendedor</option>
            <option value="GERENTE">Gerente</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <label>CEP</label>
          <input type="text" v-model="formEdit.endereco.cep" />
        </div>
      </div>

      <label>Logradouro</label>
      <input type="text" v-model="formEdit.endereco.logradouro" />

      <div class="grid-2">
        <div>
          <label>Número</label>
          <input type="text" v-model="formEdit.endereco.numero" />
        </div>
        <div>
          <label>Complemento</label>
          <input type="text" v-model="formEdit.endereco.complemento" />
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Bairro</label>
          <input type="text" v-model="formEdit.endereco.bairro" />
        </div>
        <div>
          <label>Cidade</label>
          <input type="text" v-model="formEdit.endereco.cidade" />
        </div>
      </div>

      <label>Estado (UF)</label>
      <input type="text" maxlength="2" v-model="formEdit.endereco.uf" />

      <div class="modal-actions">
        <button type="button" @click="showModal = false">
          Cancelar
        </button>

        <button type="button" class="btn-primary" @click="atualizarUsuario">
          Salvar Alterações
        </button>
      </div>

    </form>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usuarioService, type DadosCadastroUsuario, type DadosAtualizaUsuario } from '../services/usuarioService'

// Interfaces baseadas na API
interface Usuario {
  id: number
  nome: string
  email: string
  nivelUsuario: string
  status: string
  endereco?: any 
}

// Estado reativo
const usuarios = ref<Usuario[]>([])
const isLoading = ref(false)
const erro = ref('')
const busca = ref('')
const isSubmitting = ref(false)

// Formulário de novo usuário
const form = ref<DadosCadastroUsuario>({
  nome: '',
  senha: '',
  email: '',
  nivelUsuario: 'VENDEDOR',
  endereco: {
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    numero: ''
  },
})

// Computed para estatísticas
const totalUsuarios = computed(() => usuarios.value.length)

const usuariosPorPerfil = computed(() => {
  const contagem: Record<string, number> = {}
  usuarios.value.forEach(u => {
    contagem[u.nivelUsuario] = (contagem[u.nivelUsuario] || 0) + 1
  })
  return contagem
})

// Computed para usuários filtrados
const usuariosFiltrados = computed(() => {
  if (!busca.value) return usuarios.value
  const termo = busca.value.toLowerCase()
  return usuarios.value.filter(u =>
    u.nome.toLowerCase().includes(termo) ||
    u.email.toLowerCase().includes(termo) ||
    u.nivelUsuario.toLowerCase().includes(termo)
  )
})

// Funções auxiliares
const badgePerfil = (perfil: string) => {
  const classes: Record<string, string> = {
    ADMIN: 'badge-admin',
    GERENTE: 'badge-manager',
    VENDEDOR: 'badge-sales'
  }
  return classes[perfil] || 'badge-default'
}

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

// Funções principais
const carregarUsuarios = async () => {
  isLoading.value = true
  erro.value = ''

  try {
    console.log('🔄 [Gerenciamento] Carregando usuários...')
    const response = await usuarioService.listar()
    console.log('✅ [Gerenciamento] Usuários carregados:', response.data)

    // Ajuste conforme a estrutura da resposta da API
    usuarios.value = response.data.content || response.data || []
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao carregar usuários'
    console.error('❌ [Gerenciamento] Erro ao carregar usuários:', error)
  } finally {
    isLoading.value = false
  }
}

const cadastrar = async () => {
  isSubmitting.value = true

  try {
    console.log('🔄 [Gerenciamento] Cadastrando usuário...')
    await usuarioService.cadastrar(form.value)
    console.log('✅ [Gerenciamento] Usuário cadastrado com sucesso')

    // Limpar formulário
    form.value = {
      nome: '',
      senha: '',
      email: '',
      nivelUsuario: 'VENDEDOR',
      endereco: {
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
        numero: ''
      },
    }

    // Recarregar lista
    await carregarUsuarios()
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao cadastrar usuário'
    console.error('❌ [Gerenciamento] Erro ao cadastrar:', error)
  } finally {
    isSubmitting.value = false
  }
}

const showModal = ref(false)
const usuarioEditando = ref<Usuario | null>(null)

const formEdit = ref<DadosAtualizaUsuario>({
  nome: '',
  email: '',
  nivelUsuario: 'VENDEDOR',
  endereco: {
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    numero: '',
    complemento: ''
  }
})

const editar = (usuario: Usuario) => {
  usuarioEditando.value = usuario

  formEdit.value = {
    nome: usuario.nome,
    email: usuario.email,
    nivelUsuario: usuario.nivelUsuario,
    endereco: {
      logradouro: usuario.endereco?.logradouro || '',
      bairro: usuario.endereco?.bairro || '',
      cidade: usuario.endereco?.cidade || '',
      uf: usuario.endereco?.uf || '',
      cep: usuario.endereco?.cep || '',
      numero: usuario.endereco?.numero || '',
      complemento: usuario.endereco?.complemento || ''
    }
  }

  showModal.value = true
}

const atualizarUsuario = async () => {
  if (!usuarioEditando.value) return

  try {    
    await usuarioService.atualizar(usuarioEditando.value.id, formEdit.value)

    showModal.value = false
    usuarioEditando.value = null

    await carregarUsuarios()
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao atualizar usuário'
  }
}

const excluir = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return

  try {
    await usuarioService.excluir(id)

    // Recarregar lista
    await carregarUsuarios()
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao excluir usuário'
    console.error('❌ [Gerenciamento] Erro ao excluir:', error)
  }
}

// Lifecycle
onMounted(() => {
  carregarUsuarios()
})
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 32px;
  color: #1f2958;
}

.page-header p {
  margin: 8px 0 0;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.stat-card {
  border-radius: 20px;
  padding: 24px;
  color: white;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-card.blue { background: linear-gradient(135deg, #4169e1 0%, #1e3c72 100%); }
.stat-card.purple { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); }
.stat-card.sky { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); }
.stat-card.green { background: linear-gradient(135deg, #16a34a 0%, #4ade80 100%); }

.stat-title {
  font-size: 14px;
  opacity: 0.85;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1.8fr;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  padding: 28px;
}

.form-card h2,
.table-card h2 {
  margin: 0 0 18px;
  color: #1f2958;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.user-form label {
  font-size: 13px;
  color: #475569;
}
.user-form input,
.user-form select {
  width: 100%;
  border: 1px solid #d8dee7;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  background: #f8fafc;
}

.grid-2 {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.btn-primary {
  width: fit-content;
  background: linear-gradient(135deg, #fb8c00 0%, #f97316 100%);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.table-header input {
  width: 260px;
  padding: 12px 14px;
  border: 1px solid #d8dee7;
  border-radius: 12px;
  background: #f8fafc;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 16px 12px;
  font-size: 14px;
  color: #334155;
}

thead th {
  color: #64748b;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
}

tbody tr:hover {
  background: #f8fafc;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-admin { background: rgba(124, 58, 237, 0.12); color: #6d28d9; }
.badge-manager { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
.badge-sales { background: rgba(16, 185, 129, 0.12); color: #15803d; }
.badge-active { background: rgba(16, 185, 129, 0.12); color: #166534; }

.actions {
  display: flex;
  gap: 10px;
}
.actions span { cursor: pointer; }
@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 28px;
  border-radius: 24px;
  width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>