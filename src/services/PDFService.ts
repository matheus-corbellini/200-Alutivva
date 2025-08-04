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
} 