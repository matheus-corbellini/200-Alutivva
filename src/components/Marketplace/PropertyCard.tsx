import React from "react";
import { MapPin, TrendingUp, Eye, ShoppingCart, Building2, Calendar, DollarSign, BarChart3 } from "lucide-react";
import type { Property } from "../../types/property";
import { Badge } from "./Badge";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import Button from "../Button/Button";

type PropertyCardProps = {
  property: Property;
  onReserveQuota?: (property: Property) => void;
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onReserveQuota }) => {
  const { goToPropertyDetails } = useAppNavigate();

  const handleViewDetails = () => {
    goToPropertyDetails(property.id);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateExpectedReturn = () => {
    return (property.quotaValue * (property.roi / 100));
  };

  const progressPercentage = (property.soldQuotas / property.totalQuotas) * 100;
  const availableQuotas = property.totalQuotas - property.soldQuotas;

  return (
    <div className="property-card-modern" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Header com imagem e status */}
      <div className="property-header">
        <div className="property-image-wrapper">
          <img
            src={property.image || "/logo.png"}
            alt={property.title}
            className="property-image-modern"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).onerror = null;
              e.currentTarget.src = "/logo.png";
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="property-overlay"></div>
        </div>
        <Badge status={property.status} className="property-status-modern" />
        <div className="property-type-badge">
          <Building2 size={14} />
          <span>{property.type}</span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="property-content-modern" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', padding: '12px' }}>
        {/* Título e localização */}
        <div className="property-header-info" style={{ width: '100%', maxWidth: '100%' }}>
          <h3 className="property-title-modern" style={{ 
            width: '100%', 
            maxWidth: '100%', 
            wordWrap: 'break-word', 
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            hyphens: 'auto',
            fontSize: '14px',
            lineHeight: '1.3',
            margin: '0 0 6px 0'
          }}>
            {property.title}
          </h3>
          <div className="property-location-modern" style={{ 
            width: '100%', 
            maxWidth: '100%', 
            wordWrap: 'break-word', 
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <MapPin size={14} style={{ flexShrink: 0 }} />
            <span style={{ 
              wordWrap: 'break-word', 
              overflowWrap: 'break-word',
              minWidth: 0,
              flex: 1
            }}>
              {property.location.address}
            </span>
          </div>
        </div>

        {/* Descrição */}
        <p className="property-description-modern" style={{ 
          width: '100%', 
          maxWidth: '100%', 
          wordWrap: 'break-word', 
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
          hyphens: 'auto',
          fontSize: '11px',
          lineHeight: '1.4',
          margin: '8px 0',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {property.description}
        </p>

        {/* Métricas principais */}
        <div className="property-metrics" style={{ 
          width: '100%', 
          maxWidth: '100%', 
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          margin: '8px 0'
        }}>
          <div className="metric-card" style={{ 
            width: '100%', 
            maxWidth: '100%', 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            boxSizing: 'border-box'
          }}>
            <div className="metric-icon quota-icon" style={{ flexShrink: 0, width: '24px', height: '24px' }}>
              <DollarSign size={14} />
            </div>
            <div className="metric-content" style={{ flex: 1, minWidth: 0 }}>
              <span className="metric-label" style={{ 
                display: 'block', 
                fontSize: '9px', 
                color: '#6b7280',
                wordWrap: 'break-word'
              }}>
                Valor da Cota
              </span>
              <span className="metric-value" style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: '600',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {formatCurrency(property.quotaValue)}
              </span>
            </div>
          </div>

          <div className="metric-card" style={{ 
            width: '100%', 
            maxWidth: '100%', 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            boxSizing: 'border-box'
          }}>
            <div className="metric-icon roi-icon" style={{ flexShrink: 0, width: '24px', height: '24px' }}>
              <TrendingUp size={14} />
            </div>
            <div className="metric-content" style={{ flex: 1, minWidth: 0 }}>
              <span className="metric-label" style={{ 
                display: 'block', 
                fontSize: '9px', 
                color: '#6b7280',
                wordWrap: 'break-word'
              }}>
                ROI Anual
              </span>
              <span className="metric-value roi-highlight" style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: '600',
                color: '#059669',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {property.roi}%
              </span>
            </div>
          </div>

          <div className="metric-card" style={{ 
            width: '100%', 
            maxWidth: '100%', 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            boxSizing: 'border-box'
          }}>
            <div className="metric-icon return-icon" style={{ flexShrink: 0, width: '24px', height: '24px' }}>
              <BarChart3 size={14} />
            </div>
            <div className="metric-content" style={{ flex: 1, minWidth: 0 }}>
              <span className="metric-label" style={{ 
                display: 'block', 
                fontSize: '9px', 
                color: '#6b7280',
                wordWrap: 'break-word'
              }}>
                Retorno/Ano
              </span>
              <span className="metric-value return-highlight" style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: '600',
                color: '#7c3aed',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {formatCurrency(calculateExpectedReturn())}
              </span>
            </div>
          </div>
        </div>

        {/* Resumo compacto: conclusão + progresso mini */}
        <div className="meta-summary">
          <div className="meta-left">
            <Calendar size={16} />
            <span>{new Date(property.completionDate).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="meta-right">
            <div className="mini-progress">
              <div style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <span className="mini-progress-label">{progressPercentage.toFixed(0)}%</span>
          </div>
        </div>

        {/* Progress das cotas */}
        <div className="quota-progress-section">
          <div className="quota-progress-header">
            <span className="quota-progress-title">Cotas Disponíveis</span>
            <span className="quota-progress-numbers">
              <span className="available-quota">{availableQuotas}</span>
              <span className="quota-separator">/</span>
              <span className="total-quota">{property.totalQuotas}</span>
            </span>
          </div>
          <div className="quota-progress-bar">
            <div 
              className="quota-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="quota-progress-shine"></div>
            </div>
          </div>
          <div className="quota-progress-percentage">
            {progressPercentage.toFixed(1)}% vendido
          </div>
        </div>

        {/* Ações */}
        <div className="property-actions-modern">
          <Button
            variant="secondary"
            size="large"
            className="property-btn-details"
            onClick={handleViewDetails}
          >
            <Eye size={18} />
            Ver Detalhes
          </Button>
          <Button
            variant="primary"
            size="large"
            className="property-btn-reserve"
            onClick={() => onReserveQuota?.(property)}
            disabled={availableQuotas === 0}
          >
            <ShoppingCart size={18} />
            {availableQuotas === 0 ? 'Esgotado' : 'Reservar Cota'}
          </Button>
        </div>
      </div>
    </div>
  );
};
