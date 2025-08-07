import React from "react";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import "./styles/Header.css";

export const Header: React.FC = () => {
  const { goToHome } = useAppNavigate();

  return (
    <header className="marketplace-header">
      <div className="header-content">
        <div className="header-left">
          <button className="back-button" onClick={goToHome}>
            ← Voltar
          </button>
        </div>
        <div className="header-center">
          <h1>Empreendimentos</h1>
        </div>
        <div className="header-right">
          {/* Espaço para futuros elementos */}
        </div>
      </div>
    </header>
  );
};
