import React from "react";
import type { Property } from "../../types/property";
import { PropertyCard } from "./PropertyCard";

type PropertiesGridProps = {
  properties: Property[];
};

export const PropertiesGrid: React.FC<PropertiesGridProps> = ({
  properties,
}) => (
  <div className="properties-grid">
    {properties.map((property) => (
      <PropertyCard key={property.id} property={property} />
    ))}
  </div>
);
