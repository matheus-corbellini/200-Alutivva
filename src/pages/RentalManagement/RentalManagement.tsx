import React, { useState } from "react";
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
  MdLocationOn
} from "react-icons/md";
import Button from "../../components/Button/Button";
import { useRental } from "../../hooks/useRental";
import type { Rental } from "../../types/rental";
import "./RentalManagement.css";

const RentalManagement: React.FC = () => {
  const { rentals, addRental, updateRental, deleteRental } = useRental();

  const [showModal, setShowModal] = useState(false);
  const [editingRental, setEditingRental] = useState<Rental | null>(null);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all");

  const [formData, setFormData] = useState<Partial<Rental>>({
    title: "",
    address: "",
    monthlyRent: 0,
    deposit: 0,
    status: "pending",
    bedrooms: 1,
    bathrooms: 1,
    description: "",
    businessType: "daily_rent",
    dailyRate: 0,
    salePrice: 0,
    amenities: [],
    maxGuests: 2,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    instantBooking: false,
    cleaningFee: 0,
    serviceFee: 0
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);



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
      monthlyRent: 0,
      deposit: 0,
      status: "pending",
      bedrooms: 1,
      bathrooms: 1,
      description: "",
      businessType: "daily_rent",
      dailyRate: 0,
      salePrice: 0,
      amenities: [],
      maxGuests: 2,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      instantBooking: false,
      cleaningFee: 0,
      serviceFee: 0
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

  const handleDeleteRental = (rentalId: string) => {
    deleteRental(rentalId);
  };

  const handleSaveRental = () => {
    if (editingRental) {
      updateRental(editingRental.id, formData);
    } else {
      const newRental: Rental = {
        ...formData,
        id: Date.now().toString()
      } as Rental;
      addRental(newRental);
    }
    setShowModal(false);
    setEditingRental(null);
  };

  const filteredRentals = rentals.filter(rental => {
    const statusMatch = statusFilter === "all" || rental.status === statusFilter as "active" | "pending" | "expired" | "cancelled";
    const businessTypeMatch = businessTypeFilter === "all" || rental.businessType === businessTypeFilter as "daily_rent" | "sale";
    return statusMatch && businessTypeMatch;
  });



  return (
    <div className="rental-management-container">
      <div className="rental-management-header">
        <h1>Gestão de Hospedagem</h1>
        <Button
          variant="primary"
          onClick={handleAddRental}
          className="add-rental-button"
        >
          <MdAdd size={20} />
          Adicionar Propriedade
        </Button>
      </div>

      <div className="rental-management-content">
        <div className="rental-filters-section">
          <div className="filters-row">
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
            <div className="filter-group">
              <label>Tipo de Negócio</label>
              <select
                value={businessTypeFilter}
                onChange={(e) => setBusinessTypeFilter(e.target.value)}
              >
                <option value="all">Todos os tipos</option>
                <option value="daily_rent">Hospedagem</option>
                <option value="sale">Venda</option>
              </select>
            </div>
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



                <div className="rental-summary">
                  <div className="summary-item">
                    <strong>Tipo:</strong>
                    <span>{rental.businessType === "daily_rent" ? "Hospedagem" : "Venda"}</span>
                  </div>
                  <div className="summary-item">
                    <strong>Valor:</strong>
                    <span className="price">
                      {rental.businessType === "daily_rent"
                        ? formatCurrency(rental.dailyRate) + "/noite"
                        : formatCurrency(rental.salePrice || 0)
                      }
                    </span>
                  </div>
                  <div className="summary-item">
                    <strong>Hóspedes:</strong>
                    <span>Até {rental.maxGuests} pessoas</span>
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
            <h2>Nenhuma propriedade encontrada</h2>
            <p>Comece adicionando sua primeira propriedade para hospedagem ou venda.</p>
            <Button variant="primary" onClick={handleAddRental}>
              Adicionar Primeira Propriedade
            </Button>
          </div>
        )}

        {/* Modal para adicionar/editar aluguel */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingRental ? "Editar Propriedade" : "Adicionar Propriedade"}</h2>
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
                    <label>Tipo de Negócio *</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value as "daily_rent" | "sale" })}
                    >
                      <option value="daily_rent">Hospedagem</option>
                      <option value="sale">Venda</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Aluguel Mensal (R$)</label>
                    <input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                      placeholder="0"
                      disabled={formData.businessType === "sale"}
                    />
                  </div>

                  <div className="form-group">
                    <label>Preço de Venda (R$)</label>
                    <input
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                      placeholder="0"
                      disabled={formData.businessType === "daily_rent"}
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

                  <div className="form-group">
                    <label>Diária (R$)</label>
                    <input
                      type="number"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                      placeholder="0"
                      disabled={formData.businessType === "sale"}
                    />
                  </div>

                  <div className="form-group">
                    <label>Taxa de Limpeza (R$)</label>
                    <input
                      type="number"
                      value={formData.cleaningFee}
                      onChange={(e) => setFormData({ ...formData, cleaningFee: Number(e.target.value) })}
                      placeholder="0"
                      disabled={formData.businessType === "sale"}
                    />
                  </div>

                  <div className="form-group">
                    <label>Taxa de Serviço (R$)</label>
                    <input
                      type="number"
                      value={formData.serviceFee}
                      onChange={(e) => setFormData({ ...formData, serviceFee: Number(e.target.value) })}
                      placeholder="0"
                      disabled={formData.businessType === "sale"}
                    />
                  </div>

                  <div className="form-group">
                    <label>Máximo de Hóspedes</label>
                    <input
                      type="number"
                      value={formData.maxGuests}
                      onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
                      min="1"
                      disabled={formData.businessType === "sale"}
                    />
                  </div>

                  <div className="form-group">
                    <label>Check-in</label>
                    <input
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                      disabled={formData.businessType === "sale"}
                    />
                  </div>

                  <div className="form-group">
                    <label>Check-out</label>
                    <input
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                      disabled={formData.businessType === "sale"}
                    />
                  </div>

                  <div className="form-group">
                    <label>Reserva Instantânea</label>
                    <select
                      value={formData.instantBooking ? "true" : "false"}
                      onChange={(e) => setFormData({ ...formData, instantBooking: e.target.value === "true" })}
                      disabled={formData.businessType === "sale"}
                    >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
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
                  {editingRental ? "Salvar" : "Adicionar Propriedade"}
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
                <h2>Detalhes da Propriedade</h2>
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
                      <strong>Quartos:</strong>
                      <span>{selectedRental.bedrooms}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Banheiros:</strong>
                      <span>{selectedRental.bathrooms}</span>
                    </div>
                  </div>



                  <div className="detail-section">
                    <h3>Informações Financeiras</h3>
                    <div className="detail-item">
                      <strong>Tipo de Negócio:</strong>
                      <span>{selectedRental.businessType === "daily_rent" ? "Hospedagem" : "Venda"}</span>
                    </div>
                    {selectedRental.businessType === "daily_rent" ? (
                      <>
                        <div className="detail-item">
                          <strong>Diária:</strong>
                          <span className="price">{formatCurrency(selectedRental.dailyRate)}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Taxa de Limpeza:</strong>
                          <span>{formatCurrency(selectedRental.cleaningFee)}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Taxa de Serviço:</strong>
                          <span>{formatCurrency(selectedRental.serviceFee)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="detail-item">
                        <strong>Preço de Venda:</strong>
                        <span className="price">{formatCurrency(selectedRental.salePrice || 0)}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <strong>Máximo de Hóspedes:</strong>
                      <span>{selectedRental.maxGuests} pessoas</span>
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