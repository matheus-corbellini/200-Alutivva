import React, { useEffect, useMemo, useState } from 'react';
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
  properties: (Rental & { coordinates?: [number, number] })[];
  onPropertyClick?: (property: Rental) => void;
  onReserve?: (property: Rental) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  properties,
  onPropertyClick,
  onReserve
}) => {
  // Coordenadas padrão do Brasil
  const defaultCenter: [number, number] = [-15.7801, -47.9292]; // Brasília

  // Geocoding cache (mem + localStorage)
  const [addressToCoords, setAddressToCoords] = useState<Record<string, [number, number]>>({});

  const getCached = (addr: string): [number, number] | null => {
    if (addressToCoords[addr]) return addressToCoords[addr];
    try {
      const raw = localStorage.getItem(`geocode:${addr}`);
      if (raw) return JSON.parse(raw) as [number, number];
    } catch { }
    return null;
  };

  const setCached = (addr: string, coords: [number, number]) => {
    setAddressToCoords(prev => ({ ...prev, [addr]: coords }));
    try { localStorage.setItem(`geocode:${addr}`, JSON.stringify(coords)); } catch { }
  };

  const geocodeAddress = async (addr: string): Promise<[number, number] | null> => {
    const cached = getCached(addr);
    if (cached) return cached;
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&format=json&limit=1`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
      if (!res.ok) return null;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          const coords: [number, number] = [lat, lon];
          setCached(addr, coords);
          return coords;
        }
      }
    } catch { }
    return null;
  };

  useEffect(() => {
    // Geocodifica endereços faltantes (em paralelo, mas leve)
    const run = async () => {
      const missing = properties
        .filter(p => !p.coordinates || !Array.isArray(p.coordinates))
        .map(p => p.address)
        .filter(Boolean);
      await Promise.all(missing.map(addr => geocodeAddress(addr)));
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.map(p => p.address).join('|')]);

  const propertiesWithCoords = useMemo(() => {
    return properties.map((property) => {
      if (property.coordinates && Array.isArray(property.coordinates)) {
        return property as Rental & { coordinates: [number, number] };
      }
      const fromCache = getCached(property.address);
      if (fromCache) return { ...(property as any), coordinates: fromCache } as Rental & { coordinates: [number, number] };
      // Sem geocode ainda: não plotar até resolver
      return { ...(property as any), coordinates: undefined } as any;
    }).filter((p: any) => Array.isArray(p.coordinates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, addressToCoords, properties.map(p => p.address).join('|')]);

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
                    {property.amenities.slice(0, 3).map((amenity: string, index: number) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="amenity-tag">+{property.amenities.length - 3} mais</span>
                    )}
                  </div>
                </div>
                <button className="popup-reserve-btn" onClick={() => onReserve?.(property)}>Reservar</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 