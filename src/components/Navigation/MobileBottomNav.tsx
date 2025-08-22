import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  MdHome, 
  MdShoppingCart, 
  MdTrendingUp, 
  MdPerson,
  MdDashboard,
  MdTerrain,
  MdAttachMoney
} from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";
import "./MobileBottomNav.css";

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();



  // Define itens baseado no role do usuário - VERSÃO CORRIGIDA
  const getNavigationItems = () => {
    const baseItems = [
      {
        id: "marketplace",
        label: "Início",
        icon: <MdShoppingCart size={24} />,
        path: "/marketplace",
      },
      {
        id: "hospedagem", 
        label: "Hospedagem",
        icon: <MdHome size={24} />,
        path: "/hospedagem",
      }
    ];

    // Definir itens específicos baseado no role usando switch
    let roleSpecificItems: Array<{
      id: string;
      label: string;
      icon: React.ReactNode;
      path: string;
    }> = [];

    switch(user?.role) {
      case "investor":
        roleSpecificItems = [
          {
            id: "investimentos",
            label: "Investimentos", 
            icon: <MdTrendingUp size={24} />,
            path: "/meus-investimentos",
          },
          {
            id: "reservas",
            label: "Reservas",
            icon: <MdAttachMoney size={24} />,
            path: "/minhas-reservas",
          }
        ];
        break;

      case "landowner":
        roleSpecificItems = [
          {
            id: "terrenos",
            label: "Terrenos",
            icon: <MdTerrain size={24} />,
            path: "/meus-terrenos",
          },
          {
            id: "gestao",
            label: "Gestão",
            icon: <MdAttachMoney size={24} />,
            path: "/gestao-alugueis",
          }
        ];
        break;

      case "admin":
        roleSpecificItems = [
          {
            id: "admin",
            label: "Admin",
            icon: <MdDashboard size={24} />,
            path: "/admin",
          },
          {
            id: "gestao",
            label: "Gestão",
            icon: <MdAttachMoney size={24} />,
            path: "/gestao-alugueis",
          }
        ];
        break;

      case "entrepreneur":
        roleSpecificItems = [
          {
            id: "gestao",
            label: "Gestão",
            icon: <MdAttachMoney size={24} />,
            path: "/gestao-alugueis",
          }
        ];
        break;

      default:
        roleSpecificItems = [];
    }

    // Adicionar perfil sempre como último item
    const profileItem = {
      id: "perfil",
      label: "Perfil",
      icon: <MdPerson size={24} />,
      path: "/personal-management",
    };

    const finalItems = [...baseItems, ...roleSpecificItems, profileItem];
    return finalItems;
  };

  const navigationItems = getNavigationItems();

  const isActiveRoute = (path: string) => {
    return location.pathname === path || 
           (path === "/marketplace" && location.pathname === "/");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-container">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`mobile-nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <div className="mobile-nav-icon">
              {item.icon}
            </div>
            <span className="mobile-nav-label">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
