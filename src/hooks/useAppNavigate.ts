import { useNavigate } from "react-router-dom";
import { routes } from "../routes/paths";

export function useAppNavigate() {
  const navigate = useNavigate();

  return {
    goToLogin: (state?: object) => navigate(routes.login, { state }),
    goToLandingPage: () => navigate(routes.landingPage),
    goToRegister: () => navigate(routes.register),
    goToMarketplace: () => navigate(routes.marketplace),
    goToProperty: (id: number) => navigate(routes.propertyDetails(id)),
    goToLandRegistry: () => navigate(routes.landRegistry),
    navigate,
  };
}
