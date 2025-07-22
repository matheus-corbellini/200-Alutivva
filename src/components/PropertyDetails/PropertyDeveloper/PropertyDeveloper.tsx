import React from "react";
import "./PropertyDeveloper.css";

type PropertyDeveloperProps = {
  developer: {
    name: string;
    logo: string;
    description: string;
    projects: number;
    rating: number;
  };
};

const PropertyDeveloper: React.FC<PropertyDeveloperProps> = ({ developer }) => {
  return (
    <section className="property-developer">
      <h2 className="section-title">Desenvolvedor</h2>
      <div className="developer-header">
        <img
          src={developer.logo || "/placeholder.svg"}
          alt={developer.name}
          className="developer-logo"
        />
        <div className="developer-info">
          <h3>{developer.name}</h3>
          <p>{developer.description}</p>
          <div className="developer-stats">
            <div className="developer-stat">
              <span className="developer-stat-value">{developer.projects}</span>
              <span className="developer-stat-label">Projetos</span>
            </div>
            <div className="developer-stat">
              <span className="developer-stat-value">{developer.rating}</span>
              <span className="developer-stat-label">Avaliação</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyDeveloper;
