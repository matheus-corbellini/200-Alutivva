import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppNavigate } from "../../hooks/useAppNavigate";
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
import Button from "../../components/Button/Button";
import "./PropertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { goToMarketplace } = useAppNavigate();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const propertyId = Number.parseInt(id || "1");
  const property = mockPropertyDetails[propertyId];

  // 404 Not Found
  if (!property) {
    return (
      <div className="property-details-container">
        <PropertyDetailsHeader onBack={goToMarketplace} />
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
                  onClick={goToMarketplace}
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const handleReserve = () => {
    setIsLoading(true);
    // Simula uma ação de reserva
    setTimeout(() => {
      alert("Reserva realizada com sucesso! Entraremos em contato em breve.");
      setIsLoading(false);
    }, 1500);
  };

  const handleSimulate = () => {
    alert("Em breve você será redirecionado para o simulador de investimento.");
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleVideoModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeVideoModal();
    }
  };

  return (
    <div className="property-details-container">
      <PropertyDetailsHeader onBack={goToMarketplace} />

      <div className="property-details-content">
        {/* Hero Section - Always present */}
        <PropertyHero
          property={property}
          formatCurrency={formatCurrency}
          onReserve={handleReserve}
          onSimulate={handleSimulate}
        />

        {/* Gallery - Only if has images */}
        {property.gallery && property.gallery.length > 0 && (
          <PropertyGallery gallery={property.gallery} title={property.title} />
        )}

        {/* Videos - Only if has videos */}
        {property.videos && property.videos.length > 0 && (
          <PropertyVideos
            videos={property.videos}
            onSelectVideo={setSelectedVideo}
          />
        )}

        {/* Floor Plans - Only if has floor plans */}
        {property.floorPlans && property.floorPlans.length > 0 && (
          <PropertyFloorPlans floorPlans={property.floorPlans} />
        )}

        {/* Financial Projection - Always present */}
        <PropertyFinancialProjection
          financialProjection={property.financialProjection}
          formatCurrency={formatCurrency}
        />

        {/* Milestones - Only if has milestones */}
        {property.milestones && property.milestones.length > 0 && (
          <PropertyMilestones milestones={property.milestones} />
        )}

        {/* Documents - Only if has documents */}
        {property.documents && property.documents.length > 0 && (
          <PropertyDocuments documents={property.documents} />
        )}

        {/* Amenities - Only if has amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <PropertyAmenities amenities={property.amenities} />
        )}

        {/* Location - Always present */}
        <PropertyLocation location={property.location} />

        {/* Developer - Always present */}
        <PropertyDeveloper developer={property.developer} />

        {/* Risks - Only if has risks */}
        {property.risks && property.risks.length > 0 && (
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
    </div>
  );
}
