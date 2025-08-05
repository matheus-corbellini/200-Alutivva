import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { RentalProvider } from "./contexts/RentalContext";
import { useRental } from "./hooks/useRental";
import { BrowserRouter } from "react-router-dom";
import { Sidebar, SidebarToggle } from "./components/Sidebar/Sidebar";
import { useSidebar } from "./hooks/useSidebar";
import { useState } from "react";

function AppContent() {
  const { isOpen, isMobile, toggle } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { rentalCount } = useRental();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-wrapper" style={{ minHeight: "100vh" }}>
      <Sidebar
        isOpen={isOpen}
        onToggle={toggle}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        rentalCount={rentalCount}
      />
      {isMobile && <SidebarToggle isOpen={isOpen} onToggle={toggle} />}

      <div
        className="main-content-with-sidebar"
        style={{
          minHeight: "100vh",
          marginLeft: sidebarCollapsed ? "70px" : "280px",
          transition: "margin-left 0.3s ease",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <AppRoutes />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RentalProvider>
          <AppContent />
        </RentalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
