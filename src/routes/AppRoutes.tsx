import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import MarketplacePage from "../pages/MarketPlace/Marketplace";
import PropertyDetailsPage from "../pages/PropertyDetails/PropertyDetails";
import LandRegistry from "../pages/LandRegistry/LandRegistry";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { routes } from "./paths";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.landingPage} element={<LandingPage />} />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
        <Route
          path={routes.marketplace}
          element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.property}
          element={
            <ProtectedRoute>
              <PropertyDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.landRegistry}
          element={
            <ProtectedRoute>
              <LandRegistry />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
