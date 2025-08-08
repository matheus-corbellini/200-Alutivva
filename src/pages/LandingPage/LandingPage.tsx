import "./LandingPage.css";
import React from "react";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import Button from "../../components/Button/Button";
import { Footer } from "borderless";

const LandingPage: React.FC = () => {
  const { goToLogin, goToRegister } = useAppNavigate();
  return (
    <div className="landing-page-wrapper">
      <div className="landing-container">
        <img src="/logo-inicio.png" alt="Alutivva" className="landing-logo" />
        <h1 className="landing-title">Invista em resort e hotéis</h1>
        <p className="landing-description">
          Uma plataforma que conecta investidores, proprietários de terras e
          gestores de empreendimentos hoteleiros
        </p>
        <Button variant="primary" size="large" onClick={() => goToLogin()}>
          Entrar
        </Button>
        <Button variant="transparent" size="large" onClick={goToRegister}>
          Cadastre-se
        </Button>
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

export default LandingPage;
