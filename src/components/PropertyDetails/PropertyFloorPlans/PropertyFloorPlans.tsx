import React from "react";
import "./PropertyFloorPlans.css";

type PropertyFloorPlansProps = {
  floorPlans: {
    title: string;
    image: string;
    area: string;
    rooms: number;
    bathrooms: number;
  }[];
};

const PropertyFloorPlans: React.FC<PropertyFloorPlansProps> = ({
  floorPlans,
}) => {
  return (
    <section className="property-floor-plans">
      <h2 className="section-title">Plantas</h2>
      <div className="floor-plan-grid">
        {floorPlans.map((plan, index) => (
          <div key={index} className="floor-plan-item">
            <img src={plan.image || "/placeholder.svg"} alt={plan.title} />
            <div className="floor-plan-info">
              <div className="floor-plan-title">{plan.title}</div>
              <div className="floor-plan-details">
                <span>{plan.area} m²</span>
                <span>{plan.rooms} quartos</span>
                <span>{plan.bathrooms} banheiros</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyFloorPlans;
