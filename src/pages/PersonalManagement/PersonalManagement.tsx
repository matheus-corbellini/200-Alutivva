import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import Button from "../../components/Button/Button";
import { Footer } from "borderless";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdPhone,
  MdEdit,
  MdSave,
  MdClose,
  MdVisibility,
  MdVisibilityOff,
  MdLock,
  MdSecurity,
  MdAccountCircle,
  MdLocationOn,
  MdBusiness,
  MdCalendarToday,
  MdVerifiedUser,
  MdWarning
} from "react-icons/md";
import "./PersonalManagement.css";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  company?: string;
  address?: string;
  birthDate?: string;
  documentNumber?: string;
  verified: boolean;
  joinDate: string;
  lastLogin: string;
}

const PersonalManagement: React.FC = () => {
  const { user, firebaseUser, logout } = useAuth();
  const { goToMarketplace } = useAppNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    email: firebaseUser?.email || "",
    phone: "",
    role: user?.role || "investor",
    company: "",
    address: "",
    birthDate: "",
    documentNumber: "",
    verified: false,
    joinDate: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  });

  const [formData, setFormData] = useState<UserProfile>(profile);
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // user já vem do AuthContext a partir de users/{uid}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createdAt = (user?.createdAt as any)?.toDate ? (user?.createdAt as any).toDate() : new Date();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lastLogin = (user as any)?.lastLogin ? new Date((user as any).lastLogin) : new Date();
        const loaded: UserProfile = {
          name: user?.name || firebaseUser?.displayName || "",
          email: user?.email || firebaseUser?.email || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          phone: (user as any)?.phone || "",
          role: user?.role || "investor",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          company: (user as any)?.company || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          address: (user as any)?.address || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          birthDate: (user as any)?.birthDate || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          documentNumber: (user as any)?.documentNumber || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          verified: (user as any)?.verified ?? false,
          joinDate: createdAt.toISOString(),
          lastLogin: lastLogin.toISOString(),
        };
        setProfile(loaded);
        setFormData(loaded);
      } catch (e) {
        console.error("Erro ao carregar perfil do usuário:", e);
        setError("Não foi possível carregar seus dados agora.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    // Aqui você faria a chamada para a API
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    // Aqui você faria a chamada para a API
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    // Aqui você faria a chamada para a API
    setShowDeleteModal(false);
    logout();
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "investor":
        return "Investidor/Cotista";
      case "landowner":
        return "Proprietário de terreno";
      case "entrepreneur":
        return "Empreendedor/Gestor";
      case "admin":
        return "Administrador da plataforma";
      default:
        return "Usuário";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="personal-management-page-wrapper">
      <div className="personal-management-container">
        <div className="personal-management-header">
          <button
            onClick={goToMarketplace}
            className="back-button"
            aria-label="Voltar para empreendimentos"
          >
            <MdArrowBack size={24} />
          </button>
          <h1>Gestão Pessoal</h1>
        </div>

        <div className="personal-management-content">
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                <MdAccountCircle size={80} />
                {profile.verified && (
                  <div className="verified-badge">
                    <MdVerifiedUser size={20} />
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2>{profile.name || ""}</h2>
                <p className="role">{getRoleLabel(profile.role)}</p>
                <p className="email">{profile.email}</p>
                <div className="profile-stats">
                  <div className="stat">
                    <span className="label">Membro desde</span>
                    <span className="value">{formatDate(profile.joinDate)}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Último login</span>
                    <span className="value">{formatDate(profile.lastLogin)}</span>
                  </div>
                </div>
              </div>
              {!isEditing && (
                <Button
                  variant="secondary"
                  onClick={handleEdit}
                  className="edit-button"
                >
                  <MdEdit size={16} />
                  Editar Perfil
                </Button>
              )}
            </div>

            <div className="profile-form">
              <div className="form-section">
                <h3>Informações Pessoais</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome Completo *</label>
                    <div className="input-with-icon fixed-width-input">
                      <MdPerson size={20} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="fixed-width-input-field"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>E-mail *</label>
                    <div className="input-with-icon fixed-width-input">
                      <MdEmail size={20} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="fixed-width-input-field"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Telefone</label>
                    <div className="input-with-icon fixed-width-input">
                      <MdPhone size={20} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="fixed-width-input-field"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Data de Nascimento</label>
                    <div className="input-with-icon fixed-width-input">
                      <MdCalendarToday size={20} />
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        disabled={!isEditing}
                        className="fixed-width-input-field"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>CPF/CNPJ</label>
                    <div className="input-with-icon fixed-width-input">
                      <MdSecurity size={20} />
                      <input
                        type="text"
                        value={formData.documentNumber}
                        onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                        disabled={!isEditing}
                        className="fixed-width-input-field"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Empresa</label>
                    <div className="input-with-icon fixed-width-input">
                      <MdBusiness size={20} />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        disabled={!isEditing}
                        className="fixed-width-input-field"
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Endereço</label>
                    <div className="input-with-icon fixed-width-input">
                      <MdLocationOn size={20} />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                        className="fixed-width-input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                  >
                    <MdSave size={16} />
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="security-section">
            <h3>Segurança</h3>
            <div className="security-actions">
              <Button
                variant="secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                <MdLock size={16} />
                Alterar Senha
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Excluir Conta
              </Button>
            </div>
          </div>
        </div>

        {/* Modal de alteração de senha */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Alterar Senha</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowPasswordModal(false)}
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Senha Atual *</label>
                  <div className="input-with-icon">
                    <MdLock size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Nova Senha *</label>
                  <div className="input-with-icon">
                    <MdLock size={20} />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite a nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="password-toggle"
                    >
                      {showNewPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirmar Nova Senha *</label>
                  <div className="input-with-icon">
                    <MdLock size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme a nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                    >
                      {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePasswordChange}
                >
                  Alterar Senha
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmação de exclusão */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Excluir Conta</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="delete-warning">
                  <div className="warning-header">
                    <MdWarning size={32} className="warning-icon" />
                    <h3>Atenção!</h3>
                  </div>
                  <p>
                    Esta ação é irreversível. Ao excluir sua conta, você perderá:
                  </p>
                  <ul>
                    <li>Todos os seus dados pessoais</li>
                    <li>Histórico de investimentos</li>
                    <li>Acesso à plataforma</li>
                    <li>Configurações salvas</li>
                  </ul>
                  <p>
                    <strong>Tem certeza que deseja excluir sua conta?</strong>
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                >
                  Sim, Excluir Conta
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

export default PersonalManagement; 