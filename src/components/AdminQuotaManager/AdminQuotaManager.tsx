import React, { useEffect, useState } from "react";
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

import { listQuotas, updateQuota, deleteQuota, type QuotaRecord } from "../../services/QuotasService";

type Quota = QuotaRecord;

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
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await listQuotas(projectId);
        setQuotas(data);
      } catch (e) {
        console.error("Erro ao carregar cotas:", e);
        setError("Não foi possível carregar as cotas.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

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

  const handleDeleteQuota = async (quotaId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta cota?")) return;
    try {
      await deleteQuota(quotaId);
      setQuotas(prev => prev.filter(q => q.id !== quotaId));
      onQuotaDelete?.(quotaId);
    } catch (e) {
      console.error("Erro ao excluir cota:", e);
      setError("Não foi possível excluir a cota.");
    }
  };

  const handleStatusChange = async (quotaId: string, newStatus: Quota["status"]) => {
    try {
      await updateQuota(quotaId, { status: newStatus });
      setQuotas(prev =>
        prev.map(quota =>
          quota.id === quotaId
            ? { ...quota, status: newStatus }
            : quota
        )
      );
      onQuotaUpdate?.(quotaId, { status: newStatus });
    } catch (e) {
      console.error("Erro ao atualizar status da cota:", e);
      setError("Não foi possível atualizar o status.");
    }
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

      {error && <div className="error-box">{error}</div>}

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
            {loading ? (
              <tr><td colSpan={9}>Carregando...</td></tr>
            ) : (
              filteredQuotas.map(quota => (
                <tr key={quota.id}>
                  <td>
                    <strong>{quota.quotaNumber}</strong>
                  </td>
                  <td>{quota.projectTitle}</td>
                  <td>{formatCurrency(quota.value)}</td>
                  <td>
                    {(() => {
                      const text = getStatusText(quota.status);
                      return text ? (
                        <span className={`quota-status-badge ${getStatusColor(quota.status)}`}>
                          {text}
                        </span>
                      ) : null;
                    })()}
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
              ))
            )}
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
                x
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
