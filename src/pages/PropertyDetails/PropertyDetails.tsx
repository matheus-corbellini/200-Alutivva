import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// Dados devem vir do backend; removido mock
import { getPropertyByNumericId } from "../../services/PropertiesService";
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
import ReservationConfirmModal from "../../components/PropertyDetails/ReservationConfirmModal";
import Button from "../../components/Button/Button";
import "./PropertyDetails.css";
import { formatCurrency } from "../../utils/currency";
import { Footer } from "borderless";
import { useAuth } from "../../contexts/AuthContext";
import { createReservation } from "../../services/ReservationsService";
import { useNotification } from "../../hooks/useNotification";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);

  const propertyId = Number.parseInt(id || "0");
  const [property, setProperty] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    (async () => {
      setLoading(true);
      try {
        const p = await getPropertyByNumericId(propertyId);
        setProperty(p);
      } finally {
        setLoading(false);
      }
    })();
  }, [propertyId]);

  const handleReserve = () => {
    setShowReservationModal(true);
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

  // Loading state
  if (loading) {
    return (
      <div className="property-details-container">
        <div className="property-details-content">
          <p style={{ padding: 24 }}>Carregando...</p>
        </div>
      </div>
    );
  }

  // 404 Not Found
  if (!property && propertyId !== 0) {
    return (
      <div className="property-details-container">
        <PropertyDetailsHeader
          title={"Propriedade não encontrada"}
          location={""}
          price={0}
          status={"Indisponível"}
        />
        <div className="property-details-content">
          <div className="not-found-section">
            <div className="not-found-content">
              <h1>Oops! Propriedade não encontrada</h1>
              <p>
                A propriedade que você está procurando não existe ou foi
                removida.
              </p>
              <p>
                Que tal explorar outras oportunidades de investimento nos nossos
                empreendimentos?
              </p>
              <div className="not-found-actions">
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => window.location.href = "/marketplace"}
                >
                  Explorar Empreendimentos
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
        <PropertyDetailsHeader
          title={property?.title || ""}
          location={property?.location?.address || ""}
          price={property?.quotaValue || 0}
          status={property?.status || ""}
        />

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

          {/* Financial Projection - Only if has data */}
          {property?.financialProjection && (
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

          {/* Location - Present if data exists */}
          {property?.location && <PropertyLocation location={property.location} />}

          {/* Developer - Only if has data */}
          {property?.developer && <PropertyDeveloper developer={property.developer} />}

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
                x
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

        {/* Reservation Confirm Modal */}
        {property && (
          <ReservationConfirmModal
            isOpen={showReservationModal}
            onClose={() => setShowReservationModal(false)}
            onConfirm={async (quantity) => {
              setShowReservationModal(false);
              if (!property || !user) return;
              setIsLoading(true);
              try {
                await createReservation({
                  propertyId: propertyId,
                  propertyTitle: property.title,
                  quotaValue: property.quotaValue,
                  quantity,
                  totalAmount: property.quotaValue * quantity,
                  roi: property.roi,
                  status: "pending",
                  // user.id vem do contexto; o tipo aqui é amplo
                  userId: user.id,
                } as any);
                showNotification("success", "Reserva enviada", "Sua reserva foi registrada como pendente.");
              } catch (e) {
                showNotification("error", "Erro", "Não foi possível registrar a reserva.");
              } finally {
                setIsLoading(false);
              }
            }}
            propertyTitle={property.title}
            quotaValue={property.quotaValue}
            roi={property.roi}
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