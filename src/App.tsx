import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { RentalProvider } from "./contexts/RentalContext";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Sidebar, SidebarToggle } from "./components/Sidebar/Sidebar";
import { useSidebar } from "./hooks/useSidebar";
import { SidebarCollapseProvider, useSidebarCollapse } from "./contexts/SidebarCollapseContext";

function AppFrame() {
  const { isOpen, isMobile, toggle } = useSidebar();
  const { isCollapsed, toggleCollapsed } = useSidebarCollapse();
  const location = useLocation();

  // Não mostrar sidebar na página inicial, login e registro
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const shouldHideSidebar = isLandingPage || isLoginPage || isRegisterPage;

  const toggleSidebar = () => {
    toggleCollapsed();
  };

  return (
    <div className="app-wrapper" style={{ minHeight: "100vh" }}>
      {!shouldHideSidebar && (
        <Sidebar
          isOpen={isOpen}
          onToggle={toggle}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      )}
      {!shouldHideSidebar && isMobile && <SidebarToggle isOpen={isOpen} onToggle={toggle} />}

      <div
        className="main-content-with-sidebar"
        style={{
          minHeight: "100vh",
          marginLeft: shouldHideSidebar ? "0px" : (isCollapsed ? "70px" : "280px"),
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
          <SidebarCollapseProvider>
            <AppFrame />
          </SidebarCollapseProvider>
        </RentalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
