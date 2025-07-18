import { useAuth } from "../../hooks/useAuth";
import "./ProtectedRoute.css";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { firebaseUser, loading, initialLoading } = useAuth();

  if (loading || initialLoading) {
    return (
      <div className="protected-route-loading-container">Carregando...</div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return <>{children}</>;
};
