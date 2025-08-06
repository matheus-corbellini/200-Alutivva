import React from "react";
import type { Property } from "../../types/property";
import { PropertyCard } from ".";

type PropertiesGridProps = {
  properties: Property[];
  onReserveQuota?: (property: Property) => void;
};

export const PropertiesGrid: React.FC<PropertiesGridProps> = ({
  properties,
  onReserveQuota,
}) => (
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
