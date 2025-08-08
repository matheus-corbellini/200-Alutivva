import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Rental } from '../types/rental';

// Fix para os ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  properties: Rental[];
  onPropertyClick?: (property: Rental) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  properties,
  onPropertyClick
}) => {
  // Coordenadas padrão do Brasil
  const defaultCenter: [number, number] = [-15.7801, -47.9292]; // Brasília

  // Gerar coordenadas aleatórias para as propriedades se não tiverem
  const propertiesWithCoords = properties.map((property) => {
    // Gerar coordenadas aleatórias no Brasil
    const lat = -15.7801 + (Math.random() - 0.5) * 10; // Entre -10 e -20
    const lng = -47.9292 + (Math.random() - 0.5) * 20; // Entre -37 e -57

    return {
      ...property,
      coordinates: [lat, lng] as [number, number]
    };
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {propertiesWithCoords.map((property) => (
          <Marker
            key={property.id}
            position={property.coordinates}
            eventHandlers={{
              click: () => onPropertyClick?.(property),
            }}
          >
            <Popup>
              <div className="map-popup">
                <h3>{property.title}</h3>
                <p><strong>Endereço:</strong> {property.address}</p>
                <p><strong>Diária:</strong> {formatCurrency(property.dailyRate)}</p>
                <p><strong>Hóspedes:</strong> Até {property.maxGuests} pessoas</p>
                <p><strong>Quartos:</strong> {property.bedrooms}</p>
                <p><strong>Banheiros:</strong> {property.bathrooms}</p>
                <div className="popup-amenities">
                  <strong>Comodidades:</strong>
                  <div className="amenities-list">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="amenity-tag">+{property.amenities.length - 3} mais</span>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 