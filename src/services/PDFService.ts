import jsPDF from 'jspdf';

export interface PDFDocumentData {
  title: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyType: string;
  roi: number;
  quotaValue: number;
  totalQuotas: number;
  soldQuotas: number;
  completionDate: string;
  description: string;
  expectedReturn: string;
}

export class PDFService {
  static async generateInvestmentProspectus(data: PDFDocumentData): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Configurações de estilo
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let yPosition = margin;

    // Cabeçalho
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91); // Azul escuro
    pdf.text('PROSPECTO DE INVESTIMENTO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Linha separadora
    pdf.setDrawColor(26, 53, 91);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 20;

    // Título do empreendimento
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Empreendimento:', margin, yPosition);
    yPosition += 8;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.propertyTitle, margin, yPosition);
    yPosition += 15;

    // Localização
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Localização:', margin, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.propertyLocation, margin, yPosition);
    yPosition += 15;

    // Tipo de empreendimento
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Tipo:', margin, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.propertyType, margin, yPosition);
    yPosition += 15;

    // Descrição
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Descrição:', margin, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Quebra de linha para descrição longa
    const descriptionLines = pdf.splitTextToSize(data.description, contentWidth);
    pdf.text(descriptionLines, margin, yPosition);
    yPosition += (descriptionLines.length * 6) + 15;

    // Informações financeiras
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('INFORMAÇÕES FINANCEIRAS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Tabela de informações financeiras
    const financialData = [
      ['Valor da Cota', `R$ ${data.quotaValue.toLocaleString()}`],
      ['ROI Estimado', `${data.roi}% a.a.`],
      ['Retorno Esperado', data.expectedReturn],
      ['Cotas Disponíveis', `${data.totalQuotas - data.soldQuotas}/${data.totalQuotas}`],
      ['Data de Conclusão', data.completionDate]
    ];

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    financialData.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label + ':', margin, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, margin + 80, yPosition);
      yPosition += 8;
    });

    // Rodapé
    yPosition += 20;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Documento gerado automaticamente pela plataforma Alutivva', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });

    return pdf.output('blob');
  }

  static async generateQuotaContract(data: PDFDocumentData): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let yPosition = margin;

    // Cabeçalho
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('CONTRATO DE COTA', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Linha separadora
    pdf.setDrawColor(26, 53, 91);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 20;

    // Informações do contrato
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('CONTRATANTE:', margin, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Nome: _________________________________', margin, yPosition);
    yPosition += 8;
    pdf.text('CPF: _________________________________', margin, yPosition);
    yPosition += 8;
    pdf.text('Email: _________________________________', margin, yPosition);
    yPosition += 20;

    // Informações do empreendimento
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EMPREENDIMENTO:', margin, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nome: ${data.propertyTitle}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Localização: ${data.propertyLocation}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Tipo: ${data.propertyType}`, margin, yPosition);
    yPosition += 20;

    // Detalhes da cota
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DETALHES DA COTA:', margin, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Valor da Cota: R$ ${data.quotaValue.toLocaleString()}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`ROI Estimado: ${data.roi}% a.a.`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Retorno Esperado: ${data.expectedReturn}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Data de Conclusão: ${data.completionDate}`, margin, yPosition);
    yPosition += 20;

    // Cláusulas do contrato
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CLÁUSULAS DO CONTRATO:', margin, yPosition);
    yPosition += 15;

    const clauses = [
      '1. O contratante concorda em investir no empreendimento especificado acima.',
      '2. O valor da cota será pago conforme cronograma estabelecido.',
      '3. O retorno será calculado com base no ROI estimado.',
      '4. O contrato está sujeito às condições de mercado.',
      '5. Qualquer dúvida deve ser esclarecida antes da assinatura.'
    ];

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    clauses.forEach((clause) => {
      const clauseLines = pdf.splitTextToSize(clause, contentWidth);
      pdf.text(clauseLines, margin, yPosition);
      yPosition += (clauseLines.length * 5) + 5;
    });

    // Espaço para assinaturas
    yPosition += 20;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ASSINATURAS:', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Contratante: _________________________________', margin, yPosition);
    yPosition += 15;
    pdf.text('Data: _________________________________', margin, yPosition);
    yPosition += 20;

    pdf.text('Representante Legal: _________________________________', margin, yPosition);
    yPosition += 15;
    pdf.text('Data: _________________________________', margin, yPosition);

    // Rodapé
    yPosition += 20;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Documento gerado automaticamente pela plataforma Alutivva', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });

    return pdf.output('blob');
  }

  static downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Relatórios Administrativos
  static async generateSalesReport(): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Cabeçalho
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('RELATÓRIO DE VENDAS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Data do relatório
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Linha separadora
    pdf.setDrawColor(26, 53, 91);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 20;

    // Dados simulados de vendas
    const salesData = [
      ['Janeiro', 'R$ 125.000', '15', 'R$ 8.333'],
      ['Fevereiro', 'R$ 180.000', '22', 'R$ 8.182'],
      ['Março', 'R$ 210.000', '28', 'R$ 7.500'],
      ['Abril', 'R$ 195.000', '25', 'R$ 7.800'],
      ['Maio', 'R$ 240.000', '30', 'R$ 8.000'],
      ['Junho', 'R$ 275.000', '35', 'R$ 7.857']
    ];

    // Título da tabela
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Vendas Mensais - 2024', margin, yPosition);
    yPosition += 15;

    // Cabeçalho da tabela
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(26, 53, 91);
    pdf.rect(margin, yPosition - 8, pageWidth - (margin * 2), 10, 'F');
    pdf.text('Mês', margin + 5, yPosition);
    pdf.text('Vendas', margin + 50, yPosition);
    pdf.text('Cotas', margin + 100, yPosition);
    pdf.text('Ticket Médio', margin + 140, yPosition);
    yPosition += 15;

    // Dados da tabela
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.setFillColor(245, 245, 245);

    salesData.forEach((row, index) => {
      if (index % 2 === 0) {
        pdf.rect(margin, yPosition - 8, pageWidth - (margin * 2), 10, 'F');
      }
      pdf.text(row[0], margin + 5, yPosition);
      pdf.text(row[1], margin + 50, yPosition);
      pdf.text(row[2], margin + 100, yPosition);
      pdf.text(row[3], margin + 140, yPosition);
      yPosition += 12;
    });

    // Resumo
    yPosition += 15;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('RESUMO', margin, yPosition);
    yPosition += 15;

    const summaryData = [
      ['Total de Vendas', 'R$ 1.225.000'],
      ['Total de Cotas', '155'],
      ['Ticket Médio', 'R$ 7.903'],
      ['Crescimento Mensal', '+12.5%']
    ];

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    summaryData.forEach(row => {
      pdf.text(`${row[0]}: ${row[1]}`, margin, yPosition);
      yPosition += 8;
    });

    return pdf.output('blob');
  }

  static async generateUserReport(): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Cabeçalho
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('RELATÓRIO DE USUÁRIOS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Data do relatório
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Linha separadora
    pdf.setDrawColor(26, 53, 91);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 20;

    // Estatísticas de usuários
    const userStats = [
      ['Total de Usuários', '1.247'],
      ['Usuários Ativos', '892'],
      ['Novos Usuários (Mês)', '156'],
      ['Taxa de Retenção', '78.5%'],
      ['Usuários Pendentes', '23'],
      ['Usuários Bloqueados', '12']
    ];

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Estatísticas Gerais', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    userStats.forEach(row => {
      pdf.text(`${row[0]}: ${row[1]}`, margin, yPosition);
      yPosition += 8;
    });

    // Distribuição por tipo
    yPosition += 15;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('Distribuição por Tipo de Usuário', margin, yPosition);
    yPosition += 15;

    const userTypes = [
      ['Investidores', '45%', '561'],
      ['Proprietários', '30%', '374'],
      ['Empreendedores', '20%', '249'],
      ['Administradores', '5%', '63']
    ];

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    userTypes.forEach(row => {
      pdf.text(`${row[0]}: ${row[1]} (${row[2]} usuários)`, margin, yPosition);
      yPosition += 8;
    });

    return pdf.output('blob');
  }

  static async generateFinancialReport(): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Cabeçalho
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('RELATÓRIO FINANCEIRO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Data do relatório
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Linha separadora
    pdf.setDrawColor(26, 53, 91);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 20;

    // Receita
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('RECEITA', margin, yPosition);
    yPosition += 15;

    const revenueData = [
      ['Receita Bruta', 'R$ 2.450.000'],
      ['Comissões (5%)', 'R$ 122.500'],
      ['Taxas de Serviço', 'R$ 98.000'],
      ['Receita Líquida', 'R$ 2.229.500']
    ];

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    revenueData.forEach(row => {
      pdf.text(`${row[0]}: ${row[1]}`, margin, yPosition);
      yPosition += 8;
    });

    // Custos
    yPosition += 15;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('CUSTOS OPERACIONAIS', margin, yPosition);
    yPosition += 15;

    const costData = [
      ['Infraestrutura', 'R$ 45.000'],
      ['Marketing', 'R$ 85.000'],
      ['Equipe', 'R$ 320.000'],
      ['Outros', 'R$ 28.000'],
      ['Total de Custos', 'R$ 478.000']
    ];

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    costData.forEach(row => {
      pdf.text(`${row[0]}: ${row[1]}`, margin, yPosition);
      yPosition += 8;
    });

    // Lucro
    yPosition += 15;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 128, 0);
    pdf.text('LUCRO LÍQUIDO: R$ 1.751.500', margin, yPosition);

    return pdf.output('blob');
  }

  static async generateProjectReport(): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Cabeçalho
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('RELATÓRIO DE PROJETOS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Data do relatório
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Linha separadora
    pdf.setDrawColor(26, 53, 91);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 20;

    // Estatísticas de projetos
    const projectStats = [
      ['Total de Projetos', '45'],
      ['Projetos Aprovados', '32'],
      ['Projetos Pendentes', '8'],
      ['Projetos Rejeitados', '5'],
      ['Taxa de Aprovação', '71.1%']
    ];

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Estatísticas Gerais', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    projectStats.forEach(row => {
      pdf.text(`${row[0]}: ${row[1]}`, margin, yPosition);
      yPosition += 8;
    });

    // Performance por categoria
    yPosition += 15;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 53, 91);
    pdf.text('Performance por Categoria', margin, yPosition);
    yPosition += 15;

    const categoryData = [
      ['Residencial', '18 projetos', '85% aprovados'],
      ['Comercial', '12 projetos', '75% aprovados'],
      ['Misto', '8 projetos', '62% aprovados'],
      ['Industrial', '7 projetos', '71% aprovados']
    ];

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    categoryData.forEach(row => {
      pdf.text(`${row[0]}: ${row[1]} (${row[2]})`, margin, yPosition);
      yPosition += 8;
    });

    return pdf.output('blob');
  }
} 