import React, { useState } from "react";
import "./MyLands.css";

interface Land {
  id: string;
  name: string;
  location: string;
  area: number;
  partnershipType: "venda" | "aluguel" | "sociedade";
  status: "ativo" | "inativo";
  photos: string[];
  createdAt: string;
}

const MyLands: React.FC = () => {
  const [lands] = useState<Land[]>([
    {
      id: "1",
      name: "Terreno Residencial - Jardim Botânico",
      location: "Brasília, DF",
      area: 500,
      partnershipType: "venda",
      status: "ativo",
      photos: ["/background.jpg"],
      createdAt: "2024-01-14"
    },
    {
      id: "2",
      name: "Terreno Comercial - Centro Empresarial",
      location: "São Paulo, SP",
      area: 1200,
      partnershipType: "sociedade",
      status: "ativo",
      photos: ["/background.jpg"],
      createdAt: "2024-02-20"
    }
  ]);

  const getPartnershipTypeLabel = (type: string) => {
    switch (type) {
      case "venda": return "Venda";
      case "aluguel": return "Aluguel";
      case "sociedade": return "Sociedade";
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    return status === "ativo" ? "ATIVO" : "INATIVO";
  };

  const activeLands = lands.filter(land => land.status === "ativo");
  const forSaleLands = lands.filter(land => land.partnershipType === "venda");

  return (
    <div className="my-lands-container">
      <div className="my-lands-header">
        <h1>Meus Terrenos</h1>
        <p>Gerencie seus terrenos cadastrados na plataforma</p>
      </div>

      <div className="my-lands-stats">
        <div className="stat-card">
          <h3>{lands.length}</h3>
          <p>Total de Terrenos</p>
        </div>
        <div className="stat-card">
          <h3>{activeLands.length}</h3>
          <p>Terrenos Ativos</p>
        </div>
        <div className="stat-card stat-card-wide">
          <h3>{forSaleLands.length}</h3>
          <p>Para Venda</p>
        </div>
      </div>

      <div className="lands-content">
        <div className="lands-sidebar left"></div>

        <div className="lands-main">
          {lands.map((land) => (
            <div key={land.id} className="land-card">
              <div className="land-image">
                <img src={land.photos[0]} alt={land.name} />
                <div className="land-status">
                  <span className={`status-badge ${land.status}`}>
                    {getStatusLabel(land.status)}
                  </span>
                </div>
              </div>

              <div className="land-info">
                <h3>{land.name}</h3>
                <p className="land-location">{land.location}</p>

                <div className="land-details">
                  <div className="detail-item">
                    <span className="label">Área:</span>
                    <span className="value">{land.area} m²</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Tipo de Parceria:</span>
                    <span className="value">{getPartnershipTypeLabel(land.partnershipType)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Cadastrado em:</span>
                    <span className="value">{new Date(land.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lands-sidebar right"></div>
      </div>

      {lands.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏞️</div>
          <h3>Nenhum terreno cadastrado</h3>
          <p>Comece cadastrando seu primeiro terreno para aparecer aqui</p>
          <button className="btn-primary">Cadastrar Terreno</button>
        </div>
      )}
    </div>
  );
};

export default MyLands; 