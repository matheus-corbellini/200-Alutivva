import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Login.css";
import Button from "../../components/Button/Button";

import {
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdArrowBack,
  MdLock,
} from "react-icons/md";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { loginUser } from "../../services/UserServices/Login";

const Login: React.FC = () => {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { goToHome, goToRegister, goToMarketplace } = useAppNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser(email, password);
      goToMarketplace();
    } catch (err) {
      setError((err as Error).message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button
        onClick={goToHome}
        className="back-button"
        aria-label="Voltar para página inicial"
      >
        <MdArrowBack size={24} />
      </button>
      <img src="/log.png" alt="Logo Cota Resort" className="login-logo" />
      {location.state && location.state.redirected && (
        <div className="login-redirect-message">
          Você precisa estar logado para acessar os empreendimentos.
        </div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-icon">
          <MdEmail size={20} className="icon-email" color="64748b" />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-icon">
          <MdLock size={20} className="icon-lock" color="64748b" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="icon-eye"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{ cursor: "pointer" }}
            tabIndex={0}
            role="button"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <MdVisibility size={20} color="64748b" />
            ) : (
              <MdVisibilityOff size={20} color="64748b" />
            )}
          </span>
        </div>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        {!loading && (
          <Button
            variant="primary"
            size="large"
            type="submit"
            style={{ marginBottom: "10px" }}
            disabled={loading}
          >
            Entrar
          </Button>
        )}
        <a href="#" className="login-link">
          Esqueci minha senha
        </a>
        <div className="login-footer">
          <span>Ainda não tem uma conta?</span>
          <Button
            variant="secondary"
            size="large"
            className="login-button-register"
            onClick={goToRegister}
          >
            Cadastre-se
          </Button>
        </div>
      </form>
      {loading && (
        <div className="login-loading-overlay">
          <div className="login-loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Login;