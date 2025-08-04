import React, { useState } from "react";
import "./LandRegistry.css";
import { MdLocationOn, MdAdd, MdSearch, MdFilterList, MdMap, MdArrowBack, MdEdit, MdDelete } from "react-icons/md";
import Button from "../../components/Button/Button";
import { useAppNavigate } from "../../hooks/useAppNavigate";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [showMap, setShowMap] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLand, setEditingLand] = useState<Land | null>(null);
  const { goToMarketplace } = useAppNavigate();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponível":
        return "status-available";
      case "reservado":
        return "status-reserved";
      case "vendido":
        return "status-sold";
      default:
        return "";
    }
  };

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

  const filteredLands = lands.filter(land => {
    const matchesSearch = land.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || land.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hasActiveFilters = searchTerm || statusFilter !== "todos";

  const handleBackToMarketplace = () => {
    goToMarketplace();
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
    alert(`Detalhes do terreno: ${land.title}`);
  };

  return (
    <div className="land-registry-container">
      <div className="land-registry-header">
        <div className="header-navigation">
          <Button
            variant="secondary"
            size="medium"
            onClick={handleBackToMarketplace}
            className="back-button"
          >
            <MdArrowBack size={20} />
            Voltar ao Marketplace
          </Button>
        </div>

        <div className="header-content">
          <div className="header-title-section">
            <h1>Registro de Terrenos</h1>
            <p>Gerencie e encontre terrenos ideais para seu próximo empreendimento hoteleiro</p>
          </div>

          <div className="header-actions">
            <Button
              variant="primary"
              size="medium"
              onClick={handleAddLand}
              className="add-button"
            >
              <MdAdd size={20} />
              Adicionar Terreno
            </Button>
          </div>
        </div>
      </div>

      <div className={`land-registry-filters ${hasActiveFilters ? 'has-filters' : ''}`}>
        <div className="search-section">
          <div className="search-input">
            <MdSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por localização ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <MdFilterList size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="disponível">Disponível</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>

          <Button
            variant="secondary"
            size="medium"
            onClick={() => setShowMap(!showMap)}
          >
            <MdMap size={16} />
            {showMap ? "Ver Lista" : "Ver Mapa"}
          </Button>
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            <span className="filter-indicator">
              {filteredLands.length} terreno{filteredLands.length !== 1 ? 's' : ''} encontrado{filteredLands.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <div className="land-registry-content">
        {showMap ? (
          <div className="map-view">
            <div className="map-placeholder">
              <MdMap size={48} />
              <h3>Visualização do Mapa</h3>
              <p>Mapa interativo será implementado em breve</p>
            </div>
          </div>
        ) : (
          <div className="lands-grid">
            {filteredLands.map((land) => (
              <div key={land.id} className="land-card">
                <div className="land-image">
                  <img src={land.image} alt={land.title} />
                  <div className={`land-status ${getStatusColor(land.status)}`}>
                    {getStatusText(land.status)}
                  </div>
                  <div className="land-actions-overlay">
                    <button
                      onClick={() => handleEditLand(land)}
                      className="edit-button"
                      title="Editar terreno"
                    >
                      <MdEdit size={18} />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteLand(land.id)}
                      className="delete-button"
                      title="Excluir terreno"
                    >
                      <MdDelete size={18} />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>

                <div className="land-content">
                  <h3>{land.title}</h3>

                  <div className="land-location">
                    <MdLocationOn size={16} />
                    <span>{land.location}</span>
                  </div>

                  <p className="land-description">{land.description}</p>

                  <div className="land-details">
                    <div className="detail-item">
                      <span className="detail-label">Área:</span>
                      <span className="detail-value">{land.area}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Preço:</span>
                      <span className="detail-value price">{formatCurrency(land.price)}</span>
                    </div>
                  </div>

                  <div className="land-features">
                    {land.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                    {land.features.length > 2 && (
                      <span className="feature-tag more">
                        +{land.features.length - 2} mais
                      </span>
                    )}
                  </div>

                  <div className="land-actions">
                    <Button
                      variant="primary"
                      size="medium"
                      onClick={() => handleViewDetails(land)}
                      disabled={land.status === "vendido"}
                    >
                      Ver Detalhes
                    </Button>
                    {land.status === "disponível" && (
                      <Button
                        variant="secondary"
                        size="medium"
                        onClick={() => alert(`Interesse registrado em: ${land.title}`)}
                      >
                        Tenho Interesse
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredLands.length === 0 && (
        <div className="empty-state">
          <MdSearch size={48} />
          <h3>Nenhum terreno encontrado</h3>
          <p>Tente ajustar os filtros ou buscar por outros termos</p>
        </div>
      )}

      {/* Modal para Adicionar/Editar Terreno */}
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
                  placeholder="Cidade, Estado"
                />
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
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
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
  );
};

export default LandRegistry; 