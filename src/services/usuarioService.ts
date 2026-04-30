import api from './api'

// Espelha exatamente o DadosEndereco.java
export interface DadosEndereco {
  logradouro: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  numero: string
  complemento?: string // único que pode ser opcional
}

// Espelha exatamente o DadosCadastroUsuario.java
export interface DadosCadastroUsuario {
  nome: string
  senha: string
  email: string
  nivelUsuario: string  // era "perfil", agora o nome correto
  endereco: DadosEndereco // era ausente, agora obrigatório
}

// Espelha o DadosAtualizaUsuario.java
export interface DadosAtualizaUsuario {
  nome?: string
  email?: string
  nivelUsuario?: string
  endereco: DadosEndereco
}

export const usuarioService = {
  cadastrar: (dados: DadosCadastroUsuario) =>
    api.post('/usuarios', dados),

  listar: (page = 0, size = 10) =>
    api.get('/usuarios', { params: { page, size } }),

  detalhar: (id: number) =>
    api.get(`/usuarios/${id}`),

  atualizar: (id: number, dados: DadosAtualizaUsuario) =>
    api.put(`/usuarios/${id}`, dados),

  excluir: (id: number) =>
    api.delete(`/usuarios/${id}`)
}