import { usePropertyFilters } from "../../hooks/usePropertyFilters";
import { useState } from "react";
import {
  HeroSection,
  FiltersSection,
  ResultsSummary,
  PropertiesGrid,
  EmptyState,
} from "../../components/Marketplace";
import { Sidebar, SidebarToggle } from "../../components/Sidebar/Sidebar";
import { useSidebar } from "../../hooks/useSidebar";

import "../../components/Marketplace/styles/index.css";

export default function MarketplacePage() {
  const { filters, filteredProperties, handleFilterChange, clearFilters } =
    usePropertyFilters();
  const { isOpen, isMobile, toggle } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar
        isOpen={isOpen}
        onToggle={toggle}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      {isMobile && <SidebarToggle isOpen={isOpen} onToggle={toggle} />}

      <div
        className="main-content-with-sidebar"
        style={{
          minHeight: "100vh",
          marginLeft: sidebarCollapsed ? "70px" : "280px",
          transition: "margin-left 0.3s ease"
        }}
      >
        <div className="container" style={{ marginTop: "32px" }}>
          <HeroSection
            title="Invista em Imóveis com Segurança"
            description="Diversifique seus investimentos com cotas de empreendimentos imobiliários selecionados. Rentabilidade atrativa e transparência total."
          />

          <FiltersSection
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <ResultsSummary count={filteredProperties.length} />

          {filteredProperties.length > 0 ? (
            <PropertiesGrid properties={filteredProperties} />
          ) : (
            <EmptyState onClearFilters={clearFilters} />
          )}
        </div>
      </div>
    </div>
  );
}
