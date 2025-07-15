import "./LandingPage.css";
import React from "react";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import Button from "../../components/Button/Button";

const LandingPage: React.FC = () => {
  const { goToLogin } = useAppNavigate();
  return (
    <div className="landing-container">
      <img src="/log.png" alt="Logo Cota Resort" className="landing-logo" />
      <h1 className="landing-title">Invista em resort e hotéis</h1>
      <p className="landing-description">
        Uma plataforma que conecta investidores, proprietários de terras e
        gestores de empreendimentos hoteleiros
      </p>
      <Button variant="primary" size="large" onClick={goToLogin}>
        Entrar
      </Button>
      <Button variant="transparent" size="large">
        Cadastre-se
      </Button>
    </div>
  );
};

export default LandingPage;
