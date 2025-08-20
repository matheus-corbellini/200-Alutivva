import React, { useState, useEffect } from "react";
import type { Property } from "../../types/property";
import { PropertyCard } from ".";
import { MobileOptimizedCard } from "./MobileOptimizedCard";

type PropertiesGridProps = {
  properties: Property[];
  onReserveQuota?: (property: Property) => void;
};

export const PropertiesGrid: React.FC<PropertiesGridProps> = ({
  properties,
  onReserveQuota,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Verifica no mount
    checkIfMobile();

    // Adiciona listener para resize
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Se for mobile, usa layout simplificado
  if (isMobile) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '100%',
        display: 'block',
        padding: '0.5rem 0',
        boxSizing: 'border-box'
      }}>
        {properties.map((property) => (
          <MobileOptimizedCard 
            key={property.id} 
            property={property} 
            onReserveQuota={onReserveQuota}
          />
        ))}
      </div>
    );
  }

  // Desktop usa o grid original
  return (
    <div className="properties-grid">
      {properties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property} 
          onReserveQuota={onReserveQuota}
        />
      ))}
    </div>
  );
};
