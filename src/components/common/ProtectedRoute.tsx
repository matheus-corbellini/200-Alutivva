import { useAuth } from "../../hooks/useAuth";
import "./ProtectedRoute.css";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string | string[];
};

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { firebaseUser, user, loading, initialLoading } = useAuth();

  if (loading || initialLoading) {
    return (
      <div className="protected-route-loading-container">Carregando...</div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  // Se não há role específico requerido, permite acesso
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Se há role requerido, verifica se o usuário tem permissão
  console.log("ProtectedRoute - User role:", user?.role);
  console.log("ProtectedRoute - Required role:", requiredRole);
  console.log("ProtectedRoute - User object:", user);

  // Verificação mais robusta do role
  const userRole = user?.role?.toLowerCase?.() || user?.role;
  
  // Verifica se o requiredRole é um array ou string
  if (Array.isArray(requiredRole)) {
    const hasPermission = requiredRole.some(role => {
      const requiredRoleLower = role?.toLowerCase?.() || role;
      return userRole === requiredRoleLower;
    });
    
    if (hasPermission) {
      return <>{children}</>;
    }
  } else {
    const requiredRoleLower = requiredRole?.toLowerCase?.() || requiredRole;
    if (userRole === requiredRoleLower) {
      return <>{children}</>;
    }
  }

  // Se não tem permissão, mostra mensagem de erro
  return (
    <div className="protected-route-loading-container">
      <h2>Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
      <p>Seu role: {user?.role}</p>
      <p>Role necessário: {Array.isArray(requiredRole) ? requiredRole.join(", ") : requiredRole}</p>
    </div>
  );
};
