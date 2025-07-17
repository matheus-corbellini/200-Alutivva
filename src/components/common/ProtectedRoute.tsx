import { useAuth } from "../../hooks/useAuth";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import Button from "../Button/Button";
import "./ProtectedRoute.css";
import { MdLogin, MdPersonAdd, MdLock } from "react-icons/md";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { firebaseUser, loading, initialLoading } = useAuth();
  const { goToLogin, goToRegister } = useAppNavigate();

  if (loading || initialLoading) {
    return (
      <div className="protected-route-loading-container">
        <div className="protected-route-loading-content">
          <div className="protected-route-loading-spinner"></div>
          <p className="protected-route-loading-text">
            {initialLoading ? "Carregando..." : "Verificando autenticação..."}
          </p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="protected-route-auth-container">
        <div className="protected-route-auth-content">
          <div className="protected-route-auth-icon">
            <MdLock />
          </div>
          <h2 className="protected-route-auth-title">Acesso Restrito</h2>
          <p className="protected-route-auth-description">
            Você precisa estar logado para acessar o marketplace.
            <br />
            Faça login ou crie uma conta para continuar.
          </p>
          <div className="protected-route-auth-actions">
            <Button
              variant="primary"
              size="medium"
              onClick={goToLogin}
              startIcon={<MdLogin />}
            >
              Fazer Login
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={goToRegister}
              startIcon={<MdPersonAdd />}
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
