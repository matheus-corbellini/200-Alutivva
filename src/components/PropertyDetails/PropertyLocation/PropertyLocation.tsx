import React, { useState, useEffect } from "react";
import "./PropertyLocation.css";
import { MdLocationOn, MdDirections, MdMap, MdAccessTime, MdLocalHospital, MdLocalMall, MdDirectionsWalk, MdDirectionsCar } from "react-icons/md";

type NearbyPlace = {
  name: string;
  distance: string;
  type: string;
};

type PropertyLocationProps = {
  location: {
    address: string;
    coordinates?: { lat: number; lng: number };
    postalCode?: string;
    nearbyPlaces: NearbyPlace[];
  };
};

const PropertyLocation: React.FC<PropertyLocationProps> = ({ location }) => {
  // Normaliza valores para evitar undefined
  const safeLocation: {
    postalCode: string | undefined; address: string; coordinates?: { lat: number; lng: number }; nearbyPlaces: NearbyPlace[]
  } = {
    address: (location?.address || "").trim(),
    coordinates: location?.coordinates,
    nearbyPlaces: Array.isArray(location?.nearbyPlaces) ? (location!.nearbyPlaces as NearbyPlace[]) : [],
    postalCode: undefined
  };
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo default

  // Geocoding function to get coordinates from address
  // Geocodifica por CEP (postalCode) – fallback para endereço
  const geocodeAddressOrCep = async (postalCode?: string, address?: string): Promise<[number, number] | null> => {
    try {
      const query = postalCode && postalCode.trim().length >= 8
        ? `${postalCode}, Brasil`
        : (address ? `${address}, Brasil` : "");
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error);
    }
    return null;
  };

  // Carregar coordenadas do endereço quando o componente montar
  useEffect(() => {
    const loadMapCoordinates = async () => {
      // 1) Preferir coordenadas fornecidas
      if (safeLocation.coordinates && Number.isFinite(safeLocation.coordinates.lat) && Number.isFinite(safeLocation.coordinates.lng)) {
        setMapCenter([safeLocation.coordinates.lat, safeLocation.coordinates.lng]);
        return;
      }
      // 2) Caso contrário, geocodificar por CEP ou endereço
      const coords = await geocodeAddressOrCep(safeLocation.postalCode, safeLocation.address);
      if (coords) {
        setMapCenter(coords);
      } else {
        // 3) Fallback: SP
        setMapCenter([-23.5505, -46.6333]);
      }
    };

    loadMapCoordinates();
  }, [safeLocation.address, safeLocation.coordinates?.lat, safeLocation.coordinates?.lng]);

  const getPlaceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'transport':
        return <MdDirections size={20} />;
      case 'shopping':
        return <MdLocalMall size={20} />;
      case 'hospital':
        return <MdLocalHospital size={20} />;
      case 'park':
        return <MdMap size={20} />;
      case 'beach':
        return <MdMap size={20} />;
      case 'education':
        return <MdAccessTime size={20} />;
      default:
        return <MdLocationOn size={20} />;
    }
  };

  const getTransportIcon = (distance: string) => {
    const distanceValue = parseInt(distance.replace(/\D/g, ''));
    if (distanceValue <= 500) {
      return <MdDirectionsWalk size={16} className="transport-icon walk" />;
    } else if (distanceValue <= 2000) {
      return <MdDirectionsCar size={16} className="transport-icon car" />;
    } else {
      return <MdDirectionsCar size={16} className="transport-icon car" />;
    }
  };

  const handlePlaceClick = (place: NearbyPlace) => {
    setSelectedPlace(selectedPlace?.name === place.name ? null : place);
  };

  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const getDirections = (fromAddress: string, toPlace: string) => {
    const encodedFrom = encodeURIComponent(fromAddress);
    const encodedTo = encodeURIComponent(toPlace);
    window.open(`https://www.google.com/maps/dir/${encodedFrom}/${encodedTo}`, '_blank');
  };

  return (
    <section className="property-location">

      <div className="location-main">
        <div className="location-address-section">
          <div className="location-address-icon">
            <MdLocationOn size={24} />
          </div>
          <div className="location-address-content">
            <div className="location-address">{safeLocation.address}</div>
          </div>
        </div>

        <div className="location-map-container">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter[1] - 0.01},${mapCenter[0] - 0.01},${mapCenter[1] + 0.01},${mapCenter[0] + 0.01}&layer=mapnik&marker=${mapCenter[0]},${mapCenter[1]}`}
            width="100%"
            height="300"
            style={{ border: 'none', borderRadius: '8px' }}
            title="Mapa da Localização"
          />
        </div>
      </div>

      <div className="section-divider">
        <div className="divider-line"></div>
      </div>

      <div className="nearby-section">
        <h3 className="nearby-title">Pontos de Interesse Próximos</h3>
        <div className="nearby-places">
          {(safeLocation.nearbyPlaces || []).map((place, index) => (
            <div
              key={index}
              className={`nearby-item ${selectedPlace?.name === place.name ? 'selected' : ''}`}
              onClick={() => handlePlaceClick(place)}
            >
              <div className="nearby-icon-container">
                {getPlaceIcon(place.type)}
              </div>
              <div className="nearby-info">
                <div className="nearby-name">{place.name}</div>
                <div className="nearby-details">
                  <span className="nearby-distance">
                    {getTransportIcon(place.distance)}
                    {place.distance}
                  </span>
                  <span className="nearby-type">{place.type}</span>
                </div>
              </div>
              <button
                className="nearby-directions-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  getDirections(safeLocation.address, place.name);
                }}
                title={`Como chegar em ${place.name}`}
              >
                <MdDirections size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedPlace && (
        <div className="selected-place-details" key={selectedPlace.name}>
          <div className="selected-place-header">
            <h4>{selectedPlace.name}</h4>
            <button
              className="close-details-btn"
              onClick={() => setSelectedPlace(null)}
            >
              x
            </button>
          </div>
          <div className="selected-place-content">
            <p><strong>Distância:</strong> {selectedPlace.distance}</p>
            <p><strong>Tipo:</strong> {selectedPlace.type}</p>
            <div className="selected-place-actions">
              <button
                className="action-btn primary"
                onClick={() => getDirections(safeLocation.address, selectedPlace.name)}
              >
                <MdDirections size={16} />
                Como Chegar
              </button>
              <button
                className="action-btn secondary"
                onClick={() => openInMaps(selectedPlace.name)}
              >
                <MdMap size={16} />
                Ver no Mapa
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertyLocation;
