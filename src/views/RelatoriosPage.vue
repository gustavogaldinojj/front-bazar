<template>
  <div class="page-container">
    <header class="page-header">
      <div>
        <h1>Relatórios</h1>
        <p>Análise de dados e exportação de relatórios</p>
      </div>
    </header>

    <section class="report-header-card">
      <div class="date-row">
        <label>
          Data Início
          <input type="date" v-model="inicio" />
        </label>

        <label>
          Data Fim
          <input type="date" v-model="fim" />
        </label>

        <button class="btn-pdf" @click="gerarPdf">
          Gerar Relatório PDF
        </button>
      </div>
    </section>

    <section class="report-builder-card">
      <div class="builder-header">
        <div>
          <h2>Criar Gráfico Personalizado</h2>
          <p>Configure e visualize seus dados da forma que preferir</p>
        </div>
      </div>

      <div class="builder-controls">
        <label>
          Tipo de Gráfico
          <select v-model="chartType">
            <option value="bar">Gráfico de Barras</option>
            <option value="line">Gráfico de Linhas</option>
            <option value="pie">Gráfico de Pizza</option>
          </select>
        </label>

        <label>
          Métrica
          <select v-model="metric">
            <option value="vendas">Vendas (unidades)</option>
            <option value="faturamento">Faturamento</option>
          </select>
        </label>

        <label>
          Agrupamento
          <select v-model="groupBy">
            <option value="mes">Por Mês</option>
            <option value="dia">Por Dia</option>
            <option value="produto">Por Produto</option>
          </select>
        </label>

        <button class="btn-generate" @click="carregarGrafico" :disabled="isLoading">
          {{ isLoading ? 'Carregando...' : 'Gerar Gráfico' }}
        </button>
      </div>
    </section>

    <section class="stats-grid">
      <div class="stat-card">
        <span class="stat-title">Total de Vendas</span>
        <strong class="stat-value">{{ totalVendas }}</strong>
        <span class="stat-subtitle">unidades vendidas</span>
      </div>

      <div class="stat-card">
        <span class="stat-title">Faturamento Total</span>
        <strong class="stat-value">R$ {{ faturamentoTotal.toFixed(2) }}</strong>
        <span class="stat-subtitle">receita gerada</span>
      </div>

    </section>

    <section class="chart-card">
      <div class="chart-header">
        <h2>Gráfico de {{ chartLabel }}</h2>

        <div class="chart-actions">
          <label class="chart-size-control">
            Tamanho:
            <input 
              type="range" 
              min="200" 
              max="600" 
              v-model="chartHeight" 
            />
          </label>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="chartData.datasets[0].data.length" class="chart-wrapper" :style="{ height: chartHeight + 'px' }">
        <component
          :is="chartComponent"
          :data="chartData"
          :options="chartOptions"
        />
      </div>

      <div v-else class="empty-chart">
        Clique em "Gerar Gráfico" para visualizar os dados
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bar, Line, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { relatorioService, type DadosGrafico, type GraficoResponse } from '../services/relatorioService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const inicio = ref('2026-01-01')
const fim = ref(new Date().toISOString().slice(0, 10))

const chartType = ref<'bar' | 'line' | 'pie'>('bar')
const metric = ref<'vendas' | 'faturamento' >('vendas')
const groupBy = ref<'mes' | 'dia' | 'produto'>('mes')

const isLoading = ref(false)
const error = ref('')

const chartLabels = ref<string[]>([])
const chartValues = ref<number[]>([])

const chartComponent = computed(() => {
  if (chartType.value === 'line') return Line
  if (chartType.value === 'pie') return Pie
  return Bar
})

const chartLabel = computed(() => {
  if (metric.value === 'faturamento') return 'Faturamento'
  return 'Vendas'
})

const chartData = computed(() => ({
  labels: chartLabels.value,
  datasets: [
    {
      label: chartLabel.value,
      data: chartValues.value,
      backgroundColor: chartType.value === 'pie'
        ? ['#3b82f6', '#f97316', '#10b981', '#facc15', '#6366f1', '#14b8a6']
        : '#3b82f6',
      borderColor: '#2563eb',
      borderWidth: 1,
      fill: chartType.value !== 'pie'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' as const },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
        }
      }
    }
  }

const totalVendas = computed(() =>
  metric.value === 'vendas'
    ? chartValues.value.reduce((sum, value) => sum + value, 0)
    : 0
)

const faturamentoTotal = computed(() =>
  metric.value === 'faturamento'
    ? chartValues.value.reduce((sum, value) => sum + value, 0)
    : 0
)

const carregarGrafico = async () => {
  isLoading.value = true
  error.value = ''
  chartLabels.value = []
  chartValues.value = []

  try {
    let responseData: { labels: string[]; values: number[] } | DadosGrafico[] = { labels: [], values: [] }

    if (metric.value === 'vendas' && groupBy.value === 'mes') {
      const response = await relatorioService.vendasPorMes()
      responseData = response.data
      chartLabels.value = responseData.map((item: DadosGrafico) => item.periodo)
        chartValues.value = responseData.map(item => {
          const valor = Number(item.total)
          return isNaN(valor) ? 0 : valor
        })    
      } else {
      const response = await relatorioService.grafico(
        metric.value,
        groupBy.value,
        `${inicio.value}T00:00:00`,
        `${fim.value}T23:59:59`
      )
      chartLabels.value = response.data.labels
      chartValues.value = response.data.values
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar gráfico'
  } finally {
    isLoading.value = false
  }
}

const gerarPdf = () => {
  window.print()
}

const chartHeight = ref(300)

</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 40px;
}

.page-header h1 {
  margin: 0;
  font-size: 34px;
  color: #111827;
}

.page-header p {
  margin: 8px 0 0;
  color: #6b7280;
}

.report-header-card,
.report-builder-card,
.chart-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.date-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.date-row label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 180px;
  font-size: 14px;
  color: #475569;
}

.date-row input {
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
  font-size: 14px;
}

.btn-pdf,
.btn-generate {
  background: linear-gradient(135deg, #fb8c00 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 14px 22px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-pdf:hover,
.btn-generate:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(251, 140, 0, 0.22);
}

.report-builder-card {
  border: 2px dashed #dbeafe;
}

.builder-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}

.builder-header h2 {
  margin: 0;
  font-size: 22px;
  color: #111827;
}

.builder-header p {
  margin: 6px 0 0;
  color: #4b5563;
}

.builder-controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 16px;
  align-items: end;
}

.builder-controls label {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  color: #475569;
}

.builder-controls select {
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
}

/* ===== STATS ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.stat-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.stat-title {
  color: #475569;
  font-size: 14px;
}

.stat-value {
  display: block;
  margin: 16px 0 0;
  font-size: 32px;
  color: #111827;
}

.stat-subtitle {
  color: #6b7280;
  margin-top: 8px;
  font-size: 13px;
}

/* ===== CHART ===== */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.chart-header h2 {
  margin: 0;
  font-size: 22px;
  color: #111827;
}

.chart-actions {
  display: flex;
  align-items: center;
}

/* Controle de tamanho */
.chart-size-control {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #475569;
}

.chart-size-control input {
  cursor: pointer;
}

/* IMPORTANTE: remover height fixo */
.chart-wrapper {
  position: relative;
  width: 100%;
}

.chart-wrapper canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* estados */
.empty-chart,
.error-message {
  padding: 26px;
  border-radius: 18px;
  text-align: center;
  background: #f8fafc;
  color: #475569;
  font-size: 15px;
}

.error-message {
  background: #fee2e2;
  color: #b91c1c;
}
</style>