import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface RelatorioPDF {
  inicio: string
  fim: string
  totalVendido: number
  faturamentoTotal: number
  labels: string[]
  values: number[]
  grafico?: string
}

export function gerarRelatorioPDF({
  inicio,
  fim,
  totalVendido,
  faturamentoTotal,
  labels,
  values,
  grafico
}: RelatorioPDF) {

  const doc = new jsPDF()

  // ===== TÍTULO =====
  doc.setFontSize(18)
  doc.text('Relatório de Vendas', 14, 20)

  // ===== INFORMAÇÕES =====
  doc.setFontSize(11)

  doc.text(
    `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`,
    14,
    30
  )

  doc.text(
    `Período: ${inicio} até ${fim}`,
    14,
    38
  )

  // ===== RESUMO =====
  doc.setFontSize(14)
  doc.text('Resumo', 14, 52)

  doc.setFontSize(12)

  doc.text(
    `Total de vendas: ${totalVendido}`,
    14,
    62
  )

  doc.text(
    `Faturamento total: R$ ${faturamentoTotal.toFixed(2)}`,
    14,
    72
  )

  // ===== GRÁFICO =====
  if (grafico) {

    doc.setFontSize(14)
    doc.text('Gráfico', 14, 90)

    doc.addImage(
      grafico,
      'PNG',
      10,
      100,
      190,
      90
    )
  }

  // ===== RODAPÉ =====
  doc.setFontSize(10)

  doc.text(
    'Relatório gerado automaticamente pelo sistema.',
    14,
    285
  )

  // ===== SALVAR =====
  doc.save('relatorio.pdf')
}