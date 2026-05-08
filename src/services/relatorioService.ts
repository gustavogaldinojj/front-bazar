import api from './api'

export interface DadosGrafico {
  periodo: string
  total: number
}

export const relatorioService = {
  totalVendido: () =>
    api.get<number>('/movimentacoes/relatorios/total-vendido'),

  faturamentoTotal: () =>
    api.get<number>('/movimentacoes/relatorios/faturamento'),

  totalVendidoPorPeriodo: (inicio: string, fim: string) =>
    api.get<number>('/movimentacoes/relatorios/por-periodo', {
      params: { inicio, fim }
    }),

  faturamentoPorPeriodo: (inicio: string, fim: string) =>
    api.get<number>('/movimentacoes/relatorios/faturamento/por-periodo', {
      params: { inicio, fim }
    }),

  grafico: (
    tipo: 'VENDAS' | 'FATURAMENTO',
    agrupamento: 'DIA' | 'MES',
    inicio: string,
    fim: string
  ) =>
    api.get<DadosGrafico[]>('/movimentacoes/relatorios/grafico', {
      params: { tipo, agrupamento, inicio, fim }
    })
}