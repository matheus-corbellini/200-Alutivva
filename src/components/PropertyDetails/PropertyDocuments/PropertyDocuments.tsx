import React, { useState } from "react";
import "./PropertyDocuments.css";
import { MdFileDownload } from "react-icons/md";
import { PDFService, type PDFDocumentData } from "../../../services/PDFService";

type PropertyDocumentsProps = {
  documents: {
    title: string;
    type: string;
    size: string;
    url: string;
    category: string;
  }[];
  propertyData?: PDFDocumentData;
};

const PropertyDocuments: React.FC<PropertyDocumentsProps> = ({ documents, propertyData }) => {
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

  const handleGeneratePDF = async (documentType: 'prospectus' | 'contract') => {
    if (!propertyData) {
      alert('Dados do imóvel não disponíveis para gerar o PDF');
      return;
    }

    setGeneratingPDF(documentType);

    try {
      let blob: Blob;
      let filename: string;

      if (documentType === 'prospectus') {
        blob = await PDFService.generateInvestmentProspectus(propertyData);
        filename = `Prospecto_${propertyData.propertyTitle.replace(/\s+/g, '_')}.pdf`;
      } else {
        blob = await PDFService.generateQuotaContract(propertyData);
        filename = `Contrato_${propertyData.propertyTitle.replace(/\s+/g, '_')}.pdf`;
      }

      PDFService.downloadPDF(blob, filename);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setGeneratingPDF(null);
    }
  };

  const handleDownloadDocument = (document: any) => {
    // Simula o download de um documento existente
    const link = document.createElement('a');
    link.href = document.url || '#';
    link.download = `${document.title}.pdf`;
    link.target = '_blank';
    
    // Se não houver URL real, simula o download
    if (document.url === '#') {
      alert(`Download iniciado: ${document.title}`);
      return;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="property-documents">
      <h2 className="section-title">Documentos</h2>
      <div className="documents-grid">
        {documents.map((doc, index) => (
          <div key={index} className="document-item">
            <div className="document-icon">{doc.type}</div>
            <div className="document-info">
              <div className="document-title">{doc.title}</div>
              <div className="document-meta">
                {" "}
                {doc.type} • {doc.size}
              </div>
            </div>
            <div className="document-actions">
              {doc.title.toLowerCase().includes('prospecto') && (
                <button
                  className="document-generate"
                  onClick={() => handleGeneratePDF('prospectus')}
                  disabled={generatingPDF === 'prospectus'}
                  title="Gerar novo prospecto"
                >
                  <MdFileDownload />
                  {generatingPDF === 'prospectus' && <span className="loading-text">Gerando...</span>}
                </button>
              )}
              {doc.title.toLowerCase().includes('contrato') && (
                <button
                  className="document-generate"
                  onClick={() => handleGeneratePDF('contract')}
                  disabled={generatingPDF === 'contract'}
                  title="Gerar novo contrato"
                >
                  <MdFileDownload />
                  {generatingPDF === 'contract' && <span className="loading-text">Gerando...</span>}
                </button>
              )}
              {!doc.title.toLowerCase().includes('prospecto') && !doc.title.toLowerCase().includes('contrato') && (
                <button
                  className="document-download"
                  onClick={() => handleDownloadDocument(doc)}
                  title={`Baixar ${doc.title}`}
                >
                  <MdFileDownload />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyDocuments;
