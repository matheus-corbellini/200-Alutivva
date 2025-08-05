import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { mockPropertyDetails } from "../../data/mockPropertyDetails";
import PropertyDetailsHeader from "../../components/PropertyDetails/PropertyDetailsHeader/PropertyDetailsHeader";
import PropertyAmenities from "../../components/PropertyDetails/PropertyAmenities/PropertyAmenities";
import PropertyLocation from "../../components/PropertyDetails/PropertyLocation/PropertyLocation";
import PropertyDeveloper from "../../components/PropertyDetails/PropertyDeveloper/PropertyDeveloper";
import PropertyRisks from "../../components/PropertyDetails/PropertyRisks/PropertyRisks";
import PropertyDocuments from "../../components/PropertyDetails/PropertyDocuments/PropertyDocuments";
import PropertyGallery from "../../components/PropertyDetails/PropertyGallery/PropertyGallery";
import PropertyFinancialProjection from "../../components/PropertyDetails/PropertyFinancialProjection/PropertyFinancialProjection";
import PropertyFloorPlans from "../../components/PropertyDetails/PropertyFloorPlans/PropertyFloorPlans";
import PropertyHero from "../../components/PropertyDetails/PropertyHero/PropertyHero";
import PropertyMilestones from "../../components/PropertyDetails/PropertyMilestones/PropertyMilestones";
import PropertyVideos from "../../components/PropertyDetails/PropertyVideos/PropertyVideos";
import InvestmentSimulationModal from "../../components/PropertyDetails/InvestmentSimulationModal/InvestmentSimulationModal";
import Button from "../../components/Button/Button";
import "./PropertyDetails.css";
import { formatCurrency } from "../../utils/currency";
import { Footer } from "borderless";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);

  const propertyId = Number.parseInt(id || "1");
  const property = propertyId === 0 ? null : mockPropertyDetails[propertyId];

  const handleReserve = () => {
    setIsLoading(true);
    // Simula uma ação de reserva
    setTimeout(() => {
      alert("Reserva realizada com sucesso! Entraremos em contato em breve.");
      setIsLoading(false);
    }, 1500);
  };

  const handleSimulate = () => {
    setShowSimulationModal(true);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleVideoModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeVideoModal();
    }
  };

  // 404 Not Found
  if (!property && propertyId !== 0) {
    return (
      <div className="property-details-container">
        <PropertyDetailsHeader />
        <div className="property-details-content">
          <div className="not-found-section">
            <div className="not-found-content">
              <h1>Oops! Propriedade não encontrada</h1>
              <p>
                A propriedade que você está procurando não existe ou foi
                removida.
              </p>
              <p>
                Que tal explorar outras oportunidades de investimento no nosso
                marketplace?
              </p>
              <div className="not-found-actions">
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => window.location.href = "/marketplace"}
                >
                  Explorar Marketplace
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="property-details-page-wrapper">
      <div className="property-details-container">
        <PropertyDetailsHeader />

        <div className="property-details-content">
          {/* Hero Section - Always present */}
          <PropertyHero
            property={property || undefined}
            formatCurrency={formatCurrency}
            onReserve={handleReserve}
            onSimulate={handleSimulate}
          />

          {/* Gallery - Only if has images */}
          {property?.gallery && property.gallery.length > 0 && (
            <PropertyGallery gallery={property.gallery} title={property.title} />
          )}

          {/* Videos - Only if has videos */}
          {property?.videos && property.videos.length > 0 && (
            <PropertyVideos
              videos={property.videos}
              onSelectVideo={setSelectedVideo}
            />
          )}

          {/* Floor Plans - Only if has floor plans */}
          {property?.floorPlans && property.floorPlans.length > 0 && (
            <PropertyFloorPlans floorPlans={property.floorPlans} />
          )}

          {/* Financial Projection - Always present */}
          {property && (
            <PropertyFinancialProjection
              financialProjection={property.financialProjection}
              formatCurrency={formatCurrency}
            />
          )}

          {/* Milestones - Only if has milestones */}
          {property?.milestones && property.milestones.length > 0 && (
            <PropertyMilestones milestones={property.milestones} />
          )}

          {/* Documents - Only if has documents */}
          {property?.documents && property.documents.length > 0 && (
            <PropertyDocuments
              documents={property.documents}
              propertyData={{
                title: property.title,
                propertyTitle: property.title,
                propertyLocation: property.location.address,
                propertyType: property.type,
                roi: property.roi,
                quotaValue: property.quotaValue,
                totalQuotas: property.totalQuotas,
                soldQuotas: property.soldQuotas,
                completionDate: property.completionDate,
                description: property.description,
                expectedReturn: property.expectedReturn
              }}
            />
          )}

          {/* Amenities - Only if has amenities */}
          {property?.amenities && property.amenities.length > 0 && (
            <PropertyAmenities amenities={property.amenities} />
          )}

          {/* Location - Always present */}
          {property && <PropertyLocation location={property.location} />}

          {/* Developer - Always present */}
          {property && <PropertyDeveloper developer={property.developer} />}

          {/* Risks - Only if has risks */}
          {property?.risks && property.risks.length > 0 && (
            <PropertyRisks risks={property.risks} />
          )}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="video-modal-overlay"
            onClick={closeVideoModal}
            onKeyDown={handleVideoModalKeyDown}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Player de vídeo"
          >
            <div
              className="video-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="video-modal-close"
                onClick={closeVideoModal}
                aria-label="Fechar vídeo"
              >
                ×
              </button>
              <iframe
                src={selectedVideo}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="Vídeo da propriedade"
              />
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Processando sua reserva...</p>
            </div>
          </div>
        )}

        {/* Investment Simulation Modal */}
        {property && (
          <InvestmentSimulationModal
            isOpen={showSimulationModal}
            onClose={() => setShowSimulationModal(false)}
            property={property}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
      <Footer
        theme="light"
        useGradient={false}
        backgroundColor="transparent"
        logoVariant="light"
      />
    </div>
  );
}