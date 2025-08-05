import { usePropertyFilters } from "../../hooks/usePropertyFilters";
import { useState } from "react";
import {
  HeroSection,
  FiltersSection,
  ResultsSummary,
  PropertiesGrid,
  EmptyState,
} from "../../components/Marketplace";
import { Footer } from "borderless";
import { MdClose } from "react-icons/md";

import "../../components/Marketplace/styles/index.css";
import "./Marketplace.css";

export default function MarketplacePage() {
  const { filters, filteredProperties, handleFilterChange, clearFilters } =
    usePropertyFilters();
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false);

  const handleAddProperty = () => {
    setShowNewPropertyModal(true);
  };

  const closeNewPropertyModal = () => {
    setShowNewPropertyModal(false);
  };

  return (
    <div className="marketplace-page-wrapper" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ marginTop: "32px", flex: 1 }}>
        <HeroSection
          title="Invista em Imóveis com Segurança"
          description="Diversifique seus investimentos com cotas de empreendimentos imobiliários selecionados. Rentabilidade atrativa e transparência total."
          onAddProperty={handleAddProperty}
        />

        <FiltersSection
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <ResultsSummary count={filteredProperties.length} />

        {filteredProperties.length > 0 ? (
          <PropertiesGrid properties={filteredProperties} />
        ) : (
          <EmptyState onClearFilters={clearFilters} />
        )}
      </div>

      {/* New Property Modal */}
      {showNewPropertyModal && (
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

      <Footer
        theme="light"
        useGradient={false}
        backgroundColor="transparent"
        logoVariant="light"
      />
    </div>
  );
}
