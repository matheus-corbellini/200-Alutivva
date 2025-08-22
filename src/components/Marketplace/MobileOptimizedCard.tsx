import React from "react";
import type { Property } from "../../types/property";
import { MapPin, DollarSign, TrendingUp, BarChart3, Eye, ShoppingCart } from "lucide-react";
import { useAppNavigate } from "../../hooks/useAppNavigate";

type MobileOptimizedCardProps = {
  property: Property;
  onReserveQuota?: (property: Property) => void;
};

export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({ 
  property, 
  onReserveQuota 
}) => {
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

  // Estilos inline forçados para garantir responsividade
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    margin: '0 0 1rem 0',
    padding: 0,
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    display: 'block',
    position: 'relative'
  };

  const contentStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    padding: '0.75rem',
    boxSizing: 'border-box',
    display: 'block'
  };

  const titleStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.3,
    margin: '0 0 0.5rem 0',
    color: '#1a202c',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    hyphens: 'auto',
    display: 'block'
  };

  const descriptionStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    fontSize: '0.75rem',
    lineHeight: 1.4,
    margin: '0 0 0.5rem 0',
    color: '#64748b',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    hyphens: 'auto',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const locationStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    fontSize: '0.75rem',
    color: '#64748b',
    margin: '0 0 0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    wordWrap: 'break-word',
    overflowWrap: 'break-word'
  };

  const metricCardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    boxSizing: 'border-box'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    padding: '0.75rem',
    marginBottom: '0.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  };

  return (
    <div style={containerStyle}>
      {/* Imagem Header */}
      <div style={{ 
        width: '100%', 
        height: '120px', 
        overflow: 'hidden', 
        position: 'relative',
        backgroundColor: '#f3f4f6'
      }}>
        <img
          src={property.image || "/logo.png"}
          alt={property.title}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).onerror = null;
            e.currentTarget.src = "/logo.png";
          }}
        />
        
        {/* Status Badge */}
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          left: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.5rem',
          fontSize: '0.625rem',
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          {property.status}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={contentStyle}>
        {/* Título */}
        <h3 style={titleStyle}>
          {property.title}
        </h3>

        {/* Localização */}
        <div style={locationStyle}>
          <MapPin size={12} style={{ flexShrink: 0 }} />
          <span style={{ 
            wordWrap: 'break-word', 
            overflowWrap: 'break-word',
            minWidth: 0,
            flex: 1
          }}>
            {property.location.address}
          </span>
        </div>

        {/* Descrição */}
        <p style={descriptionStyle}>
          {property.description}
        </p>

        {/* Métricas */}
        <div style={{ width: '100%', margin: '0.5rem 0' }}>
          <div style={metricCardStyle}>
            <DollarSign size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                Valor da Cota
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600,
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {formatCurrency(property.quotaValue)}
              </div>
            </div>
          </div>

          <div style={metricCardStyle}>
            <TrendingUp size={16} style={{ color: '#059669', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                ROI Anual
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600,
                color: '#059669',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {property.roi}%
              </div>
            </div>
          </div>

          <div style={metricCardStyle}>
            <BarChart3 size={16} style={{ color: '#7c3aed', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                Retorno/Ano
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600,
                color: '#7c3aed',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {formatCurrency(calculateExpectedReturn())}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          padding: '0.5rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '0.5rem',
          margin: '0.5rem 0',
          border: '1px solid #bae6fd'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.25rem'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0369a1' }}>
              Cotas Disponíveis
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {availableQuotas}/{property.totalQuotas}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '2px'
            }} />
          </div>
        </div>

        {/* Botões */}
        <div style={{ width: '100%', marginTop: '0.75rem' }}>
          <button
            onClick={handleViewDetails}
            style={{
              ...buttonStyle,
              backgroundColor: '#f8fafc',
              color: '#475569',
              border: '1px solid #e2e8f0'
            }}
          >
            <Eye size={16} />
            Ver Detalhes
          </button>
          
          <button
            onClick={() => onReserveQuota?.(property)}
            disabled={availableQuotas === 0}
            style={{
              ...buttonStyle,
              backgroundColor: availableQuotas === 0 ? '#9ca3af' : '#1c4f52',
              color: 'white',
              marginBottom: 0
            }}
          >
            <ShoppingCart size={16} />
            {availableQuotas === 0 ? 'Esgotado' : 'Reservar Cota'}
          </button>
        </div>
      </div>
    </div>
  );
};
