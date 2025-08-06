import React, { useState, useEffect } from "react";
import {
  MdAdd,
  MdClose,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdPending,
  MdWarning,
  MdCancel,
  MdHome,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdEmail
} from "react-icons/md";
import Button from "../../components/Button/Button";
import { useRental } from "../../hooks/useRental";
import "./RentalManagement.css";

interface Rental {
  id: number;
  title: string;
  address: string;
  tenant: string;
  tenantPhone: string;
  tenantEmail: string;
  monthlyRent: number;
  deposit: number;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "expired" | "cancelled";
  propertyType: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  documents: string[];
}

const RentalManagement: React.FC = () => {
  const { rentals, setRentals, updateRentalCount } = useRental();

  const [showModal, setShowModal] = useState(false);
  const [editingRental, setEditingRental] = useState<Rental | null>(null);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Atualizar a quantidade de alugueis sempre que a lista mudar
  useEffect(() => {
    updateRentalCount();
  }, [rentals, updateRentalCount]);

  const [formData, setFormData] = useState<Partial<Rental>>({
    title: "",
    address: "",
    tenant: "",
    tenantPhone: "",
    tenantEmail: "",
    monthlyRent: 0,
    deposit: 0,
    startDate: "",
    endDate: "",
    status: "pending",
    propertyType: "",
    area: "",
    bedrooms: 1,
    bathrooms: 1,
    description: "",
    documents: []
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "pending":
        return "status-pending";
      case "expired":
        return "status-expired";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "pending":
        return "Pendente";
      case "expired":
        return "Expirado";
      case "cancelled":
        return "Cancelado";
      default:
        return "Pendente";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <MdCheckCircle size={14} />;
      case "pending":
        return <MdPending size={14} />;
      case "expired":
        return <MdWarning size={14} />;
      case "cancelled":
        return <MdCancel size={14} />;
      default:
        return <MdPending size={14} />;
    }
  };

  const handleAddRental = () => {
    setFormData({
      title: "",
      address: "",
      tenant: "",
      tenantPhone: "",
      tenantEmail: "",
      monthlyRent: 0,
      deposit: 0,
      startDate: "",
      endDate: "",
      status: "pending",
      propertyType: "",
      area: "",
      bedrooms: 1,
      bathrooms: 1,
      description: "",
      documents: []
    });
    setEditingRental(null);
    setShowModal(true);
  };

  const handleViewDetails = (rental: Rental) => {
    setSelectedRental(rental);
    setShowDetailsModal(true);
  };

  const handleEditRental = (rental: Rental) => {
    setFormData(rental);
    setEditingRental(rental);
    setShowModal(true);
  };

  const handleDeleteRental = (rentalId: number) => {
    setRentals(rentals.filter(rental => rental.id !== rentalId));
  };

  const handleSaveRental = () => {
    if (editingRental) {
      setRentals(rentals.map(rental =>
        rental.id === editingRental.id
          ? { ...formData, id: rental.id } as Rental
          : rental
      ));
    } else {
      const newRental: Rental = {
        ...formData,
        id: Math.max(...rentals.map(r => r.id)) + 1
      } as Rental;
      setRentals([...rentals, newRental]);
    }
    setShowModal(false);
    setEditingRental(null);
  };

  const filteredRentals = statusFilter === "all"
    ? rentals
    : rentals.filter(rental => rental.status === statusFilter as "active" | "pending" | "expired" | "cancelled");



  return (
    <div className="rental-management-container">
      <div className="rental-management-header">
        <h1>Gestão de Alugueis</h1>
        <Button
          variant="primary"
          onClick={handleAddRental}
          className="add-rental-button"
        >
          <MdAdd size={20} />
          Adicionar Aluguel
        </Button>
      </div>

      <div className="rental-management-content">
        <div className="rental-filters-section">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="pending">Pendente</option>
              <option value="expired">Expirado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="rentals-grid">
          {filteredRentals.map((rental) => (
            <div key={rental.id} className="rental-card">
              <div className="rental-status-hover">
                <div className={`status-badge ${getStatusColor(rental.status)}`}>
                  {getStatusIcon(rental.status)}
                  {getStatusText(rental.status)}
                </div>
              </div>
              <div className="rental-header">
                <div className="rental-title">
                  <MdHome size={20} />
                  <h3>{rental.title}</h3>
                </div>
              </div>

              <div className="rental-info">
                <div className="info-row">
                  <MdLocationOn size={16} />
                  <span>{rental.address}</span>
                </div>

                <div className="info-row">
                  <MdPerson size={16} />
                  <span>{rental.tenant}</span>
                </div>

                <div className="info-row">
                  <MdPhone size={16} />
                  <span>{rental.tenantPhone}</span>
                </div>

                <div className="info-row">
                  <MdEmail size={16} />
                  <span>{rental.tenantEmail}</span>
                </div>

                <div className="rental-summary">
                  <div className="summary-item">
                    <strong>Aluguel:</strong>
                    <span className="price">{formatCurrency(rental.monthlyRent)}</span>
                  </div>
                  <div className="summary-item">
                    <strong>Período:</strong>
                    <span>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</span>
                  </div>
                </div>
              </div>

              <div className="rental-actions">
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleViewDetails(rental)}
                >
                  <MdVisibility size={16} />
                  Ver Detalhes
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEditRental(rental)}
                >
                  <MdEdit size={16} />
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteRental(rental.id)}
                >
                  <MdDelete size={16} />
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredRentals.length === 0 && (
          <div className="empty-state">
            <h2>Nenhum aluguel encontrado</h2>
            <p>Comece adicionando seu primeiro aluguel para gerenciar suas propriedades.</p>
            <Button variant="primary" onClick={handleAddRental}>
              Adicionar Primeiro Aluguel
            </Button>
          </div>
        )}

        {/* Modal para adicionar/editar aluguel */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingRental ? "Editar Aluguel" : "Adicionar Aluguel"}</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Título *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Nome da propriedade"
                    />
                  </div>

                  <div className="form-group">
                    <label>Endereço *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Endereço completo"
                    />
                  </div>

                  <div className="form-group">
                    <label>Inquilino *</label>
                    <input
                      type="text"
                      value={formData.tenant}
                      onChange={(e) => setFormData({ ...formData, tenant: e.target.value })}
                      placeholder="Nome do inquilino"
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefone do Inquilino</label>
                    <input
                      type="tel"
                      value={formData.tenantPhone}
                      onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                      placeholder="Telefone"
                    />
                  </div>

                  <div className="form-group">
                    <label>E-mail do Inquilino</label>
                    <input
                      type="email"
                      value={formData.tenantEmail}
                      onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                      placeholder="E-mail"
                    />
                  </div>

                  <div className="form-group">
                    <label>Aluguel Mensal (R$) *</label>
                    <input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Caução (R$)</label>
                    <input
                      type="number"
                      value={formData.deposit}
                      onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Data de Início *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Data de Fim *</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "pending" | "expired" | "cancelled" })}
                    >
                      <option value="pending">Pendente</option>
                      <option value="active">Ativo</option>
                      <option value="expired">Expirado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tipo de Propriedade</label>
                    <input
                      type="text"
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      placeholder="Ex: Apartamento, Casa, Studio"
                    />
                  </div>

                  <div className="form-group">
                    <label>Área</label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="Ex: 65m²"
                    />
                  </div>

                  <div className="form-group">
                    <label>Quartos</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Banheiros</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição da propriedade"
                    rows={3}
                  />
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
                  onClick={handleSaveRental}
                >
                  {editingRental ? "Salvar" : "Adicionar"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalhes */}
        {showDetailsModal && selectedRental && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Detalhes do Aluguel</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="details-grid">
                  <div className="detail-section">
                    <h3>Informações da Propriedade</h3>
                    <div className="detail-item">
                      <strong>Título:</strong>
                      <span>{selectedRental.title}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Endereço:</strong>
                      <span>{selectedRental.address}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Tipo:</strong>
                      <span>{selectedRental.propertyType}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Área:</strong>
                      <span>{selectedRental.area}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Quartos:</strong>
                      <span>{selectedRental.bedrooms}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Banheiros:</strong>
                      <span>{selectedRental.bathrooms}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Informações do Inquilino</h3>
                    <div className="detail-item">
                      <strong>Nome:</strong>
                      <span>{selectedRental.tenant}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Telefone:</strong>
                      <span>{selectedRental.tenantPhone}</span>
                    </div>
                    <div className="detail-item">
                      <strong>E-mail:</strong>
                      <span>{selectedRental.tenantEmail}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Informações Financeiras</h3>
                    <div className="detail-item">
                      <strong>Aluguel Mensal:</strong>
                      <span className="price">{formatCurrency(selectedRental.monthlyRent)}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Caução:</strong>
                      <span>{formatCurrency(selectedRental.deposit)}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Período:</strong>
                      <span>{formatDate(selectedRental.startDate)} - {formatDate(selectedRental.endDate)}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Status:</strong>
                      <span className={`status-badge ${getStatusColor(selectedRental.status)}`}>
                        {getStatusIcon(selectedRental.status)}
                        {getStatusText(selectedRental.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedRental.description && (
                  <div className="detail-section">
                    <h3>Descrição</h3>
                    <p>{selectedRental.description}</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fechar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditRental(selectedRental);
                  }}
                >
                  Editar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalManagement; 