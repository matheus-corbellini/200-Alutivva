import React, { useState } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdCheck,
  MdClose,
  MdWarning,
  MdAttachMoney,
  MdTrendingUp,
} from "react-icons/md";
import Button from "../Button/Button";
import "./AdminQuotaManager.css";

interface Quota {
  id: string;
  projectId: string;
  projectTitle: string;
  quotaNumber: string;
  value: number;
  status: "available" | "reserved" | "sold" | "blocked";
  reservedBy?: string;
  reservedAt?: string;
  soldAt?: string;
  soldTo?: string;
  soldValue?: number;
}

interface AdminQuotaManagerProps {
  projectId?: string;
  onQuotaUpdate?: (quotaId: string, updates: Partial<Quota>) => void;
  onQuotaDelete?: (quotaId: string) => void;
}

const AdminQuotaManager: React.FC<AdminQuotaManagerProps> = ({
  projectId,
  onQuotaUpdate,
  onQuotaDelete,
}) => {
  const [quotas, setQuotas] = useState<Quota[]>([
    {
      id: "1",
      projectId: "proj1",
      projectTitle: "Resort Tropical Paradise",
      quotaNumber: "COTA-001",
      value: 50000,
      status: "available",
    },
    {
      id: "2",
      projectId: "proj1",
      projectTitle: "Resort Tropical Paradise",
      quotaNumber: "COTA-002",
      value: 50000,
      status: "reserved",
      reservedBy: "joao.silva@email.com",
      reservedAt: "2024-03-15",
    },
    {
      id: "3",
      projectId: "proj1",
      projectTitle: "Resort Tropical Paradise",
      quotaNumber: "COTA-003",
      value: 50000,
      status: "sold",
      soldTo: "maria.santos@email.com",
      soldAt: "2024-03-10",
      soldValue: 50000,
    },
    {
      id: "4",
      projectId: "proj1",
      projectTitle: "Resort Tropical Paradise",
      quotaNumber: "COTA-004",
      value: 50000,
      status: "blocked",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuota, setEditingQuota] = useState<Quota | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "green";
      case "reserved":
        return "orange";
      case "sold":
        return "blue";
      case "blocked":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponível";
      case "reserved":
        return "Reservada";
      case "sold":
        return "Vendida";
      case "blocked":
        return "Bloqueada";
      default:
        return status;
    }
  };

  const handleAddQuota = () => {
    setShowAddModal(true);
    setEditingQuota(null);
  };

  const handleEditQuota = (quota: Quota) => {
    setEditingQuota(quota);
    setShowAddModal(true);
  };

  const handleDeleteQuota = (quotaId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta cota?")) {
      setQuotas(prev => prev.filter(q => q.id !== quotaId));
      onQuotaDelete?.(quotaId);
    }
  };

  const handleStatusChange = (quotaId: string, newStatus: Quota["status"]) => {
    setQuotas(prev =>
      prev.map(quota =>
        quota.id === quotaId
          ? { ...quota, status: newStatus }
          : quota
      )
    );
    onQuotaUpdate?.(quotaId, { status: newStatus });
  };

  const filteredQuotas = quotas.filter(quota => {
    const matchesProject = !projectId || quota.projectId === projectId;
    const matchesStatus = statusFilter === "all" || quota.status === statusFilter;
    return matchesProject && matchesStatus;
  });

  const getQuotaStats = () => {
    const total = quotas.length;
    const available = quotas.filter(q => q.status === "available").length;
    const reserved = quotas.filter(q => q.status === "reserved").length;
    const sold = quotas.filter(q => q.status === "sold").length;
    const blocked = quotas.filter(q => q.status === "blocked").length;

    return { total, available, reserved, sold, blocked };
  };

  const stats = getQuotaStats();

  return (
    <div className="admin-quota-manager">
      <div className="quota-header">
        <div className="quota-title">
          <h3>Gerenciamento de Cotas</h3>
          <p>Controle total sobre as cotas dos projetos</p>
        </div>
        <Button variant="primary" onClick={handleAddQuota}>
          <MdAdd size={20} />
          Adicionar Cota
        </Button>
      </div>

      <div className="quota-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <MdAttachMoney size={24} />
          </div>
          <div className="stat-info">
            <h4>Total de Cotas</h4>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon available">
            <MdCheck size={24} />
          </div>
          <div className="stat-info">
            <h4>Disponíveis</h4>
            <p>{stats.available}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon reserved">
            <MdWarning size={24} />
          </div>
          <div className="stat-info">
            <h4>Reservadas</h4>
            <p>{stats.reserved}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon sold">
            <MdTrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h4>Vendidas</h4>
            <p>{stats.sold}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blocked">
            <MdClose size={24} />
          </div>
          <div className="stat-info">
            <h4>Bloqueadas</h4>
            <p>{stats.blocked}</p>
          </div>
        </div>
      </div>

      <div className="quota-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="available">Disponíveis</option>
            <option value="reserved">Reservadas</option>
            <option value="sold">Vendidas</option>
            <option value="blocked">Bloqueadas</option>
          </select>
        </div>
      </div>

      <div className="quotas-table">
        <table>
          <thead>
            <tr>
              <th>Número da Cota</th>
              <th>Projeto</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Reservado por</th>
              <th>Data Reserva</th>
              <th>Vendido para</th>
              <th>Data Venda</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotas.map(quota => (
              <tr key={quota.id}>
                <td>
                  <strong>{quota.quotaNumber}</strong>
                </td>
                <td>{quota.projectTitle}</td>
                <td>{formatCurrency(quota.value)}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(quota.status)}`}>
                    {getStatusText(quota.status)}
                  </span>
                </td>
                <td>{quota.reservedBy || "-"}</td>
                <td>{quota.reservedAt ? formatDate(quota.reservedAt) : "-"}</td>
                <td>{quota.soldTo || "-"}</td>
                <td>{quota.soldAt ? formatDate(quota.soldAt) : "-"}</td>
                <td>
                  <div className="action-buttons">
                    <Button variant="secondary" size="small">
                      <MdVisibility size={16} />
                    </Button>
                    <Button variant="secondary" size="small" onClick={() => handleEditQuota(quota)}>
                      <MdEdit size={16} />
                    </Button>
                    <select
                      value={quota.status}
                      onChange={(e) => handleStatusChange(quota.id, e.target.value as Quota["status"])}
                      className="status-select"
                    >
                      <option value="available">Disponível</option>
                      <option value="reserved">Reservada</option>
                      <option value="sold">Vendida</option>
                      <option value="blocked">Bloqueada</option>
                    </select>
                    <Button variant="danger" size="small" onClick={() => handleDeleteQuota(quota.id)}>
                      <MdDelete size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredQuotas.length === 0 && (
        <div className="empty-state">
          <p>Nenhuma cota encontrada com os filtros aplicados.</p>
        </div>
      )}

      {/* Modal para adicionar/editar cota */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingQuota ? "Editar Cota" : "Adicionar Nova Cota"}</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Funcionalidade de adição/edição de cotas será implementada aqui.</p>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary">
                {editingQuota ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotaManager;
