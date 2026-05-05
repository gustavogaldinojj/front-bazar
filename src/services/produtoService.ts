import api from './api'

export interface Produto {
  id: number
  nome: string
  categoria: string
  tamanho: string
  cor: string
  preco: number
  quantidade: number
}

export interface CadastroProduto {
  nome: string
  categoria: string
  tamanho: string
  cor: string
  preco: number
  quantidade: number
}

export const produtoService = {
   cadastrar: (dados: CadastroProduto) =>
    api.post('/roupas', { ...dados }),

  listar: (page = 0, size = 10) =>
    api.get('/roupas', { params: { page, size } }),

  detalhar: (id: number) =>
    api.get(`/roupas/${id}`),

  atualizar: (id: number, dados: CadastroProduto) =>
    api.put(`/roupas/${id}`, dados),

  excluir: (id: number) =>
    api.delete(`/roupas/${id}`)
}