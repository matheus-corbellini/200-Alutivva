import { useState } from "react";
import {
  HeroSection,
  FiltersSection,
  PropertiesGrid,
  ResultsSummary,
  EmptyState,
} from "../../components/Marketplace";
import { usePropertyFilters } from "../../hooks/usePropertyFilters";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../hooks/useNotification";
import { Footer } from "borderless";
import { MdClose } from "react-icons/md";
import type { Property } from "../../types/property";
import { Notification } from "../../components/common/Notification";
import "../../components/Marketplace/styles/index.css";
import "./Marketplace.css";

export default function MarketplacePage() {
  const { filters, filteredProperties, handleFilterChange, clearFilters } =
    usePropertyFilters();
  const { user } = useAuth();
  const { notification, showNotification, hideNotification } = useNotification();
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [reserveAmount, setReserveAmount] = useState<number>(0);
  const [isProcessingReserve, setIsProcessingReserve] = useState(false);

  const handleAddProperty = () => {
    // Investidores não podem adicionar empreendimentos
    if (user?.role === "investor") {
      return;
    }
    setShowNewPropertyModal(true);
  };

  const closeNewPropertyModal = () => {
    setShowNewPropertyModal(false);
  };

  const handleReserveQuota = (property: Property) => {
    setSelectedProperty(property);
    setReserveAmount(property.quotaValue);
    setShowReserveModal(true);
  };

  const closeReserveModal = () => {
    setShowReserveModal(false);
    setSelectedProperty(null);
    setReserveAmount(0);
  };

  const handleConfirmReserve = () => {
    // Aqui você implementaria a lógica de reserva
    console.log('Reservando cota:', selectedProperty?.title, 'Valor:', reserveAmount);

    setIsProcessingReserve(true);

    // Simular processamento da reserva com possibilidade de erro
    const isSuccess = Math.random() > 0.1; // 90% de chance de sucesso

    setTimeout(() => {
      setIsProcessingReserve(false);
      closeReserveModal();

      if (isSuccess) {
        // Mostrar notificação de sucesso
        showNotification(
          'success',
          'Reserva Confirmada!',
          `Sua reserva de ${formatCurrency(reserveAmount)} para "${selectedProperty?.title}" foi realizada com sucesso.`
        );
      } else {
        // Mostrar notificação de erro
        showNotification(
          'error',
          'Erro na Reserva',
          'Não foi possível processar sua reserva. Tente novamente em alguns instantes.'
        );
      }
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="marketplace-page-wrapper" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ marginTop: "32px", flex: 1 }}>
        <HeroSection
          title="Invista em Imóveis com Segurança"
          description="Diversifique seus investimentos com cotas de empreendimentos imobiliários selecionados. Rentabilidade atrativa e transparência total."
          onAddProperty={user?.role !== "investor" ? handleAddProperty : undefined}
        />

        <FiltersSection
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <ResultsSummary count={filteredProperties.length} />

        {filteredProperties.length > 0 ? (
          <PropertiesGrid
            properties={filteredProperties}
            onReserveQuota={handleReserveQuota}
          />
        ) : (
          <EmptyState onClearFilters={clearFilters} />
        )}
      </div>

      {/* New Property Modal */}
      {showNewPropertyModal && user?.role !== "investor" && (
        <div className="new-property-modal-overlay" onClick={closeNewPropertyModal}>
          <div className="new-property-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="new-property-modal-header">
              <h2>Criar Novo Empreendimento</h2>
              <button
                className="new-property-modal-close"
                onClick={closeNewPropertyModal}
                aria-label="Fechar modal"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="new-property-modal-body">
              <p className="new-property-description">
                Preencha os dados do novo empreendimento para adicioná-lo ao marketplace.
              </p>

              <div className="new-property-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome do Empreendimento *</label>
                    <input type="text" placeholder="Ex: Residencial Vista Mar" />
                  </div>
                  <div className="form-group">
                    <label>Localização *</label>
                    <input type="text" placeholder="Ex: Barra da Tijuca, RJ" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descrição *</label>
                  <textarea placeholder="Descreva o empreendimento..." rows={3} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Valor da Cota (R$) *</label>
                    <input type="number" placeholder="50000" />
                  </div>
                  <div className="form-group">
                    <label>ROI Estimado (% a.a.) *</label>
                    <input type="number" placeholder="12.5" step="0.1" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status *</label>
                    <select>
                      <option value="">Selecione...</option>
                      <option value="em-construcao">Em Construção</option>
                      <option value="lancamento">Lançamento</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Data de Conclusão</label>
                    <input type="date" />
                  </div>
                </div>
              </div>
            </div>

            <div className="new-property-modal-footer">
              <button className="btn btn-secondary" onClick={closeNewPropertyModal}>
                Cancelar
              </button>
              <button className="btn btn-primary">
                Criar Empreendimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reserve Quota Modal */}
      {showReserveModal && selectedProperty && (
        <div className="modal-overlay" onClick={closeReserveModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reservar Cota</h2>
              <button className="modal-close" onClick={closeReserveModal}>
                <MdClose size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="investment-detail-image">
                <img src={selectedProperty.image} alt={selectedProperty.title} />
                <div className="investment-detail-status">
                  <span className={`status-badge ${selectedProperty.status.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                    {selectedProperty.status}
                  </span>
                </div>
              </div>

              <div className="investment-detail-info">
                <h3>{selectedProperty.title}</h3>
                <p className="investment-detail-location">{selectedProperty.location.address}</p>

                <div className="investment-detail-stats">
                  <div className="detail-stat">
                    <span className="stat-label">Valor da Cota</span>
                    <span className="stat-value">{formatCurrency(selectedProperty.quotaValue)}</span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">ROI Estimado</span>
                    <span className="stat-value">{selectedProperty.roi}% a.a.</span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">Retorno Esperado</span>
                    <span className="stat-value">{formatCurrency(selectedProperty.quotaValue * (selectedProperty.roi / 100))}/ano</span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">Cotas Disponíveis</span>
                    <span className="stat-value">{selectedProperty.totalQuotas - selectedProperty.soldQuotas} de {selectedProperty.totalQuotas}</span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">Data de Conclusão</span>
                    <span className="stat-value">{selectedProperty.completionDate}</span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">Progresso de Vendas</span>
                    <span className="stat-value">{Math.round((selectedProperty.soldQuotas / selectedProperty.totalQuotas) * 100)}%</span>
                  </div>
                </div>

                <div className="investment-detail-description">
                  <h4>Descrição do Projeto</h4>
                  <p>{selectedProperty.description}</p>
                </div>

                <div className="reserve-form">
                  <h4>Dados da Reserva</h4>
                  <div className="form-group">
                    <label>Quantidade de Cotas</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedProperty.totalQuotas - selectedProperty.soldQuotas}
                      value={reserveAmount / selectedProperty.quotaValue}
                      onChange={(e) => setReserveAmount(Number(e.target.value) * selectedProperty.quotaValue)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Valor Total</label>
                    <input
                      type="text"
                      value={formatCurrency(reserveAmount)}
                      readOnly
                      className="form-input readonly"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={closeReserveModal}
                disabled={isProcessingReserve}
              >
                Cancelar
              </button>
              <button
                className={`btn-primary ${isProcessingReserve ? 'loading' : ''}`}
                onClick={handleConfirmReserve}
                disabled={isProcessingReserve}
              >
                {isProcessingReserve ? 'Processando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer
        theme="light"
        useGradient={false}
        backgroundColor="transparent"
        logoVariant="light"
      />

      {/* Notification Component */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={6000}
      />
    </div>
  );
}
