<template>
  <div class="page-container">
    <header class="page-header">
      <div>
        <h1>Cadastro de Roupas</h1>
        <p>Gerencie o catálogo de produtos</p>
      </div>
    </header>

    <section class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-title">Total de Produtos</div>
        <div class="stat-value">{{ totalProdutos }}</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-title">Valor Total</div>
        <div class="stat-value">R$ {{ valorTotal.toFixed(2) }}</div>
      </div>
      <div class="stat-card sky">
        <div class="stat-title">Quantidade em Estoque</div>
        <div class="stat-value">{{ totalEstoque }}</div>
      </div>
      <div class="stat-card green">
        <div class="stat-title">Categorias</div>
        <div class="stat-value">{{ totalCategorias }}</div>
      </div>
    </section>

    <section class="content-grid">
      <div class="card form-card">
        <h2>Novo Produto</h2>
        <form @submit.prevent="cadastrar" class="product-form">
          <label>Nome do Produto</label>
          <input 
            type="text" 
            placeholder="Ex: Camiseta Polo" 
            v-model="form.nome"
            required 
          />

          <div class="grid-2">
            <div>
              <label>Categoria</label>
              <select v-model="form.categoria" required>
                <option value="">Selecione uma categoria</option>
                <option value="Camisetas">Camisetas</option>
                <option value="Calças">Calças</option>
                <option value="Vestidos">Vestidos</option>
                <option value="Jaquetas">Jaquetas</option>
                <option value="Acessórios">Acessórios</option>
              </select>
            </div>
            <div>
              <label>Tamanho</label>
              <select v-model="form.tamanho" required>
                <option value="">Selecione um tamanho</option>
                <option value="P">P (Pequeno)</option>
                <option value="M">M (Médio)</option>
                <option value="G">G (Grande)</option>
                <option value="GG">GG (Extra Grande)</option>
                <option value="Único">Único</option>
              </select>
            </div>
          </div>

          <div class="grid-2">
            <div>
              <label>Cor</label>
              <input 
                type="text" 
                placeholder="Ex: Azul" 
                v-model="form.cor"
                required 
              />
            </div>
            <div>
              <label>Preço (R$)</label>
              <input 
                type="number" 
                placeholder="0,00" 
                v-model.number="form.preco"
                step="0.01"
                min="0"
                required 
              />
            </div>
          </div>

          <label>Quantidade</label>
          <input 
            type="number" 
            placeholder="0" 
            v-model.number="form.quantidade"
            min="0"
            required 
          />

          <div v-if="erro" class="error-message">{{ erro }}</div>

          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Cadastrando...' : '+ Cadastrar Produto' }}
          </button>
        </form>
      </div>

      <div class="card table-card">
        <div class="table-header">
          <h2>Produtos Cadastrados</h2>
          <input 
            type="search" 
            placeholder="Buscar produtos..." 
            v-model="busca" 
          />
        </div>

        <div v-if="isLoading" class="loading">Carregando produtos...</div>

        <div v-else-if="erro && !isLoading" class="error-message">{{ erro }}</div>

        <table v-else>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Tamanho</th>
              <th>Cor</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="produto in produtosFiltrados" :key="produto.id">
              <td>{{ produto.nome }}</td>
              <td>
                <span class="badge badge-category">
                  {{ produto.categoria }}
                </span>
              </td>
              <td>{{ produto.tamanho }}</td>
              <td>
                <div class="color-display">
                  <span class="color-dot" :style="{ backgroundColor: getColorCode(produto.cor) }"></span>
                  {{ produto.cor }}
                </div>
              </td>
              <td class="price">R$ {{ produto.preco.toFixed(2) }}</td>
              <td>
                <span class="badge" :class="badgeEstoque(produto.quantidade)">
                  {{ produto.quantidade }} un.
                </span>
              </td>
              <td class="actions">
                <span @click="editar(produto)" title="Editar">✏️</span>
                <span @click="excluir(produto.id)" title="Excluir">🗑️</span>
              </td>
            </tr>

            <tr v-if="produtosFiltrados.length === 0">
              <td colspan="7" style="text-align: center; color: #999;">
                Nenhum produto encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <!-- Modal de Edição -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal card">
      <h2>Editar Produto</h2>

      <form @submit.prevent="atualizarProduto" class="product-form">
        <label>Nome do Produto</label>
        <input type="text" v-model="formEdit.nome" />

        <div class="grid-2">
          <div>
            <label>Categoria</label>
            <select v-model="formEdit.categoria">
              <option value="Camisetas">Camisetas</option>
              <option value="Calças">Calças</option>
              <option value="Vestidos">Vestidos</option>
              <option value="Jaquetas">Jaquetas</option>
              <option value="Acessórios">Acessórios</option>
            </select>
          </div>
          <div>
            <label>Tamanho</label>
            <select v-model="formEdit.tamanho">
              <option value="P">P (Pequeno)</option>
              <option value="M">M (Médio)</option>
              <option value="G">G (Grande)</option>
              <option value="GG">GG (Extra Grande)</option>
              <option value="Único">Único</option>
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div>
            <label>Cor</label>
            <input type="text" v-model="formEdit.cor" />
          </div>
          <div>
            <label>Preço (R$)</label>
            <input type="number" v-model.number="formEdit.preco" step="0.01" min="0" />
          </div>
        </div>

        <label>Quantidade</label>
        <input type="number" v-model.number="formEdit.quantidade" min="0" />

        <div class="modal-actions">
          <button type="button" @click="showModal = false" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { produtoService, type Produto, type CadastroProduto } from '../services/produtoService'

const produtos = ref<Produto[]>([])
const isLoading = ref(false)
const erro = ref('')
const busca = ref('')
const isSubmitting = ref(false)

const form = ref<CadastroProduto>({
  nome: '',
  categoria: '',
  tamanho: '',
  cor: '',
  preco: 0,
  quantidade: 0
})

// Computed para estatísticas
const totalProdutos = computed(() => produtos.value.length)

const totalEstoque = computed(() => 
  produtos.value.reduce((total, p) => total + p.quantidade, 0)
)

const valorTotal = computed(() => 
  produtos.value.reduce((total, p) => total + (p.preco * p.quantidade), 0)
)

const totalCategorias = computed(() => 
  new Set(produtos.value.map(p => p.categoria)).size
)

// Computed para produtos filtrados
const produtosFiltrados = computed(() => {
  if (!busca.value) return produtos.value
  const termo = busca.value.toLowerCase()
  return produtos.value.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.categoria.toLowerCase().includes(termo) ||
    p.cor.toLowerCase().includes(termo)
  )
})

// Funções auxiliares
const badgeEstoque = (quantidade: number) => {
  if (quantidade <= 5) return 'badge-low'
  if (quantidade <= 15) return 'badge-medium'
  return 'badge-high'
}

const getColorCode = (colorName: string) => {
  const colorMap: Record<string, string> = {
    'Azul': '#0284c7',
    'Preto': '#000000',
    'Branco': '#f5f5f5',
    'Vermelho': '#dc2626',
    'Verde': '#16a34a',
    'Amarelo': '#eab308',
    'Rosa': '#ec4899',
    'Roxo': '#a855f7',
    'Laranja': '#fb8c00',
    'Cinza': '#6b7280',
    'Bege': '#d4a574'
  }
  return colorMap[colorName] || '#cccccc'
}

// Funções principais
const carregarProdutos = async () => {
  isLoading.value = true
  erro.value = ''

  try {
    console.log('🔄 [Produtos] Carregando produtos...')
    const response = await produtoService.listar()
    console.log('✅ [Produtos] Produtos carregados:', response.data)

    produtos.value = response.data.content || response.data || []
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao carregar produtos'
    console.error('❌ [Produtos] Erro ao carregar:', error)
  } finally {
    isLoading.value = false
  }
}

const cadastrar = async () => {
  isSubmitting.value = true
  erro.value = ''

  try {
    console.log('🔄 [Produtos] Cadastrando produto...')
    console.log('payload antes de enviar:', form.value)
    await produtoService.cadastrar(form.value)
    console.log('✅ [Produtos] Produto cadastrado com sucesso')

    // Limpar formulário
    form.value = {
      nome: '',
      categoria: '',
      tamanho: '',
      cor: '',
      preco: 0,
      quantidade: 0
    }

    // Recarregar lista
    await carregarProdutos()
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao cadastrar produto'
    console.error('❌ [Produtos] Erro ao cadastrar:', error)
  } finally {
    isSubmitting.value = false
  }
}

const showModal = ref(false)
const produtoEditando = ref<Produto | null>(null)

const formEdit = ref<CadastroProduto>({
  nome: '',
  categoria: '',
  tamanho: '',
  cor: '',
  preco: 0,
  quantidade: 0
})

const editar = (produto: Produto) => {
  produtoEditando.value = produto
  formEdit.value = {
    nome: produto.nome,
    categoria: produto.categoria,
    tamanho: produto.tamanho,
    cor: produto.cor,
    preco: produto.preco,
    quantidade: produto.quantidade
  }
  showModal.value = true
}

const atualizarProduto = async () => {
  if (!produtoEditando.value) return

  try {
    await produtoService.atualizar(produtoEditando.value.id, formEdit.value)
    showModal.value = false
    produtoEditando.value = null
    await carregarProdutos()
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao atualizar produto'
  }
}

const excluir = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return

  try {
    await produtoService.excluir(id)
    await carregarProdutos()
  } catch (error: any) {
    erro.value = error.response?.data?.message || 'Erro ao excluir produto'
  }
}

// Lifecycle
onMounted(() => {
  carregarProdutos()
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

.product-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.product-form label {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.product-form input,
.product-form select {
  width: 100%;
  border: 1px solid #d8dee7;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  background: #f8fafc;
  transition: border-color 0.2s;
}

.product-form input:focus,
.product-form select:focus {
  outline: none;
  border-color: #fb8c00;
  background: white;
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
}

.table-header input {
  width: 260px;
  padding: 12px 14px;
  border: 1px solid #d8dee7;
  border-radius: 12px;
  background: #f8fafc;
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

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-category { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
.badge-low { background: rgba(239, 68, 68, 0.12); color: #dc2626; }
.badge-medium { background: rgba(234, 179, 8, 0.12); color: #ca8a04; }
.badge-high { background: rgba(16, 185, 129, 0.12); color: #15803d; }

.color-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
}

.price {
  font-weight: 600;
  color: #1f2958;
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
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin: 0 0 20px;
  color: #1f2958;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 12px 24px;
  background: #e2e8f0;
  color: #334155;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #cbd5e1;
}

@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
}
</style>