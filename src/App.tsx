import "./App.css";
import "./emergency-mobile.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { RentalProvider } from "./contexts/RentalContext";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Sidebar, SidebarToggle } from "./components/Sidebar/Sidebar";
import MobileBottomNav from "./components/Navigation/MobileBottomNav";
import MobileHeader from "./components/Navigation/MobileHeader";
import { useSidebar } from "./hooks/useSidebar";
import { SidebarCollapseProvider, useSidebarCollapse } from "./contexts/SidebarCollapseContext";
import { useAuth } from "./contexts/AuthContext";

function AppFrame() {
  const { isOpen, isMobile, toggle } = useSidebar();
  const { isCollapsed, toggleCollapsed } = useSidebarCollapse();
  const { user } = useAuth();
  const location = useLocation();

  // Não mostrar sidebar/navegação na página inicial, login e registro
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const shouldHideNavigation = isLandingPage || isLoginPage || isRegisterPage;
  const isLoggedIn = !!user;

  const toggleSidebar = () => {
    toggleCollapsed();
  };

  return (
    <div className="app-wrapper" style={{ minHeight: "100vh" }}>
      {/* DESKTOP SIDEBAR */}
      {!shouldHideNavigation && !isMobile && (
        <Sidebar
          isOpen={isOpen}
          onToggle={toggle}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      )}
      
      {/* MOBILE HEADER */}
      {!shouldHideNavigation && isMobile && isLoggedIn && (
        <MobileHeader />
      )}

      <div
        className={`main-content-with-sidebar ${shouldHideNavigation ? 'no-sidebar' : ''} ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <AppRoutes />
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      {!shouldHideNavigation && isMobile && isLoggedIn && (
        <MobileBottomNav />
      )}
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
