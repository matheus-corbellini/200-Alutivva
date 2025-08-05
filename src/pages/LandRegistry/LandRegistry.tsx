import React, { useState } from "react";
import "./LandRegistry.css";
import { MdLocationOn, MdAdd, MdEdit, MdDelete, MdVisibility, MdClose, MdPhone, MdAccessTime, MdTerrain } from "react-icons/md";
import Button from "../../components/Button/Button";

import { Footer } from "borderless";

interface Land {
  id: number;
  title: string;
  location: string;
  area: string;
  price: number;
  status: "disponível" | "reservado" | "vendido";
  image: string;
  description: string;
  coordinates: { lat: number; lng: number };
  features: string[];
}

interface LandFormData {
  title: string;
  location: string;
  area: string;
  price: number;
  status: "disponível" | "reservado" | "vendido";
  description: string;
  features: string[];
}

const mockLands: Land[] = [
  {
    id: 1,
    title: "Terreno Praia do Rosa",
    location: "Imbituba, SC",
    area: "2.500m²",
    price: 850000,
    status: "disponível",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    description: "Terreno privilegiado com vista para o mar, ideal para resort de luxo",
    coordinates: { lat: -28.2356, lng: -48.6667 },
    features: ["Vista para o mar", "Acesso direto à praia", "Infraestrutura básica"]
  },
  {
    id: 2,
    title: "Terreno Serra da Mantiqueira",
    location: "Campos do Jordão, SP",
    area: "5.000m²",
    price: 1200000,
    status: "reservado",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    description: "Terreno em região montanhosa, perfeito para hotel boutique",
    coordinates: { lat: -22.7392, lng: -45.5912 },
    features: ["Vista panorâmica", "Clima ameno", "Turismo de inverno"]
  },
  {
    id: 3,
    title: "Terreno Chapada Diamantina",
    location: "Lençóis, BA",
    area: "8.000m²",
    price: 650000,
    status: "disponível",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    description: "Terreno em região de ecoturismo, ideal para pousada ecológica",
    coordinates: { lat: -12.5619, lng: -41.3928 },
    features: ["Ecoturismo", "Cachoeiras próximas", "Natureza preservada"]
  }
];

const LandRegistry: React.FC = () => {
  const [lands, setLands] = useState<Land[]>(mockLands);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [editingLand, setEditingLand] = useState<Land | null>(null);

  const [formData, setFormData] = useState<LandFormData>({
    title: "",
    location: "",
    area: "",
    price: 0,
    status: "disponível",
    description: "",
    features: []
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);



  const getStatusText = (status: string) => {
    switch (status) {
      case "disponível":
        return "Disponível";
      case "reservado":
        return "Reservado";
      case "vendido":
        return "Vendido";
      default:
        return status;
    }
  };



  const handleAddLand = () => {
    setEditingLand(null);
    setFormData({
      title: "",
      location: "",
      area: "",
      price: 0,
      status: "disponível",
      description: "",
      features: []
    });
    setShowModal(true);
  };

  const handleEditLand = (land: Land) => {
    setEditingLand(land);
    setFormData({
      title: land.title,
      location: land.location,
      area: land.area,
      price: land.price,
      status: land.status,
      description: land.description,
      features: [...land.features]
    });
    setShowModal(true);
  };

  const handleDeleteLand = (landId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este terreno?")) {
      setLands(lands.filter(land => land.id !== landId));
    }
  };

  const handleSaveLand = () => {
    if (!formData.title || !formData.location || !formData.area || formData.price <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (editingLand) {
      // Editar terreno existente
      setLands(lands.map(land =>
        land.id === editingLand.id
          ? { ...land, ...formData }
          : land
      ));
    } else {
      // Adicionar novo terreno
      const newLand: Land = {
        id: Math.max(...lands.map(l => l.id)) + 1,
        ...formData,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
        coordinates: { lat: -23.5505, lng: -46.6333 } // São Paulo default
      };
      setLands([...lands, newLand]);
    }

    setShowModal(false);
    setEditingLand(null);
  };

  const handleViewDetails = (land: Land) => {
    setSelectedLand(land);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedLand(null);
  };

  return (
    <div className="land-registry-page-wrapper">
      <div className="land-registry-container">
        <div className="land-registry-header">
          <h1>Registro de Terrenos</h1>
          <Button
            variant="primary"
            onClick={handleAddLand}
            className="add-land-button"
          >
            <MdAdd size={20} />
            Adicionar Terreno
          </Button>
        </div>

        <div className="land-registry-content">
          {lands.length === 0 ? (
            <div className="empty-state">
              <h2>Nenhum terreno registrado</h2>
              <p>Comece adicionando seu primeiro terreno para gerenciar suas propriedades.</p>
              <Button variant="primary" onClick={handleAddLand}>
                Adicionar Primeiro Terreno
              </Button>
            </div>
          ) : (
            <div className="lands-grid">
              {lands.map((land) => (
                <div key={land.id} className="land-card">
                  <div className="land-image">
                    <img src={land.image} alt={land.title} />
                    <div className={`status-badge ${land.status}`}>
                      {getStatusText(land.status)}
                    </div>
                  </div>
                  <div className="land-info">
                    <h3>{land.title}</h3>
                    <p className="location">
                      <strong>Localização:</strong> {land.location}
                    </p>
                    <p className="area">
                      <strong>Área:</strong> {land.area}
                    </p>
                    <p className="price">
                      <strong>Preço:</strong> {formatCurrency(land.price)}
                    </p>
                    {land.description && (
                      <p className="description">{land.description}</p>
                    )}
                    {land.features.length > 0 && (
                      <div className="features">
                        {land.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="feature-tag">
                            {feature}
                          </span>
                        ))}
                        {land.features.length > 3 && (
                          <span className="feature-tag more">
                            +{land.features.length - 3} mais
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="land-actions">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleViewDetails(land)}
                    >
                      <MdVisibility size={16} />
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEditLand(land)}
                    >
                      <MdEdit size={16} />
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteLand(land.id)}
                    >
                      <MdDelete size={16} />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de detalhes do terreno */}
        {showDetailsModal && selectedLand && (
          <div className="details-modal-overlay" onClick={closeDetailsModal}>
            <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="details-modal-header">
                <h2>Detalhes do Terreno</h2>
                <button
                  className="details-modal-close"
                  onClick={closeDetailsModal}
                  aria-label="Fechar detalhes"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="details-modal-body">
                <div className="details-image-section">
                  <img src={selectedLand.image} alt={selectedLand.title} />
                  <div className={`details-status-badge ${selectedLand.status}`}>
                    {getStatusText(selectedLand.status)}
                  </div>
                </div>

                <div className="details-info-section">
                  <h3>{selectedLand.title}</h3>

                  <div className="details-grid">
                    <div className="detail-item">
                      <MdLocationOn size={20} />
                      <div>
                        <strong>Localização</strong>
                        <p>{selectedLand.location}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <MdTerrain size={20} />
                      <div>
                        <strong>Área</strong>
                        <p>{selectedLand.area}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <MdAccessTime size={20} />
                      <div>
                        <strong>Preço</strong>
                        <p className="price">{formatCurrency(selectedLand.price)}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <MdPhone size={20} />
                      <div>
                        <strong>Contato</strong>
                        <p>+55 (11) 99999-9999</p>
                      </div>
                    </div>
                  </div>

                  {selectedLand.description && (
                    <div className="details-description">
                      <h4>Descrição</h4>
                      <p>{selectedLand.description}</p>
                    </div>
                  )}

                  {selectedLand.features.length > 0 && (
                    <div className="details-features">
                      <h4>Características</h4>
                      <div className="features-grid">
                        {selectedLand.features.map((feature, index) => (
                          <span key={index} className="feature-tag">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="details-coordinates">
                    <h4>Coordenadas</h4>
                    <p>Latitude: {selectedLand.coordinates.lat}</p>
                    <p>Longitude: {selectedLand.coordinates.lng}</p>
                  </div>
                </div>
              </div>

              <div className="details-modal-footer">
                <Button
                  variant="secondary"
                  onClick={closeDetailsModal}
                >
                  Fechar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    closeDetailsModal();
                    handleEditLand(selectedLand);
                  }}
                >
                  Editar Terreno
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para adicionar/editar terreno */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingLand ? "Editar Terreno" : "Adicionar Terreno"}</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Título *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Nome do terreno"
                    />
                  </div>

                  <div className="form-group">
                    <label>Localização *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Endereço do terreno"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Área *</label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="Ex: 2.500m²"
                    />
                  </div>

                  <div className="form-group">
                    <label>Preço *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "disponível" | "reservado" | "vendido" })}
                  >
                    <option value="disponível">Disponível</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do terreno"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Características</label>
                  <input
                    type="text"
                    placeholder="Digite as características separadas por vírgula"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const features = input.value.split(',').map(f => f.trim()).filter(f => f);
                        if (features.length > 0) {
                          setFormData({ ...formData, features: [...formData.features, ...features] });
                          input.value = '';
                        }
                      }
                    }}
                  />
                  {formData.features.length > 0 && (
                    <div className="features-list">
                      {formData.features.map((feature, index) => (
                        <span key={index} className="feature-tag">
                          {feature}
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              features: formData.features.filter((_, i) => i !== index)
                            })}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveLand}
                >
                  {editingLand ? "Salvar" : "Adicionar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer
        theme="light"
        useGradient={false}
        backgroundColor="transparent"
        logoVariant="light"
      />
    </div>
  );
};

export default LandRegistry; 