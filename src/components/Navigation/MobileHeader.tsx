import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { 
  MdNotifications,
  MdSettings,
  MdLogout,
  MdClose,
  MdTerrain,
  MdHistory
} from "react-icons/md";
import "./MobileHeader.css";

const MobileHeader: React.FC = () => {
  const { user, firebaseUser, logout } = useAuth();
  const { goToPersonalManagement, goToHome } = useAppNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    if (firebaseUser?.email) {
      return firebaseUser.email[0].toUpperCase();
    }
    return "U";
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "investor":
        return "Investidor";
      case "landowner":
        return "Proprietário";
      case "entrepreneur":
        return "Empreendedor";
      case "admin":
        return "Administrador";
      default:
        return "Usuário";
    }
  };

  const handleLogout = async () => {
    await logout();
    goToHome();
    setIsMenuOpen(false);
  };

  const handleSettings = () => {
    goToPersonalManagement();
    setIsMenuOpen(false);
  };

  // Itens secundários do menu (não estão na bottom nav)
  const getSecondaryMenuItems = () => {
    const items = [];

    if (user?.role === "landowner" || user?.role === "admin") {
      items.push({
        id: "registro-terrenos",
        label: "Cadastrar Terreno",
        icon: <MdTerrain size={20} />,
        path: "/registro-terrenos",
      });
    }

    if (user?.role === "investor" || user?.role === "admin") {
      items.push({
        id: "documentos",
        label: "Documentos",
        icon: <MdHistory size={20} />,
        path: "/documentos",
      }, {
        id: "notificacoes",
        label: "Notificações",
        icon: <MdNotifications size={20} />,
        path: "/notificacoes",
      });
    }

    return items;
  };

  const secondaryItems = getSecondaryMenuItems();

  return (
    <>
      <header className="mobile-header">
        <div className="mobile-header-container">
          {/* Logo */}
          <div className="mobile-header-logo">
            <img src="/logo.png" alt="Alutivva" />
          </div>

          {/* Título dinâmico baseado na página */}
          <div className="mobile-header-title">
            <h1>Alutivva</h1>
            <span>{getRoleLabel()}</span>
          </div>

          {/* Avatar e Menu */}
          <div className="mobile-header-actions">
            <button className="mobile-header-notifications">
              <MdNotifications size={24} />
              <span className="notification-badge">3</span>
            </button>
            
            <button 
              className="mobile-header-avatar"
              onClick={() => setIsMenuOpen(true)}
            >
              {getUserInitials()}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Menu */}
      <div className={`mobile-drawer-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-overlay-bg" onClick={() => setIsMenuOpen(false)} />
        
        <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-user">
              <div className="mobile-drawer-avatar">
                {getUserInitials()}
              </div>
              <div className="mobile-drawer-user-info">
                <p className="mobile-drawer-user-name">
                  {user?.name || firebaseUser?.email || "Usuário"}
                </p>
                <p className="mobile-drawer-user-role">
                  {getRoleLabel()}
                </p>
              </div>
            </div>
            
            <button 
              className="mobile-drawer-close"
              onClick={() => setIsMenuOpen(false)}
            >
              <MdClose size={24} />
            </button>
          </div>

          <div className="mobile-drawer-content">
            {/* Itens secundários */}
            {secondaryItems.length > 0 && (
              <div className="mobile-drawer-section">
                <h3>Mais Opções</h3>
                <ul className="mobile-drawer-menu">
                  {secondaryItems.map((item) => (
                    <li key={item.id}>
                      <a 
                        href={item.path}
                        className="mobile-drawer-menu-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ações principais */}
            <div className="mobile-drawer-section">
              <h3>Conta</h3>
              <ul className="mobile-drawer-menu">
                <li>
                  <button 
                    className="mobile-drawer-menu-item"
                    onClick={handleSettings}
                  >
                    <MdSettings size={20} />
                    <span>Configurações</span>
                  </button>
                </li>
                <li>
                  <button 
                    className="mobile-drawer-menu-item logout"
                    onClick={handleLogout}
                  >
                    <MdLogout size={20} />
                    <span>Sair</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
