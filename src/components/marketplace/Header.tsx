import React from "react";
import Button from "../Button/Button";
import { useAuth } from "../../hooks/useAuth";
import { useAppNavigate } from "../../hooks/useAppNavigate";

export const Header: React.FC = () => {
  const { user, firebaseUser, logout } = useAuth();
  const { goToLandingPage } = useAppNavigate();

  const handleLogout = async () => {
    await logout();
    goToLandingPage();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="header-title">Alutivva</h1>
          <div className="header-actions">
            {firebaseUser && (
              <span className="user-welcome">
                Olá, {user?.name || firebaseUser.email}
              </span>
            )}
            <Button
              onClick={handleLogout}
              className="btn btn-outline"
              variant="secondary"
              size="medium"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
