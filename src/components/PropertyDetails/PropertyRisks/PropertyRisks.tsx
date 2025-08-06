import React from "react";
import "./PropertyRisks.css";

type RiskProps = {
  risks: {
    level: "baixo" | "médio" | "alto";
    title: string;
    description: string;
  }[];
};

const PropertyRisks: React.FC<RiskProps> = ({ risks }) => {
  // Verificar se risks existe e é um array
  if (!risks || !Array.isArray(risks)) {
    return (
      <section className="property-risks">
        <h2 className="section-title">Análise de Riscos</h2>
        <div className="risks-grid">
          <div className="risk-item">
            <span className="risk-level baixo">Baixo</span>
            <div className="risk-content">
              <div className="risk-title">Nenhum risco identificado</div>
              <div className="risk-description">Não há riscos significativos para este empreendimento.</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="property-risks">
      <h2 className="section-title">Análise de Riscos</h2>
      <div className="risks-grid">
        {risks.map((risk, index) => (
          <div key={index} className="risk-item">
            <span className={`risk-level ${risk.level || 'baixo'}`}>
              {(risk.level || 'baixo').charAt(0).toUpperCase() + (risk.level || 'baixo').slice(1)}
            </span>
            <div className="risk-content">
              <div className="risk-title">{risk.title || 'Risco não especificado'}</div>
              <div className="risk-description">{risk.description || 'Descrição não disponível'}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyRisks;
