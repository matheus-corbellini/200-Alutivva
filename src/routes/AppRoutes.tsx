import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Marketplace from "../pages/MarketPlace/Marketplace";
import PropertyDetails from "../pages/PropertyDetails/PropertyDetails";
import LandRegistry from "../pages/LandRegistry/LandRegistry";
import PersonalManagement from "../pages/PersonalManagement/PersonalManagement";
import RentalManagement from "../pages/RentalManagement/RentalManagement";
import MyLands from "../pages/MyLands/MyLands";
import MyInvestments from "../pages/MyInvestments/MyInvestments";
import ReturnsHistory from "../pages/ReturnsHistory/ReturnsHistory";
import { ProtectedRoute } from "../components/common/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property/:id"
        element={
          <ProtectedRoute>
            <PropertyDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registro-terrenos"
        element={
          <ProtectedRoute requiredRole="landowner">
            <LandRegistry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestao-pessoal"
        element={
          <ProtectedRoute>
            <PersonalManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestao-alugueis"
        element={
          <ProtectedRoute requiredRole="entrepreneur">
            <RentalManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meus-terrenos"
        element={
          <ProtectedRoute requiredRole="landowner">
            <MyLands />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meus-investimentos"
        element={
          <ProtectedRoute requiredRole="investor">
            <MyInvestments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/historico-rendimentos"
        element={
          <ProtectedRoute requiredRole="investor">
            <ReturnsHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
