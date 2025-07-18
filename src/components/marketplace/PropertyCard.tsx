import React from "react";
import { MapPin, TrendingUp, Clock } from "lucide-react";
import type { Property } from "../../types/property";
import { Badge } from "./Badge";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import Button from "../Button/Button";

type PropertyCardProps = {
  property: Property;
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { goToProperty } = useAppNavigate();

  const handleViewDetails = () => {
    goToProperty(property.id);
  };

  return (
    <div className="card property-card">
      <div className="property-image-container">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="property-image"
        />
        <Badge status={property.status} className="property-status-badge" />
      </div>

      <div className="card-content">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-location">
          <MapPin className="icon mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        <p className="property-description">{property.description}</p>
        <div className="property-details">
          <div className="property-detail-row">
            <span className="property-detail-label">Valor da Cota:</span>
            <span className="property-detail-value">
              R$ {property.quotaValue.toLocaleString()}
            </span>
          </div>
          <div className="property-detail-row">
            <span className="property-detail-label">ROI Estimado:</span>
            <div className="roi-value">
              <TrendingUp className="icon mr-1" />
              {property.roi}% a.a.
            </div>
          </div>
          <div className="property-detail-row">
            <span className="property-detail-label">Retorno Esperado:</span>
            <span className="expected-return">{property.expectedReturn}</span>
          </div>
          <div className="property-detail-row">
            <span className="property-detail-label">Conclusão:</span>
            <div className="completion-date">
              <Clock className="icon mr-1" />
              <span className="text-sm">{property.completionDate}</span>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-label">
              <span className="progress-label-left">Cotas vendidas:</span>
              <span>
                {property.soldQuotas}/{property.totalQuotas}
              </span>
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${
                    (property.soldQuotas / property.totalQuotas) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="property-actions">
          <Button
            variant="primary"
            size="large"
            className="btn-full property-action-btn"
            onClick={handleViewDetails}
          >
            Ver Detalhes
          </Button>
          <Button
            variant="secondary"
            size="large"
            className="btn-full property-action-btn"
          >
            Reservar Cota
          </Button>
        </div>
      </div>
    </div>
  );
};
