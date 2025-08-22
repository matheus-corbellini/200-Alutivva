import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../hooks/useNotification";
import { usePropertyFilters } from "../../hooks/usePropertyFilters";
import type { Property } from "../../types/property";
import { createProperty } from "../../services/PropertiesService";
import { uploadImage } from "../../services/StorageService";
import { MdClose } from "react-icons/md";
import { Footer } from "borderless";
import { HeroSection } from "../../components/Marketplace/HeroSection";
import { FiltersSection } from "../../components/Marketplace/FiltersSection";
import { PropertiesGrid } from "../../components/Marketplace/PropertiesGrid";
import { EmptyState } from "../../components/Marketplace/EmptyState";
import { ResultsSummary } from "../../components/Marketplace/ResultsSummary";
import { Notification } from "../../components/common/Notification";
import "./Marketplace.css";
import "../../components/Marketplace/styles/index.css";
import "../../components/Marketplace/styles/mobile-force.css";
import "../../components/Marketplace/styles/ultra-mobile.css";

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

  // Cleanup do modal quando componente for desmontado
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

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
    // Prevenir scroll do body
    document.body.classList.add('modal-open');
  };

  const closeReserveModal = () => {
    setShowReserveModal(false);
    setSelectedProperty(null);
    setReserveAmount(0);
    // Restaurar scroll do body
    document.body.classList.remove('modal-open');
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

      {/* Modal Futurista de Reserva */}
      {showReserveModal && selectedProperty && (
        <div className="futuristic-modal-overlay" onClick={closeReserveModal}>
          <div className="futuristic-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header com gradiente */}
            <div className="futuristic-header">
              <div className="header-gradient"></div>
              <div className="header-content">
                <h2>
                  <span className="reserve-icon">🚀</span>
                  Reservar Cota
                </h2>
                <button className="futuristic-close" onClick={closeReserveModal}>
                  <span className="close-icon">✕</span>
                </button>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="futuristic-content">
              {/* Card da propriedade */}
              <div className="property-card-futuristic">
                <div className="property-image-container">
                  <img 
                    src={selectedProperty.image || "/logo.png"} 
                    alt={selectedProperty.title}
                    onError={(e) => {
                      e.currentTarget.src = "/logo.png";
                    }}
                  />
                  <div className="image-overlay"></div>
                  <div className="status-badge-futuristic">
                    <span className="status-dot"></span>
                    {selectedProperty.status}
                  </div>
                </div>
                
                <div className="property-details">
                  <h3 className="property-title-futuristic">{selectedProperty.title}</h3>
                  <div className="property-location-futuristic">
                    <span className="location-icon">📍</span>
                    {selectedProperty.location.address}
                  </div>
                </div>
              </div>

              {/* Métricas em grid */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">💰</div>
                  <div className="metric-content">
                    <span className="metric-label">Valor da Cota</span>
                    <span className="metric-value">{formatCurrency(selectedProperty.quotaValue)}</span>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">📈</div>
                  <div className="metric-content">
                    <span className="metric-label">ROI Estimado</span>
                    <span className="metric-value">{selectedProperty.roi}% a.a.</span>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">🎯</div>
                  <div className="metric-content">
                    <span className="metric-label">Disponíveis</span>
                    <span className="metric-value">
                      {selectedProperty.totalQuotas - selectedProperty.soldQuotas} de {selectedProperty.totalQuotas}
                    </span>
                  </div>
                </div>
              </div>

              {/* Descrição com efeito glassmorphism */}
              <div className="description-card">
                <h4>
                  <span className="section-icon">📋</span>
                  Sobre o Projeto
                </h4>
                <p>{selectedProperty.description}</p>
              </div>

              {/* Formulário futurista */}
              <div className="investment-form">
                <h4>
                  <span className="section-icon">⚡</span>
                  Configure seu Investimento
                </h4>
                
                <div className="form-row">
                  <div className="input-group">
                    <label className="futuristic-label">Quantidade de Cotas</label>
                    <div className="input-container">
                      <input
                        type="number"
                        min="1"
                        max={selectedProperty.totalQuotas - selectedProperty.soldQuotas}
                        value={Math.max(1, Math.floor(reserveAmount / selectedProperty.quotaValue))}
                        onChange={(e) => {
                          const quantity = Math.max(1, parseInt(e.target.value) || 1);
                          setReserveAmount(quantity * selectedProperty.quotaValue);
                        }}
                        className="futuristic-input"
                      />
                      <div className="input-highlight"></div>
                    </div>
                  </div>
                </div>

                {/* Total com efeito neon */}
                <div className="total-container">
                  <div className="total-card">
                    <span className="total-label">Investimento Total</span>
                    <span className="total-value-neon">{formatCurrency(reserveAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Botões dentro do conteúdo scrollável */}
              <div className="futuristic-buttons-container">
                <button className="btn-futuristic btn-cancel" onClick={closeReserveModal}>
                  <span className="btn-icon">❌</span>
                  Cancelar
                  <div className="btn-ripple"></div>
                </button>
                
                <button 
                  className="btn-futuristic btn-primary" 
                  onClick={handleConfirmReserve}
                  disabled={isProcessingReserve}
                >
                  <span className="btn-icon">🚀</span>
                  {isProcessingReserve ? (
                    <>
                      <span className="loading-spinner"></span>
                      Processando...
                    </>
                  ) : (
                    'Confirmar Reserva'
                  )}
                  <div className="btn-ripple"></div>
                </button>
              </div>
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
