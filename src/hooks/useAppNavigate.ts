import { useNavigate } from "react-router-dom";
import { routes } from "../routes/paths";

export function useAppNavigate() {
  const navigate = useNavigate();

  return {
    goToLogin: () => navigate(routes.login),
    goToLandingPage: () => navigate(routes.landingPage),
    navigate,
  };
}
