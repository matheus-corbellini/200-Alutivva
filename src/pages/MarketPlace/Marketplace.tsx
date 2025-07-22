import { usePropertyFilters } from "../../hooks/usePropertyFilters";
import {
  Header,
  HeroSection,
  FiltersSection,
  ResultsSummary,
  PropertiesGrid,
  EmptyState,
} from "../../components/Marketplace/index";
import { Sidebar, SidebarToggle } from "../../components/Sidebar/Sidebar";
import { useSidebar } from "../../hooks/useSidebar";
import "../../components/Marketplace/styles/index.css";

export default function MarketplacePage() {
  const { filters, filteredProperties, handleFilterChange, clearFilters } =
    usePropertyFilters();
  const { isOpen, isMobile, toggle } = useSidebar();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={isOpen} onToggle={toggle} />
      <SidebarToggle isOpen={isOpen} onToggle={toggle} />

      <div
        className={`${!isMobile && isOpen ? "main-content-with-sidebar" : ""}`}
        style={{ flex: 1, minWidth: 0 }}
      >
        <Header />

        <div className="container">
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
