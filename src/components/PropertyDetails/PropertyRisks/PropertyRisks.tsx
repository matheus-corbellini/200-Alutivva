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
  return (
    <section className="property-risks">
      <h2 className="section-title">Análise de Riscos</h2>
      <div className="risks-grid">
        {risks.map((risk, index) => (
          <div key={index} className="risk-item">
            <span className={`risk-level ${risk.level}`}>
              {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
            </span>
            <div className="risk-content">
              <div className="risk-title">{risk.title}</div>
              <div className="risk-description">{risk.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyRisks;
