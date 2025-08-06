import { useNavigate } from "react-router-dom";
import { paths } from "../routes/paths";

export const useAppNavigate = () => {
  const navigate = useNavigate();

  const goToHome = () => navigate(paths.home);
  const goToLogin = () => navigate(paths.login);
  const goToRegister = () => navigate(paths.register);
  const goToMarketplace = () => navigate(paths.marketplace);
  const goToPropertyDetails = (id: number) => navigate(paths.propertyDetails.replace(":id", id.toString()));
  const goToLandRegistry = () => navigate(paths.landRegistry);
  const goToPersonalManagement = () => navigate(paths.personalManagement);
  const goToRentalManagement = () => navigate(paths.rentalManagement);
  const goToMyLands = () => navigate(paths.myLands);
  const goToMyInvestments = () => navigate(paths.myInvestments);
  const goToReturnsHistory = () => navigate(paths.returnsHistory);

  return {
    goToHome,
    goToLogin,
    goToRegister,
    goToMarketplace,
    goToPropertyDetails,
    goToLandRegistry,
    goToPersonalManagement,
    goToRentalManagement,
    goToMyLands,
    goToMyInvestments,
    goToReturnsHistory
  };
};
