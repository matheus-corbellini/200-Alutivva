"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { useLocation } from "react-router-dom";
import {
  MdMenu,
  MdClose,
  MdShoppingCart,
  MdTerrain,
  MdPerson,
  MdLogout,
  MdAttachMoney,
} from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import "./Sidebar.css";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
};

const menuItems: MenuItem[] = [
  {
    id: "marketplace",
    label: "Marketplace",
    icon: <MdShoppingCart />,
    path: "/marketplace",
  },
  {
    id: "registro-terrenos",
    label: "Registro de terrenos",
    icon: <MdTerrain />,
    path: "/registro-terrenos",
  },
  {
    id: "gestao-pessoal",
    label: "Gestão Pessoal",
    icon: <MdPerson />,
    path: "/gestao-pessoal",
  },
  {
    id: "gestao-alugueis",
    label: "Gestão de alugueis",
    icon: <MdAttachMoney />,
    path: "/gestao-alugueis",
    badge: 3,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, firebaseUser, logout } = useAuth();
  const { goToLandingPage } = useAppNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    goToLandingPage();
  };

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

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {isMobile && (
        <div
          className={`sidebar-overlay ${isOpen ? "open" : ""}`}
          onClick={onToggle}
        />
      )}

      <aside className={`sidebar-container ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src="/log.png" alt="Alutivva" className="sidebar-logo" />
          <h2 className="sidebar-title">Alutivva</h2>
          <p className="sidebar-subtitle">Plataforma de Investimentos</p>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Menu Principal</h3>
            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.id} className="sidebar-menu-item">
                  <a
                    href={item.path}
                    className={`sidebar-menu-link ${
                      isActiveRoute(item.path) ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(`Navegando para: ${item.path}`);
                      if (isMobile) {
                        onToggle();
                      }
                    }}
                  >
                    <span className="sidebar-menu-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="sidebar-badge">{item.badge}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">{getUserInitials()}</div>
            <div className="sidebar-user-details">
              <p className="sidebar-user-name">
                {user?.name || firebaseUser?.email || "Usuário"}
              </p>
              <p className="sidebar-user-role">{getRoleLabel()}</p>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <MdLogout />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export const SidebarToggle: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
}> = ({ isOpen, onToggle }) => {
  return (
    <button
      className={`sidebar-toggle-btn ${isOpen ? "with-sidebar" : ""}`}
      onClick={onToggle}
      aria-label="Toggle Sidebar"
    >
      {isOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
    </button>
  );
};
