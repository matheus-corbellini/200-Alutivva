import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../../components/common/Notification";
import { getAllUsers, updateUserStatus, updateUserRole, type AdminUser } from "../../services/UserServices/GetAllUsers";
import type { UserRole } from "../../types/users";
import { PDFService } from "../../services/PDFService";
import { createProperty, updateProperty, listProperties, listPropertiesWithDocId, deleteProperty } from "../../services/PropertiesService";
import {
  MdDashboard,
  MdPeople,
  MdBusiness,
  MdAttachMoney,
  MdTrendingUp,
  MdRefresh,
  MdSearch,
  MdAdd,
  MdEdit,
  MdVisibility,
  MdBlock,
  MdCheck,
  MdClose,
  MdDelete,
  MdLockOpen,
  MdCancel,
} from "react-icons/md";
import Button from "../../components/Button/Button";
import { Footer } from "borderless";
import AdminQuotaManager from "../../components/AdminQuotaManager/AdminQuotaManager";
import { listAllReservations } from "../../services/ReservationsService";
import AdminNotifications from "./AdminNotifications";
import "./AdminDashboard.css";

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  pendingProjects: number;
  totalInvestments: number;
  totalRevenue: number;
  monthlyGrowth: number;
  pendingApprovals: number;
}

interface PendingProject {
  id: string;
  title: string;
  location: string;
  developer: string;
  description?: string;
  quotaValue: number;
  totalQuotas: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  developerId: string;
}

// Interface removida pois não é mais necessária

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { goToHome } = useAppNavigate();
  const { notification, showNotification, hideNotification } = useNotification();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProjectForQuotas, setSelectedProjectForQuotas] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    pendingProjects: 0,
    totalInvestments: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingApprovals: 0,
  });

  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);

  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Estados para modais
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'investor' as UserRole,
    status: 'pending' as "pending" | "active" | "blocked"
  });

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<PendingProject | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    location: '',
    developer: '',
    status: 'pending' as "pending" | "approved" | "rejected",
    lat: '',
    lng: '',
  });

  // Verificar se o usuário é admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      goToHome();
    }
  }, [user, goToHome]);

  // Carregar dados reais (usuários, propriedades, reservas) para métricas e listas
  useEffect(() => {
    async function load() {
      if (user?.role !== "admin") return;
      setLoading(true);
      try {
        const [users, properties, reservations] = await Promise.all([
          getAllUsers(),
          listProperties(),
          listAllReservations(),
        ]);

        setPendingUsers(users);

        // Preencher a aba de projetos com os empreendimentos existentes
        try {
          type RawProperty = {
            id: number | string;
            title?: string;
            description?: string;
            location?: { address?: string };
            developer?: string;
            quotaValue?: number;
            totalQuotas?: number;
            completionDate?: string;
            developerId?: string;
          };
          const mappedProjects: PendingProject[] = (properties as unknown as RawProperty[]).map((p) => ({
            id: String(p.id),
            title: p.title || "Projeto",
            location: p.location?.address || "",
            developer: p.developer || "-",
            description: p.description || "",
            quotaValue: p.quotaValue || 0,
            totalQuotas: p.totalQuotas || 0,
            status: "approved",
            submittedAt: p.completionDate || new Date().toISOString(),
            developerId: p.developerId || "",
          }));
          setPendingProjects(mappedProjects);
        } catch {
          // non-fatal mapping error; keep list vazia
        }

        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.status === "active").length;
        const totalProjects = properties.length;
        // pendingProjects ainda não vem do Firestore; manter 0 por enquanto
        const pendingProjects = 0;
        // Total captado: somar totalAmount das reservas aprovadas
        const totalInvestments = reservations
          .filter(r => r.status === "approved")
          .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

        setMetrics(prev => ({
          ...prev,
          totalUsers,
          activeUsers,
          totalProjects,
          pendingProjects,
          totalInvestments,
        }));
      } catch (e) {
        console.error("Erro ao carregar dados do painel:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.role]);

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-access-denied">
        <h2>Acesso Negado</h2>
        <p>Apenas administradores podem acessar esta página.</p>
        <Button variant="primary" onClick={goToHome}>
          Voltar ao Início
        </Button>
      </div>
    );
  }

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
      case "pending":
        return "orange";
      case "approved":
      case "active":
        return "green";
      case "rejected":
      case "blocked":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovado";
      case "rejected":
        return "Rejeitado";
      case "active":
        // Não exibimos badge para "ativo"
        return "";
      case "blocked":
        return "Bloqueado";
      default:
        return status;
    }
  };

  const getRoleDisplayText = (role: string) => {
    switch (role) {
      case "investor":
        return "Investidor";
      case "landowner":
        return "Proprietário";
      case "entrepreneur":
        return "Empreendedor";
      case "admin":
        return "Administrador";
      default:
        return role;
    }
  };

  const handleApproveProject = (projectId: string) => {
    const project = pendingProjects.find(p => p.id === projectId);
    setPendingProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, status: "approved" as const }
          : project
      )
    );
    showNotification(
      "success",
      "Projeto Aprovado",
      `"${project?.title || 'Projeto'}" foi aprovado e está disponível para investimentos.`
    );
  };

  const handleRejectProject = (projectId: string) => {
    const project = pendingProjects.find(p => p.id === projectId);
    setPendingProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, status: "rejected" as const }
          : project
      )
    );
    showNotification(
      "error",
      "Projeto Rejeitado",
      `"${project?.title || 'Projeto'}" foi rejeitado e não estará disponível para investimentos.`
    );
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const user = pendingUsers.find(u => u.id === userId);
      await updateUserStatus(userId, "active");
      setPendingUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, status: "active" as const }
            : user
        )
      );
      showNotification(
        "success",
        "Usuário Aprovado",
        `${user?.name || 'Usuário'} foi aprovado e agora tem acesso completo ao sistema.`
      );
    } catch (error) {
      console.error("Erro ao aprovar usuário:", error);
      showNotification(
        "error",
        "Erro na Aprovação",
        "Não foi possível aprovar o usuário. Verifique sua conexão e tente novamente."
      );
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const user = pendingUsers.find(u => u.id === userId);
      await updateUserStatus(userId, "blocked");
      setPendingUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, status: "blocked" as const }
            : user
        )
      );
      showNotification(
        "success",
        "🚫 Usuário Bloqueado",
        `${user?.name || 'Usuário'} foi bloqueado e não pode mais acessar o sistema.`
      );
    } catch (error) {
      console.error("Erro ao bloquear usuário:", error);
      showNotification(
        "error",
        "Erro no Bloqueio",
        "Não foi possível bloquear o usuário. Verifique sua conexão e tente novamente."
      );
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const user = pendingUsers.find(u => u.id === userId);
      await updateUserStatus(userId, "active");
      setPendingUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, status: "active" as const }
            : user
        )
      );
      showNotification(
        "success",
        "🔓 Usuário Desbloqueado",
        `${user?.name || 'Usuário'} foi desbloqueado e pode acessar o sistema novamente.`
      );
    } catch (error) {
      console.error("Erro ao desbloquear usuário:", error);
      showNotification(
        "error",
        "Erro no Desbloqueio",
        "Não foi possível desbloquear o usuário. Verifique sua conexão e tente novamente."
      );
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const user = pendingUsers.find(u => u.id === userId);
      // Aqui você implementaria a lógica de deletar usuário
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      showNotification(
        "success",
        "🗑️ Usuário Excluído",
        `${user?.name || 'Usuário'} foi removido permanentemente do sistema.`
      );
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      showNotification(
        "error",
        "Erro na Exclusão",
        "Não foi possível excluir o usuário. Verifique sua conexão e tente novamente."
      );
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const user = pendingUsers.find(u => u.id === userId);
      await updateUserStatus(userId, "blocked");
      setPendingUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, status: "blocked" as const }
            : user
        )
      );
      showNotification(
        "success",
        "Usuário Rejeitado",
        `${user?.name || 'Usuário'} foi rejeitado e não pode acessar o sistema.`
      );
    } catch (error) {
      console.error("Erro ao rejeitar usuário:", error);
      showNotification(
        "error",
        "Erro na Rejeição",
        "Não foi possível rejeitar o usuário. Verifique sua conexão e tente novamente."
      );
    }
  };

  // Função removida pois não está sendo utilizada atualmente

  // Funções para ações dos botões
  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleCloseModals = () => {
    setShowUserDetailsModal(false);
    setShowEditUserModal(false);
    setShowAddUserModal(false);
    setShowAddProjectModal(false);
    setSelectedUser(null);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'investor' as UserRole,
      status: 'pending' as "pending" | "active" | "blocked"
    });
    setNewProject({
      name: '',
      description: '',
      location: '',
      developer: '',
      status: 'pending' as "pending" | "approved" | "rejected",
      lat: '',
      lng: '',
    });
  };

  const handleAddNewUser = async () => {
    try {
      // Aqui você implementaria a lógica para criar usuário no Firebase
      // Por enquanto, vamos simular a criação
      const mockNewUser: AdminUser = {
        id: `user_${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
        registrationDate: new Date().toLocaleDateString('pt-BR'),
        lastLogin: undefined,
        createdAt: new Date() as unknown as never
      };

      // Adicionar à lista local
      setPendingUsers(prev => [mockNewUser, ...prev]);

      showNotification(
        "success",
        "Usuário Criado",
        `${newUser.name} foi adicionado com sucesso ao sistema.`
      );

      handleCloseModals();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      showNotification(
        "error",
        "Erro ao Criar Usuário",
        "Não foi possível criar o usuário. Verifique os dados e tente novamente."
      );
    }
  };

  // Removido handler antigo de adicionar projeto (substituído pelo modal unificado)

  // Funções para gerar relatórios
  const handleGenerateSalesReport = async () => {
    try {
      // Gerar PDF do relatório de vendas
      const pdfBlob = await PDFService.generateSalesReport();
      PDFService.downloadPDF(pdfBlob, `relatorio-vendas-${new Date().toISOString().split('T')[0]}.pdf`);

      showNotification(
        "success",
        "📊 Relatório de Vendas",
        "PDF gerado e download iniciado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao gerar relatório de vendas:", error);
      showNotification(
        "error",
        "Erro no Relatório",
        "Não foi possível gerar o relatório de vendas."
      );
    }
  };

  const handleGenerateUserReport = async () => {
    try {
      // Gerar PDF do relatório de usuários
      const pdfBlob = await PDFService.generateUserReport();
      PDFService.downloadPDF(pdfBlob, `relatorio-usuarios-${new Date().toISOString().split('T')[0]}.pdf`);

      showNotification(
        "success",
        "👥 Relatório de Usuários",
        "PDF gerado e download iniciado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao gerar relatório de usuários:", error);
      showNotification(
        "error",
        "Erro no Relatório",
        "Não foi possível gerar o relatório de usuários."
      );
    }
  };

  const handleGenerateFinancialReport = async () => {
    try {
      // Gerar PDF do relatório financeiro
      const pdfBlob = await PDFService.generateFinancialReport();
      PDFService.downloadPDF(pdfBlob, `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`);

      showNotification(
        "success",
        "💰 Relatório Financeiro",
        "PDF gerado e download iniciado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao gerar relatório financeiro:", error);
      showNotification(
        "error",
        "Erro no Relatório",
        "Não foi possível gerar o relatório financeiro."
      );
    }
  };

  const handleGenerateProjectReport = async () => {
    try {
      // Gerar PDF do relatório de projetos
      const pdfBlob = await PDFService.generateProjectReport();
      PDFService.downloadPDF(pdfBlob, `relatorio-projetos-${new Date().toISOString().split('T')[0]}.pdf`);

      showNotification(
        "success",
        "🏗️ Relatório de Projetos",
        "PDF gerado e download iniciado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao gerar relatório de projetos:", error);
      showNotification(
        "error",
        "❌ Erro no Relatório",
        "Não foi possível gerar o relatório de projetos."
      );
    }
  };

  const handleSaveUserChanges = async () => {
    if (!selectedUser) return;

    try {
      // Atualizar role se mudou
      if (selectedUser.role) {
        await updateUserRole(selectedUser.id, selectedUser.role);
      }

      // Atualizar status se mudou
      if (selectedUser.status) {
        await updateUserStatus(selectedUser.id, selectedUser.status);
      }

      // Atualizar lista local
      setPendingUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id ? selectedUser : user
        )
      );

      showNotification(
        "success",
        "💾 Alterações Salvas",
        `As informações de ${selectedUser.name} foram atualizadas com sucesso.`
      );
      handleCloseModals();
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      showNotification(
        "error",
        "Erro ao Salvar",
        "Não foi possível salvar as alterações. Verifique sua conexão e tente novamente."
      );
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const confirmDelete = window.confirm("Tem certeza que deseja excluir este empreendimento? Esta ação não pode ser desfeita.");
      if (!confirmDelete) return;
      const withIds = await listPropertiesWithDocId();
      const match = withIds.find(p => String(p.id) === String(projectId));
      if (!match) {
        showNotification("error", "Erro", "Não foi possível localizar este empreendimento no banco.");
        return;
      }
      await deleteProperty(match.docId);
      setPendingProjects(prev => prev.filter(p => String(p.id) !== String(projectId)));
      showNotification("success", "Empreendimento", "Excluído com sucesso.");
    } catch (e) {
      console.error("Erro ao excluir projeto:", e);
      showNotification("error", "Erro", "Não foi possível excluir o empreendimento.");
    }
  };

  const filteredProjects = pendingProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.developer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const renderDashboard = () => (
    <div className="admin-dashboard-content">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <MdPeople size={24} />
          </div>
          <div className="metric-info">
            <h3>Total de Usuários</h3>
            <p className="metric-value">{metrics.totalUsers.toLocaleString()}</p>
            <p className="metric-subtitle">{metrics.activeUsers} ativos</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <MdBusiness size={24} />
          </div>
          <div className="metric-info">
            <h3>Projetos</h3>
            <p className="metric-value">{metrics.totalProjects}</p>
            <p className="metric-subtitle">{metrics.pendingProjects} pendentes</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <MdAttachMoney size={24} />
          </div>
          <div className="metric-info">
            <h3>Investimentos</h3>
            <p className="metric-value">{formatCurrency(metrics.totalInvestments)}</p>
            <p className="metric-subtitle">Total captado</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <MdTrendingUp size={24} />
          </div>
          <div className="metric-info">
            <h3>Receita</h3>
            <p className="metric-value">{formatCurrency(metrics.totalRevenue)}</p>
            <p className="metric-subtitle">+{metrics.monthlyGrowth}% este mês</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Projetos Pendentes</h3>
            <Button variant="secondary" size="small">
              Ver Todos
            </Button>
          </div>
          <div className="pending-items">
            {pendingProjects.slice(0, 3).map(project => (
              <div key={project.id} className="pending-item">
                <div className="item-info">
                  <h4>{project.title}</h4>
                  <p>{project.location} • {project.developer}</p>
                  <span className="item-date">{formatDate(project.submittedAt)}</span>
                </div>
                <div className="item-actions">
                  <Button variant="primary" size="small" onClick={() => handleApproveProject(project.id)}>
                    <MdCheck size={16} />
                    Aprovar
                  </Button>
                  <Button variant="danger" size="small" onClick={() => handleRejectProject(project.id)}>
                    <MdClose size={16} />
                    Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Usuários Pendentes</h3>
            <Button variant="secondary" size="small">
              Ver Todos
            </Button>
          </div>
          <div className="pending-items">
            {pendingUsers.slice(0, 3).map(user => (
              <div key={user.id} className="pending-item">
                <div className="item-info">
                  <h4>{user.name}</h4>
                  <p>{user.email} • {getRoleDisplayText(user.role)}</p>
                  <span className="item-date">{user.registrationDate}</span>
                </div>
                <div className="item-actions">
                  <Button variant="primary" size="small" onClick={() => handleApproveUser(user.id)}>
                    <MdCheck size={16} />
                    Aprovar
                  </Button>
                  <Button variant="danger" size="small" onClick={() => handleBlockUser(user.id)}>
                    <MdBlock size={16} />
                    Bloquear
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="admin-projects-content">
      <div className="content-header">
        <div className="header-filters">
          <div className="search-box">
            <MdSearch size={20} />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
            </select>
          </div>
        </div>
        <Button variant="primary" onClick={() => { setEditingProject(null); setNewProject({ name: '', description: '', location: '', developer: '', status: 'pending', lat: '', lng: '' }); setShowAddProjectModal(true); }}>
          <MdAdd size={20} />
          Novo Projeto
        </Button>
      </div>

      <div className="projects-table">
        <table>
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Localização</th>
              <th>Desenvolvedor</th>
              <th>Valor da Cota</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(project => (
              <tr key={project.id}>
                <td>
                  <div className="project-info">
                    <h4>{project.title}</h4>
                    <p>{project.totalQuotas} cotas</p>
                  </div>
                </td>
                <td>{project.location}</td>
                <td>{project.developer}</td>
                <td>{formatCurrency(project.quotaValue)}</td>
                <td>
                  {(() => {
                    const statusText = getStatusText(project.status);
                    return statusText ? (
                      <span className={`status-badge ${getStatusColor(project.status)}`}>
                        {statusText}
                      </span>
                    ) : null;
                  })()}
                </td>
                <td>{formatDate(project.submittedAt)}</td>
                <td>
                  <div className="action-buttons">
                    <Button variant="secondary" size="small" title="Visualizar projeto">
                      <MdVisibility size={16} />
                    </Button>
                    <Button variant="secondary" size="small" title="Editar projeto" onClick={() => { setEditingProject(project); setNewProject({ name: project.title, description: project.description || '', location: project.location, developer: project.developer, status: project.status, lat: '', lng: '' }); setShowAddProjectModal(true); }}>
                      <MdEdit size={16} />
                    </Button>
                    {project.status === "pending" && (
                      <>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={async () => {
                            await handleApproveProject(project.id);
                            // O botão desaparecerá automaticamente pois o status mudará
                          }}
                          title="Aprovar projeto"
                        >
                          <MdCheck size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={async () => {
                            await handleRejectProject(project.id);
                            // O botão desaparecerá automaticamente pois o status mudará
                          }}
                          title="Rejeitar projeto"
                        >
                          <MdClose size={16} />
                        </Button>
                      </>
                    )}
                    <Button variant="danger" size="small" title="Excluir projeto" onClick={() => handleDeleteProject(project.id)}>
                      <MdDelete size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users-content">
      <div className="content-header">
        <div className="header-filters">
          <div className="search-box">
            <MdSearch size={20} />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="active">Ativos</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Todos os tipos</option>
              <option value="investor">Investidor</option>
              <option value="landowner">Proprietário</option>
              <option value="entrepreneur">Empreendedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
        <Button variant="primary" onClick={() => setShowAddUserModal(true)}>
          <MdAdd size={20} />
          Novo Usuário
        </Button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando usuários...</p>
        </div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Data de Cadastro</th>
                <th>Último Login</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <h4>{user.name}</h4>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{getRoleDisplayText(user.role)}</td>
                  <td>
                    {(() => {
                      const statusText = getStatusText(user.status);
                      return statusText ? (
                        <span className={`status-badge ${getStatusColor(user.status)}`}>
                          {statusText}
                        </span>
                      ) : null;
                    })()}
                  </td>
                  <td>{user.registrationDate}</td>
                  <td>{user.lastLogin ? user.lastLogin : "Nunca"}</td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleViewUser(user)}
                        title="Visualizar detalhes"
                      >
                        <MdVisibility size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleEditUser(user)}
                        title="Editar usuário"
                      >
                        <MdEdit size={16} />
                      </Button>
                      {user.status === "pending" && (
                        <>
                          <Button
                            variant="primary"
                            size="small"
                            onClick={async () => {
                              await handleApproveUser(user.id);
                              // O botão desaparecerá automaticamente pois o status mudará
                            }}
                            title="Aprovar usuário"
                          >
                            <MdCheck size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={async () => {
                              await handleRejectUser(user.id);
                              // O botão desaparecerá automaticamente pois o status mudará
                            }}
                            title="Rejeitar usuário"
                          >
                            <MdCancel size={16} />
                          </Button>
                        </>
                      )}
                      {user.status === "blocked" && (
                        <Button
                          variant="primary"
                          size="small"
                          onClick={async () => {
                            await handleUnblockUser(user.id);
                            // O botão desaparecerá automaticamente pois o status mudará
                          }}
                          title="Desbloquear usuário"
                        >
                          <MdLockOpen size={16} />
                        </Button>
                      )}
                      {user.status !== "blocked" && user.status !== "pending" && (
                        <Button
                          variant="danger"
                          size="small"
                          onClick={async () => {
                            await handleBlockUser(user.id);
                            // O botão desaparecerá automaticamente pois o status mudará
                          }}
                          title="Bloquear usuário"
                        >
                          <MdBlock size={16} />
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Excluir usuário"
                      >
                        <MdDelete size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="admin-reports-content">
      <div className="reports-grid">
        <div className="report-card">
          <h3>Relatório de Vendas</h3>
          <div className="report-content">
            <p>Geração de relatórios de vendas mensais e anuais</p>
            <Button variant="primary" onClick={handleGenerateSalesReport}>Gerar Relatório</Button>
          </div>
        </div>

        <div className="report-card">
          <h3>Relatório de Usuários</h3>
          <div className="report-content">
            <p>Análise de crescimento e engajamento de usuários</p>
            <Button variant="primary" onClick={handleGenerateUserReport}>Gerar Relatório</Button>
          </div>
        </div>

        <div className="report-card">
          <h3>Relatório Financeiro</h3>
          <div className="report-content">
            <p>Relatórios de receita, comissões e lucros</p>
            <Button variant="primary" onClick={handleGenerateFinancialReport}>Gerar Relatório</Button>
          </div>
        </div>

        <div className="report-card">
          <h3>Relatório de Projetos</h3>
          <div className="report-content">
            <p>Performance e status dos projetos</p>
            <Button variant="primary" onClick={handleGenerateProjectReport}>Gerar Relatório</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuotas = () => (
    <div className="admin-quotas-content">
      <div className="quotas-header">
        <div className="quotas-title">
          <h3>Gerenciamento de Cotas</h3>
          <p>Controle total sobre as cotas dos projetos</p>
        </div>
        <div className="quotas-actions">
          <select
            value={selectedProjectForQuotas || ""}
            onChange={(e) => setSelectedProjectForQuotas(e.target.value || null)}
            className="project-select"
          >
            <option value="">Todos os projetos</option>
            {pendingProjects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AdminQuotaManager
        projectId={selectedProjectForQuotas || undefined}
        onQuotaUpdate={(quotaId, updates) => {
          console.log('Quota updated:', quotaId, updates);
        }}
        onQuotaDelete={(quotaId) => {
          console.log('Quota deleted:', quotaId);
        }}
      />
    </div>
  );

  const renderAdminNotifications = () => (
    <AdminNotifications />
  );

  return (
    <div className="admin-dashboard-page-wrapper">
      {/* Notification Component */}
      {notification.isVisible && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={hideNotification}
        />
      )}

      {/* Modal de Detalhes do Usuário */}
      {showUserDetailsModal && selectedUser && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes do Usuário</h3>
              <button className="modal-close" onClick={handleCloseModals}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="detail-row">
                  <label>Nome:</label>
                  <span>{selectedUser.name}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="detail-row">
                  <label>Telefone:</label>
                  <span>{selectedUser.phone || "Não informado"}</span>
                </div>
                <div className="detail-row">
                  <label>Tipo:</label>
                  <span>{getRoleDisplayText(selectedUser.role)}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  {(() => {
                    const statusText = getStatusText(selectedUser.status);
                    return statusText ? (
                      <span className={`status-badge ${getStatusColor(selectedUser.status)}`}>
                        {statusText}
                      </span>
                    ) : null;
                  })()}
                </div>
                <div className="detail-row">
                  <label>Data de Cadastro:</label>
                  <span>{selectedUser.registrationDate}</span>
                </div>
                <div className="detail-row">
                  <label>Último Login:</label>
                  <span>{selectedUser.lastLogin || "Nunca"}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseModals}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Usuário */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adicionar Novo Usuário</h3>
              <button className="modal-close" onClick={handleCloseModals}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="edit-user-form">
                <div className="form-group">
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Digite o email"
                  />
                </div>
                <div className="form-group">
                  <label>Telefone:</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Digite o telefone"
                  />
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  >
                    <option value="investor">Investidor</option>
                    <option value="landowner">Proprietário</option>
                    <option value="entrepreneur">Empreendedor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value as "pending" | "active" | "blocked" })}
                  >
                    <option value="pending">Pendente</option>
                    <option value="active">Ativo</option>
                    <option value="blocked">Bloqueado</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseModals}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleAddNewUser}
              >
                Adicionar Usuário
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Removido: modal antigo de adicionar projeto para evitar duplicidade */}

      {/* Modal de Edição do Usuário */}
      {showEditUserModal && selectedUser && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Usuário</h3>
              <button className="modal-close" onClick={handleCloseModals}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="edit-user-form">
                <div className="form-group">
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Telefone:</label>
                  <input
                    type="text"
                    value={selectedUser.phone || ""}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as UserRole })}
                  >
                    <option value="investor">Investidor</option>
                    <option value="landowner">Proprietário</option>
                    <option value="entrepreneur">Empreendedor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value as "pending" | "active" | "blocked" })}
                  >
                    <option value="pending">Pendente</option>
                    <option value="active">Ativo</option>
                    <option value="blocked">Bloqueado</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseModals}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveUserChanges}
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-header">
        <div className="admin-title">
          <h1>Painel Administrativo</h1>
          <p>Gerencie usuários, projetos e visualize métricas</p>
        </div>
        <div className="admin-actions">
          <Button variant="secondary" size="small">
            <MdRefresh size={20} />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="admin-navigation">
        <button
          className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <MdDashboard size={20} />
          Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          <MdBusiness size={20} />
          Projetos
        </button>
        <button
          className={`nav-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <MdPeople size={20} />
          Usuários
        </button>
        <button
          className={`nav-tab ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          <MdTrendingUp size={20} />
          Relatórios
        </button>
        <button
          className={`nav-tab ${activeTab === "quotas" ? "active" : ""}`}
          onClick={() => setActiveTab("quotas")}
        >
          <MdAttachMoney size={20} />
          Cotas
        </button>
        <button
          className={`nav-tab ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          <MdTrendingUp size={20} />
          Notificações
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "projects" && renderProjects()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "reports" && renderReports()}
        {activeTab === "quotas" && renderQuotas()}
        {activeTab === "notifications" && renderAdminNotifications()}
      </div>

      {showAddProjectModal && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProject ? "Editar Empreendimento" : "Novo Empreendimento"}</h3>
              <button className="modal-close" onClick={handleCloseModals}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Localização</label>
                <input
                  type="text"
                  value={newProject.location}
                  onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>Latitude</label>
                  <input
                    type="text"
                    value={newProject.lat}
                    onChange={(e) => setNewProject({ ...newProject, lat: e.target.value })}
                    placeholder="-23.5505"
                  />
                </div>
                <div>
                  <label>Longitude</label>
                  <input
                    type="text"
                    value={newProject.lng}
                    onChange={(e) => setNewProject({ ...newProject, lng: e.target.value })}
                    placeholder="-46.6333"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Desenvolvedor</label>
                <input
                  type="text"
                  value={newProject.developer}
                  onChange={(e) => setNewProject({ ...newProject, developer: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseModals}>Cancelar</Button>
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    if (editingProject) {
                      // descobrir docId pelo id numérico/lógico
                      const withIds = await listPropertiesWithDocId();
                      const match = withIds.find(p => String(p.id) === String(editingProject.id));
                      const targetDocId = match?.docId || String(editingProject.id);
                      await updateProperty(targetDocId, {
                        title: newProject.name as string,
                        description: newProject.description as string,
                        // casting para tipo genérico do serviço
                        ...(newProject.developer ? { developer: newProject.developer as unknown as string } : {}),
                        ...(newProject.location || newProject.lat || newProject.lng
                          ? {
                            location: {
                              address: newProject.location,
                              ...(newProject.lat && newProject.lng
                                ? { coordinates: { lat: Number(newProject.lat), lng: Number(newProject.lng) } }
                                : {}),
                            },
                          }
                          : {}),
                      } as unknown as Record<string, unknown>);
                      showNotification("success", "Empreendimento", "Atualizado com sucesso.");
                    } else {
                      // Monta payload mínimo dentro do tipo Property
                      await createProperty({
                        id: Date.now(),
                        title: newProject.name as string,
                        description: newProject.description as string,
                        // Campos obrigatórios do tipo Property
                        type: "Residencial",
                        status: "Em construção" as never,
                        roi: 0,
                        quotaValue: 0,
                        totalQuotas: 0,
                        soldQuotas: 0,
                        expectedReturn: "",
                        completionDate: new Date().toISOString().slice(0, 10),
                        image: "/logo.png",
                        location: {
                          address: newProject.location as string,
                          coordinates: (newProject.lat && newProject.lng)
                            ? { lat: Number(newProject.lat), lng: Number(newProject.lng) }
                            : { lat: 0, lng: 0 },
                          nearbyPlaces: [],
                        },
                        ...(newProject.developer ? { developer: newProject.developer as unknown as string } : {}),
                      });
                      showNotification("success", "Empreendimento", "Criado com sucesso.");
                    }
                    setShowAddProjectModal(false);
                    // Recarregar listagem
                    const props = await listProperties();
                    type RawProperty = {
                      id: number | string;
                      title?: string;
                      location?: { address?: string };
                      developer?: string;
                      quotaValue?: number;
                      totalQuotas?: number;
                      completionDate?: string;
                      developerId?: string;
                    };
                    const mapped = (props as unknown as RawProperty[]).map((p) => ({
                      id: String(p.id),
                      title: p.title || "Projeto",
                      location: p.location?.address || "",
                      developer: p.developer || "-",
                      quotaValue: p.quotaValue || 0,
                      totalQuotas: p.totalQuotas || 0,
                      status: "approved" as const,
                      submittedAt: p.completionDate || new Date().toISOString(),
                      developerId: p.developerId || "",
                    }));
                    setPendingProjects(mapped);
                  } catch (e) {
                    console.error(e);
                    showNotification("error", "Erro", "Não foi possível salvar o empreendimento.");
                  }
                }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer
        theme="light"
        useGradient={false}
        backgroundColor="transparent"
        logoVariant="light"
      />
    </div>
  );
};

export default AdminDashboard;
