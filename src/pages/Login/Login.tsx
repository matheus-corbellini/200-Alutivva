import React from "react";
import { useState } from "react";
import "./Login.css";
import Button from "../../components/Button/Button";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="login-container">
      <img src="/log.png" alt="Logo Cota Resort" className="login-logo" />
      <form className="login-form">
        <div className="input-icon">
          <MdEmail size={20} color="64748b" />
          <input type="email" placeholder="E-mail" />
        </div>
        <div className="input-icon">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
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
        <Button variant="primary" size="large" type="submit">
          Entrar
        </Button>
      </form>
      <a href="#" className="login-link">
        Esqueci minha senha
      </a>
      <div className="login-footer">
        <span>Ainda não tem uma conta?</span>
        <Button variant="secondary" size="large">
          Cadastre-se
        </Button>
      </div>
    </div>
  );
};

export default Login;
