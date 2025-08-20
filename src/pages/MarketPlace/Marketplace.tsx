import { useRef, useState } from "react";
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
import "../../components/Marketplace/styles/mobile-force.css";
import "../../components/Marketplace/styles/ultra-mobile.css";
import "./Marketplace.css";
import { createProperty } from "../../services/PropertiesService";
import { uploadImage } from "../../services/StorageService";

export default function MarketplacePage() {
  const { filters, filteredProperties, handleFilterChange, clearFilters, reload } =
    usePropertyFilters();
  const { user } = useAuth();
  const { notification, hideNotification } = useNotification();
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [reserveAmount, setReserveAmount] = useState<number>(0);
  const [isProcessingReserve] = useState(false);

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
    // A criação real da reserva acontece na página de detalhes; aqui apenas fechamos o modal
    closeReserveModal();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="marketplace-page-wrapper" style={{ minHeight: "100vh" }}>
      <div className="container marketplace-container">
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

              <div className="new-property-form" ref={formRef}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome do Empreendimento *</label>
                    <input name="title" type="text" placeholder="Ex: Residencial Vista Mar" />
                  </div>
                  <div className="form-group">
                    <label>Localização *</label>
                    <input name="address" type="text" placeholder="Ex: Barra da Tijuca, RJ" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CEP</label>
                    <input name="postalCode" type="text" placeholder="Ex: 22640-102" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descrição *</label>
                  <textarea name="description" placeholder="Descreva o empreendimento..." rows={3} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Valor da Cota (R$) *</label>
                    <input name="quotaValue" type="number" placeholder="50000" />
                  </div>
                  <div className="form-group">
                    <label>ROI Estimado (% a.a.) *</label>
                    <input name="roi" type="number" placeholder="12.5" step="0.1" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Quantidade de Cotas (total) *</label>
                    <input name="totalQuotas" type="number" placeholder="100" min="1" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status *</label>
                    <select name="status">
                      <option value="">Selecione...</option>
                      <option value="Em construção">Em Construção</option>
                      <option value="Lançamento">Lançamento</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Data de Conclusão</label>
                    <input name="completionDate" type="date" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Imagem (arquivo)</label>
                    <input name="imageFile" type="file" accept="image/*" />
                  </div>
                </div>
              </div>
            </div>

            <div className="new-property-modal-footer">
              <button className="btn btn-secondary" onClick={closeNewPropertyModal}>
                Cancelar
              </button>
              <button className="btn btn-primary" id="create-property-btn" onClick={async () => {
                if (!formRef.current) return;
                const root = formRef.current;
                const q = (sel: string) => (root.querySelector(sel) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)?.value || "";
                const title = q('input[name="title"]');
                const address = q('input[name="address"]');
                const description = q('textarea[name="description"]');
                const quotaValue = Number(q('input[name="quotaValue"]')) || 0;
                const roi = Number(q('input[name="roi"]')) || 0;
                const status = q('select[name="status"]') as any;
                const totalQuotas = Number(q('input[name="totalQuotas"]')) || 0;
                const completionDate = q('input[name="completionDate"]');
                const postalCode = q('input[name="postalCode"]').replace(/\D/g, "");
                const imageInput = root.querySelector('input[name="imageFile"]') as HTMLInputElement | null;
                const imageFile = imageInput?.files?.[0] || null;
                if (!title || !address || !description || !quotaValue || !roi || !status || !totalQuotas) return;
                try {
                  let image = "";
                  if (imageFile) {
                    try { image = await uploadImage(imageFile, "properties"); } catch { }
                  }
                  await createProperty({
                    title,
                    description,
                    type: "Hoteleiro",
                    roi,
                    quotaValue,
                    totalQuotas,
                    soldQuotas: 0,
                    status,
                    completionDate,
                    image,
                    expectedReturn: "",
                    // Salvar endereço + CEP
                    location: { address, postalCode, nearbyPlaces: [] } as any,
                    id: undefined as any,
                  });
                  closeNewPropertyModal();
                  await reload();
                } catch (e) { }
              }}>
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
