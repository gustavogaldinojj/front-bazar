import api from './api'

export interface DadosGrafico {
  periodo: string
  total: number
}

export interface GraficoResponse {
  labels: string[]
  values: number[]
}

export const relatorioService = {
  vendasPorMes: () =>
    api.get<DadosGrafico[]>('/movimentacoes/relatorios/vendas-por-mes'),

  resumo: (inicio: string, fim: string) =>
    api.get('/movimentacoes/relatorios/resumo', { params: { inicio, fim } }),

  grafico: (
    tipo: 'vendas' | 'faturamento' | 'ticket',
    agrupamento: 'dia' | 'mes' | 'produto',
    inicio: string,
    fim: string
  ) =>
    api.get<GraficoResponse>('/movimentacoes/relatorios/grafico', {
      params: { tipo, agrupamento, inicio, fim }
    })
}