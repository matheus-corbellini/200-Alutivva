import { useEffect, useState } from "react";
import { useRental } from "../../hooks/useRental";
import { MdLocationOn, MdPeople, MdBed, MdShower, MdAttachMoney, MdWifi, MdAir, MdKitchen, MdLocalFireDepartment, MdPool, MdVisibility, MdFlashOn, MdSecurity, MdSupport, MdMap } from "react-icons/md";
import { FaClipboardList, FaHouseUser } from "react-icons/fa";
import type { Rental } from "../../types/rental";
import MapComponent from "../../components/MapComponent";
import "./Hospedagem.css";
import { listRentals } from "../../services/RentalsService";
import { useSidebarCollapse } from "../../contexts/SidebarCollapseContext";

export default function HospedagemPage() {
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/no-explicit-any
  const { /* rentals */ } = useRental() as any;
  const { setIsCollapsed } = useSidebarCollapse();
  const [selectedProperty, setSelectedProperty] = useState<Rental | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Rental[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [0, 1000],
    amenities: [] as string[],
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listRentals();
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtrar apenas propriedades de hospedagem ativas
  const availableProperties = items.filter(rental =>
    rental.businessType === "daily_rent" && rental.status === "active"
  );

  const handlePropertyClick = (property: Rental) => {
    setSelectedProperty(property);
    setShowBookingModal(true);
  };

  const handleMapPropertyClick = (property: Rental) => {
    // Apenas exibir o popup do mapa; não abrir o modal de reserva
    setSelectedProperty(property);
  };

  const handleBooking = (property: Rental, bookingData: Record<string, unknown>) => {
    // Aqui você implementaria a lógica de reserva
    console.log("Reserva realizada:", { property, bookingData });
    setShowBookingModal(false);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="hospedagem-page-wrapper">
      <div className={`hospedagem-content ${showMap ? 'with-map' : 'full-width'}`}>
        <div className="hospedagem-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Encontre sua próxima estadia perfeita</h1>
              <p>Descubra propriedades únicas para suas viagens. Reserve com segurança e aproveite experiências incríveis.</p>
            </div>
            <div className="header-actions">
              <button
                className={`map-toggle-btn ${showMap ? 'active' : ''}`}
                onClick={() => {
                  const next = !showMap;
                  setShowMap(next);
                  // Minimiza a sidebar quando abrir o mapa e restaura quando fechar
                  setIsCollapsed(next);
                }}
              >
                <MdMap className="map-icon" size={18} />
                <span className="map-text">{showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="search-filters">
          <div className="filters-toggle">
            <button
              className="filters-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="filters-toggle-text">Filtros de Busca</span>
              <span className={`toggle-icon ${showFilters ? 'open' : 'closed'}`}>
                {showFilters ? '−' : '+'}
              </span>
            </button>
          </div>

          {showFilters && (
            <div className="filters-container">
              <div className="filter-group">
                <label>Localização</label>
                <input
                  type="text"
                  placeholder="Para onde você vai?"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                />
              </div>
              <div className="filter-group">
                <label>Check-in</label>
                <input
                  type="date"
                  value={searchFilters.checkIn}
                  onChange={(e) => setSearchFilters({ ...searchFilters, checkIn: e.target.value })}
                />
              </div>
              <div className="filter-group">
                <label>Check-out</label>
                <input
                  type="date"
                  value={searchFilters.checkOut}
                  onChange={(e) => setSearchFilters({ ...searchFilters, checkOut: e.target.value })}
                />
              </div>
              <div className="filter-group">
                <label>Hóspedes</label>
                <input
                  type="number"
                  min="1"
                  value={searchFilters.guests}
                  onChange={(e) => setSearchFilters({ ...searchFilters, guests: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="results-summary">
          <p>Encontrados {availableProperties.length} propriedades</p>
        </div>

        <div className="properties-grid">
          {loading && (<div className="empty-state"><p>Carregando...</p></div>)}
          {availableProperties.map((property) => (
            <div key={property.id} className="property-card" onClick={() => handlePropertyClick(property)}>
              <div className="property-image">
                <div className="availability-badge">DISPONÍVEL</div>
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop" alt={property.title} />
              </div>
              <div className="property-info">
                <h3>{property.title}</h3>
                <div className="property-location">
                  <span className="location-icon">•</span>
                  <span>{property.address}</span>
                </div>
                <p className="property-description">{property.description}</p>
                <div className="property-details">
                  <div className="detail-item">
                    <span className="detail-label">Diária:</span>
                    <span className="detail-value price">{formatCurrency(property.dailyRate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hóspedes:</span>
                    <span className="detail-value">Até {property.maxGuests}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Quartos:</span>
                    <span className="detail-value">{property.bedrooms}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Banheiros:</span>
                    <span className="detail-value">{property.bathrooms}</span>
                  </div>
                </div>
                <div className="property-amenities">
                  <span className="amenities-label">Comodidades:</span>
                  <div className="amenities-list">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="amenity-tag">+{property.amenities.length - 3} mais</span>
                    )}
                  </div>
                </div>
                <button className="view-details-btn">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>

        {availableProperties.length === 0 && (
          <div className="empty-state">
            <h2>Nenhuma propriedade encontrada</h2>
            <p>Tente ajustar os filtros de busca para encontrar mais opções.</p>
          </div>
        )}
      </div>

      {showMap && (
        <div className={`hospedagem-map ${showMap ? 'active' : ''}`}>
          <MapComponent
            properties={availableProperties}
            onPropertyClick={handleMapPropertyClick}
            onReserve={(property) => {
              setSelectedProperty(property);
              setShowBookingModal(true);
            }}
          />
        </div>
      )}

      {/* Modal de reserva */}
      {showBookingModal && selectedProperty && (
        <div className="hospedagem-modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="hospedagem-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="hospedagem-modal-header">
              <h2>Reservar {selectedProperty.title}</h2>
              <button
                className="hospedagem-modal-close"
                onClick={() => setShowBookingModal(false)}
              >
                x
              </button>
            </div>
            <div className="hospedagem-modal-body">
              <div className="booking-property-info">
                <div className="property-image-section">
                  <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop" alt={selectedProperty.title} />
                  <div className="property-status">
                    <span className="status-badge available">DISPONÍVEL</span>
                  </div>
                </div>
                <div className="property-summary">
                  <h3>{selectedProperty.title}</h3>
                  <div className="property-location">
                    <MdLocationOn className="location-icon" />
                    <span>{selectedProperty.address}</span>
                  </div>
                  <p className="property-description">{selectedProperty.description}</p>

                  <div className="property-highlights">
                    <div className="highlight-item">
                      <MdAttachMoney className="highlight-icon" />
                      <span className="highlight-label">Diária</span>
                      <span className="highlight-value price">{formatCurrency(selectedProperty.dailyRate)}</span>
                    </div>
                    <div className="highlight-item">
                      <MdPeople className="highlight-icon" />
                      <span className="highlight-label">Hóspedes</span>
                      <span className="highlight-value">Até {selectedProperty.maxGuests}</span>
                    </div>
                    <div className="highlight-item">
                      <MdBed className="highlight-icon" />
                      <span className="highlight-label">Quartos</span>
                      <span className="highlight-value">{selectedProperty.bedrooms}</span>
                    </div>
                    <div className="highlight-item">
                      <MdShower className="highlight-icon" />
                      <span className="highlight-label">Banheiros</span>
                      <span className="highlight-value">{selectedProperty.bathrooms}</span>
                    </div>
                  </div>

                  <div className="booking-property-details">
                    <div className="booking-detail-section">
                      <h4><FaClipboardList /> Informações Adicionais</h4>
                      <div className="booking-detail-grid">
                        <div className="booking-detail-item">
                          <span className="booking-detail-label">Check-in:</span>
                          <span className="booking-detail-value">15:00</span>
                        </div>
                        <div className="booking-detail-item">
                          <span className="booking-detail-label">Check-out:</span>
                          <span className="booking-detail-value">10:00</span>
                        </div>
                        <div className="booking-detail-item">
                          <span className="booking-detail-label">Taxa de limpeza:</span>
                          <span className="booking-detail-value">R$ 80,00</span>
                        </div>
                        <div className="booking-detail-item">
                          <span className="booking-detail-label">Taxa de serviço:</span>
                          <span className="booking-detail-value">R$ 40,00</span>
                        </div>
                      </div>
                    </div>

                    <div className="booking-detail-section">
                      <h4><FaHouseUser /> Comodidades</h4>
                      <div className="booking-amenities-grid">
                        <span className="booking-amenity-tag"><MdWifi /> Wi-Fi</span>
                        <span className="booking-amenity-tag"><MdAir /> Ar condicionado</span>
                        <span className="booking-amenity-tag"><MdKitchen /> Cozinha completa</span>
                        <span className="booking-amenity-tag"><MdLocalFireDepartment /> Churrasqueira</span>
                        <span className="booking-amenity-tag"><MdPool /> Piscina</span>
                        <span className="booking-amenity-tag"><MdVisibility /> Vista para o mar</span>
                      </div>
                    </div>

                    <div className="property-features">
                      <div className="feature-item">
                        <MdFlashOn className="feature-icon" />
                        <span className="feature-text">Reserva com confirmação</span>
                      </div>
                      <div className="feature-item">
                        <MdSecurity className="feature-icon" />
                        <span className="feature-text">Reserva segura</span>
                      </div>
                      <div className="feature-item">
                        <MdSupport className="feature-icon" />
                        <span className="feature-text">Suporte 24h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="booking-form">
                <h4>Detalhes da Reserva</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Check-in</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>Check-out</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Número de hóspedes</label>
                  <input type="number" min="1" max={selectedProperty.maxGuests} defaultValue="1" />
                </div>

                <div className="booking-summary">
                  <h4>Resumo da reserva</h4>
                  <div className="summary-item">
                    <span>Diária:</span>
                    <span>{formatCurrency(selectedProperty.dailyRate)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Taxa de limpeza:</span>
                    <span>{formatCurrency(selectedProperty.cleaningFee)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Taxa de serviço:</span>
                    <span>{formatCurrency(selectedProperty.serviceFee)}</span>
                  </div>
                  <div className="summary-total">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedProperty.dailyRate + selectedProperty.cleaningFee + selectedProperty.serviceFee)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hospedagem-modal-footer">
              <button className="hospedagem-booking-btn" onClick={() => handleBooking(selectedProperty, {})}>
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 