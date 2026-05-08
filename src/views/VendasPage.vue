<template>
  <div class="page-container">
    <header class="page-header">
      <div>
        <h1>Registro de Vendas</h1>
        <p>Registre as vendas realizadas</p>
      </div>
    </header>

    <section class="stats-grid">
      <div class="stat-card-large blue">
        <div class="stat-icon">🛒</div>
        <div class="stat-content">
          <div class="stat-title">Total de Vendas</div>
          <div class="stat-value">{{ totalVendido }}</div>
          <div class="stat-subtitle">produtos vendidos</div>
        </div>
      </div>
      <div class="stat-card-large orange">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-title">Faturamento Total</div>
          <div class="stat-value">R$ {{ faturamentoTotal.toFixed(2) }}</div>
          <div class="stat-subtitle">receita gerada</div>
        </div>
      </div>
    </section>

    <section class="content-grid">
      <div class="card form-card">
        <h2>Registrar Nova Venda</h2>
        <form @submit.prevent="registrarVenda" class="venda-form">
          <label>Produto</label>
          <select v-model.number="form.roupaId" required>
            <option value="">Selecione um produto</option>
            <option v-for="produto in produtosDisponveis" :key="produto.id" :value="produto.id">
              {{ produto.nome }} - R$ {{ produto.preco.toFixed(2) }}
            </option>
          </select>

          <label>Quantidade</label>
          <input 
            type="number" 
            placeholder="0" 
            v-model.number="form.quantidade"
            min="1"
            required 
          />

          <div v-if="erro" class="error-message">{{ erro }}</div>

          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Registrando...' : '🛒 Registrar Venda' }}
          </button>
        </form>
      </div>

      <div class="card table-card">
        <div class="table-header">
          <h2>Histórico de Vendas</h2>
          <input 
            type="search" 
            placeholder="Buscar por produto..." 
            v-model="busca" 
          />
        </div>

        <div v-if="isLoading" class="loading">Carregando vendas...</div>

        <div v-else-if="erro && !isLoading" class="error-message">{{ erro }}</div>

        <table v-else>
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mov in movimentacoesFiltradas" :key="mov.id">
              <td>
                <div class="data-cell">
                  📅 {{ formatarData(mov.data) }}
                </div>
              </td>
              <td>
                <strong>{{ mov.nomeProduto }}</strong>
              </td>
              <td>
                <span class="badge badge-saida">{{ mov.tipo }}</span>
              </td>
              <td>{{ mov.quantidade }} un.</td>
            </tr>

            <tr v-if="movimentacoesFiltradas.length === 0">
              <td colspan="4" style="text-align: center; color: #999;">
                Nenhuma venda encontrada
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { vendaService, type DadosMovimentacao, type Movimentacao } from '../services/vendaService'
import { produtoService, type Produto } from '../services/produtoService'

// Estado reativo
const movimentacoes = ref<Movimentacao[]>([])
const produtos = ref<Produto[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const erro = ref('')
const busca = ref('')
const mostrarFiltros = ref(false)

// Relatórios
const totalVendido = ref(0)
const faturamentoTotal = ref(0)

// Formulário de nova movimentação
const form = ref<DadosMovimentacao>({
  roupaId: 0,
  tipo: 'SAIDA',
  quantidade: 1
})

// Carrega dados iniciais
const carregarDados = async () => {
  isLoading.value = true
  erro.value = ''

  try {

    // Carregar movimentações
    const movResponse = await vendaService.listar()
    movimentacoes.value = movResponse.data || []

    // Carregar produtos
    const prodResponse = await produtoService.listar(0, 100)
    produtos.value = prodResponse.data.content || prodResponse.data || []

    // Carregar relatórios
    await carregarRelatorios()
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao carregar dados'
    console.error('❌ [Vendas] Erro:', error)
  } finally {
    isLoading.value = false
  }
}

const carregarRelatorios = async () => {
  try {

    // Total vendido
    const totalResponse = await vendaService.relatorios.totalVendido()
    totalVendido.value = totalResponse.data || 0

    // Faturamento total
    const faturResponse = await vendaService.relatorios.faturamentoTotal()
    faturamentoTotal.value = parseFloat(faturResponse.data) || 0

  } catch (error: any) {
    console.error('❌ [Vendas] Erro ao carregar relatórios:', error)
  }
}

// Registrar movimentação (venda)
const registrarVenda = async () => {
  if (!form.value.roupaId) {
    erro.value = 'Selecione um produto'
    return
  }

  if (form.value.quantidade <= 0) {
    erro.value = 'Quantidade deve ser maior que 0'
    return
  }

  isSubmitting.value = true
  erro.value = ''

  try {

    await vendaService.registrar({
      roupaId: form.value.roupaId,
      tipo: 'SAIDA',
      quantidade: form.value.quantidade
    })


    // Limpar formulário
    form.value = {
      roupaId: 0,
      tipo: 'SAIDA',
      quantidade: 1
    }

    // Recarregar dados
    await carregarDados()
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao registrar venda'
    console.error('❌ [Vendas] Erro ao registrar:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Computed
const produtosDisponveis = computed(() => produtos.value)

const movimentacoesSaida = computed(() =>
  movimentacoes.value.filter(m => m.tipo === 'SAIDA')
)

const movimentacoesFiltradas = computed(() => {
  let resultado = movimentacoesSaida.value

  if (busca.value) {
    const termo = busca.value.toLowerCase()
    resultado = resultado.filter(m =>
    m.nomeProduto.toLowerCase().includes(termo)
    )
  }

  return resultado.sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  )
})

const formatarData = (data: string) => {
  const limpa = data.split('.')[0]
  return new Date(limpa).toLocaleString('pt-BR')
}

// Lifecycle
onMounted(() => {
  carregarDados()
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.stat-card-large {
  border-radius: 20px;
  padding: 28px;
  color: white;
  min-height: 140px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-card-large.blue {
  background: linear-gradient(135deg, #4169e1 0%, #1e3c72 100%);
}

.stat-card-large.orange {
  background: linear-gradient(135deg, #fb8c00 0%, #f97316 100%);
}

.stat-icon {
  font-size: 48px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  opacity: 0.85;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin: 8px 0;
}

.stat-subtitle {
  font-size: 13px;
  opacity: 0.75;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
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

.venda-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.venda-form label {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.venda-form input,
.venda-form select {
  width: 100%;
  border: 1px solid #d8dee7;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  background: #f8fafc;
  transition: border-color 0.2s;
}

.venda-form input:focus,
.venda-form select:focus {
  outline: none;
  border-color: #fb8c00;
  background: white;
}

.grid-2 {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.resumo-venda {
  background: #f8fafc;
  border: 1px solid #d8dee7;
  border-radius: 12px;
  padding: 12px 16px;
}

.resumo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.resumo-item strong {
  color: #1f2958;
  font-size: 16px;
}

.btn-primary {
  width: fit-content;
  background: linear-gradient(135deg, #fb8c00 0%, #f97316 100%);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(251, 140, 0, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex: 1;
  min-width: 300px;
}

.filter-group input {
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #d8dee7;
  border-radius: 12px;
  background: #f8fafc;
  font-size: 14px;
}

.btn-filter {
  padding: 12px 18px;
  background: #e2e8f0;
  color: #334155;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-filter:hover {
  background: #cbd5e1;
}

.filtros {
  background: #f8fafc;
  border: 1px solid #d8dee7;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 18px;
}

.filtros label {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.filtros input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d8dee7;
  border-radius: 12px;
  background: white;
  font-size: 14px;
}

.btn-apply {
  margin-top: 12px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #fb8c00 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #c33;
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

.data-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.valor-total {
  color: #16a34a;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions span {
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
}

.actions span:hover {
  transform: scale(1.2);
}

.table-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  margin-top: 16px;
}

.footer-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-item strong {
  color: #1f2958;
  font-size: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 28px;
  border-radius: 24px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin: 0 0 24px;
  color: #1f2958;
}

.detalhes {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.detalhe-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.detalhe-item.total {
  background: linear-gradient(135deg, #fb8c00 0%, #f97316 100%);
  color: white;
}

.detalhe-item strong {
  color: #1f2958;
}

.detalhe-item.total strong {
  color: white;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .footer-stats { grid-template-columns: 1fr; }
}
</style>