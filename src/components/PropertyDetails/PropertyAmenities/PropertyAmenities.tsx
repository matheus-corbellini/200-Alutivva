import React from "react";
import "./PropertyAmenities.css";
import { MdCheckCircle } from "react-icons/md";

type PropertyAmenitiesProps = {
  amenities: string[];
};

const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ amenities }) => {
  return (
    <section className="property-amenities">
      <h2 className="section-title">Comodidades</h2>
      <div className="amenities-grid">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <MdCheckCircle className="amenity-icon" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyAmenities;
