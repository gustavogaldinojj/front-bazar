import api from './api'

export interface Movimentacao {
  id: number
  nomeProduto : string
  tipo: 'ENTRADA' | 'SAIDA'
  quantidade: number
  data: string
}

export interface DadosMovimentacao {
  roupaId: number
  tipo: 'ENTRADA' | 'SAIDA'
  quantidade: number
}

export interface RelatorioVendas {
  totalVendido: number
  faturamentoTotal: number
  faturamentoPorPeriodo?: number
  totalVendidoPorPeriodo?: number
}

export const vendaService = {
  // Registrar movimentação (entrada/saída)
  registrar: (dados: DadosMovimentacao) =>
    api.post('/movimentacoes', dados),

  // Listar todas as movimentações
  listar: () =>
    api.get('/movimentacoes'),

  // Listar movimentações de uma roupa específica
  listarPorRoupa: (roupaId: number) =>
    api.get(`/movimentacoes/roupa/${roupaId}`),

  // Relatórios
  relatorios: {
    // Total de unidades vendidas (SAIDA)
    totalVendido: () =>
      api.get('/movimentacoes/relatorios/total-vendido'),

    // Total vendido em um período
    totalVendidoPorPeriodo: (inicio: string, fim: string) =>
      api.get('/movimentacoes/relatorios/por-periodo', {
        params: { inicio, fim }
      }),

    // Total vendido de uma roupa específica
    totalVendidoPorRoupa: (roupaId: number) =>
      api.get(`/movimentacoes/relatorios/por-roupa/${roupaId}`),

    // Faturamento total
    faturamentoTotal: () =>
      api.get('/movimentacoes/relatorios/faturamento'),

    // Faturamento em um período
    faturamentoPorPeriodo: (inicio: string, fim: string) =>
      api.get('/movimentacoes/relatorios/faturamento/por-periodo', {
        params: { inicio, fim }
      }),

    // Faturamento de uma roupa específica
    faturamentoPorRoupa: (roupaId: number) =>
      api.get(`/movimentacoes/relatorios/faturamento/por-roupa/${roupaId}`)
  }
}