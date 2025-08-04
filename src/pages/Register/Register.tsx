import React, { useState, useEffect, useRef } from "react";
import "./Register.css";
import Button from "../../components/Button/Button";
import { Footer } from "borderless";
import {
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdPerson,
  MdPhone,
  MdArrowBack,
  MdLock,
} from "react-icons/md";
import { User, Sprout, Building2, Settings } from "lucide-react";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { registerUser } from "../../services/UserServices/Register";
import type { UserRole } from "../../types/users";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { goToLandingPage, goToLogin } = useAppNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }
    try {
      await registerUser({
        name,
        email,
        phone,
        role: role as UserRole,
        password,
      });
      goToLogin();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao cadastrar usuário");
      } else {
        setError("Erro ao cadastrar usuário");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Register-container">
      <button
        onClick={goToLandingPage}
        className="back-button"
        aria-label="Voltar para página inicial"
      >
        <MdArrowBack size={24} />
      </button>
      <img src="/log.png" alt="Logo Cota Resort" className="Register-logo" />
      <form className="Register-form" onSubmit={handleSubmit}>
        <div className="Register-input-icon">
          <MdPerson size={20} className="icon-person" color="64748b" />
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="Register-input-icon">
          <MdEmail size={20} className="icon-email" color="64748b" />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="Register-input-icon">
          <MdPhone size={20} className="icon-phone" color="64748b" />
          <input
            type="input"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="user-type-selection">
          <label className="user-type-title">Tipo de usuário *</label>
          <div className="custom-select-container" ref={dropdownRef}>
            <button
              type="button"
              className="custom-select-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="selected-content">
                {role === "investor" && (
                  <>
                    <User size={16} className="role-icon" />
                    <span>Investidor/Cotista</span>
                  </>
                )}
                {role === "landowner" && (
                  <>
                    <Sprout size={16} className="role-icon" />
                    <span>Proprietário de terreno</span>
                  </>
                )}
                {role === "entrepreneur" && (
                  <>
                    <Building2 size={16} className="role-icon" />
                    <span>Empreendedor/Gestor</span>
                  </>
                )}
                {role === "admin" && (
                  <>
                    <Settings size={16} className="role-icon" />
                    <span>Administrador da plataforma</span>
                  </>
                )}
                {!role && (
                  <span className="placeholder">
                    Selecione o tipo de usuário
                  </span>
                )}
              </span>
              <span
                className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
              >
                ▼
              </span>
            </button>
            {isDropdownOpen && (
              <div className="dropdown-options">
                <div
                  className="dropdown-option"
                  onClick={() => {
                    setRole("investor");
                    setIsDropdownOpen(false);
                  }}
                >
                  <User size={16} className="role-icon" />
                  <span>Investidor/Cotista</span>
                </div>
                <div
                  className="dropdown-option"
                  onClick={() => {
                    setRole("landowner");
                    setIsDropdownOpen(false);
                  }}
                >
                  <Sprout size={16} className="role-icon" />
                  <span>Proprietário de terreno</span>
                </div>
                <div
                  className="dropdown-option"
                  onClick={() => {
                    setRole("entrepreneur");
                    setIsDropdownOpen(false);
                  }}
                >
                  <Building2 size={16} className="role-icon" />
                  <span>Empreendedor/Gestor</span>
                </div>
                <div
                  className="dropdown-option"
                  onClick={() => {
                    setRole("admin");
                    setIsDropdownOpen(false);
                  }}
                >
                  <Settings size={16} className="role-icon" />
                  <span>Administrador da plataforma</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="Register-input-icon">
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
        <div className="Register-input-icon">
          <MdLock size={20} className="icon-lock" color="64748b" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="icon-eye"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            style={{ cursor: "pointer" }}
            tabIndex={0}
            role="button"
            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showConfirmPassword ? (
              <MdVisibility size={20} color="64748b" />
            ) : (
              <MdVisibilityOff size={20} color="64748b" />
            )}
          </span>
        </div>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <Button
          variant="primary"
          size="large"
          type="submit"
          style={{ marginBottom: "10px" }}
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
        <div className="Register-footer">
          <span>Já tem uma conta?</span>
          <Button
            variant="secondary"
            size="large"
            className="register-button-login"
            onClick={goToLogin}
          >
            Entrar
          </Button>
        </div>
      </form>
      <Footer
        theme="light"
        useGradient={false}
        backgroundColor="transparent"
        logoVariant="light"
      />
    </div>
  );
};

export default Register;
