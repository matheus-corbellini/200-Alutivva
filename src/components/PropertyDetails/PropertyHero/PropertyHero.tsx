import React from "react";
import "./PropertyHero.css";
import type { PropertyDetails } from "../../../types/propertyDetails";
import Button from "../../Button/Button";
import { Badge } from "../../Marketplace";
import { MdLocationOn } from "react-icons/md";

type PropertyHeroProps = {
  property: PropertyDetails;
  formatCurrency: (value: number) => string;
  onReserve: () => void;
  onSimulate: () => void;
};

const PropertyHero: React.FC<PropertyHeroProps> = ({
  property,
  formatCurrency,
  onReserve,
  onSimulate,
}) => {
  return (
    <section className="property-hero">
      <div className="property-hero-content">
        <div className="property-hero-info">
          <h1>{property.title}</h1>
          <div className="property-hero-location">
            <MdLocationOn />
            <span>
              {typeof property.location === "string"
                ? property.location
                : property.location.address}
            </span>
            <Badge status={property.status} />
          </div>
          <p className="property-hero-description">{property.description}</p>

          <div className="property-hero-stats">
            <div className="stat-item">
              <span className="stat-value">{property.roi}%</span>
              <span className="stat-label">ROI Anual</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {property.soldQuotas}/{property.totalQuotas}
              </span>
              <span className="stat-label">Cotas Vendidas</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {formatCurrency(property.quotaValue)}
              </span>
              <span className="stat-label">Valor da Cota</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{property.completionDate}</span>
              <span className="stat-label">Conclusão</span>
            </div>
          </div>
        </div>

        <div className="property-hero-sidebar">
          <div className="investment-summary">
            <h3>Resumo do Investimento</h3>
            <div className="investment-details">
              <div className="investment-item">
                <span className="investment-label">Valor do Investimento:</span>
                <span className="investment-value">
                  {formatCurrency(property.financialProjection.investmentValue)}
                </span>
              </div>
              <div className="investment-item">
                <span className="investment-label">Retorno Mensal:</span>
                <span className="investment-value">
                  {formatCurrency(property.financialProjection.monthlyReturn)}
                </span>
              </div>
              <div className="investment-item">
                <span className="investment-label">Retorno Anual:</span>
                <span className="investment-value">
                  {formatCurrency(property.financialProjection.annualReturn)}
                </span>
              </div>
              <div className="investment-item">
                <span className="investment-label">Payback:</span>
                <span className="investment-value">
                  {property.financialProjection.paybackPeriod} meses
                </span>
              </div>
            </div>
            <div className="cta-buttons">
              <Button variant="primary" size="large" onClick={onReserve}>
                Reservar Cota
              </Button>
              <Button variant="secondary" size="large" onClick={onSimulate}>
                Simular Investimento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyHero;
