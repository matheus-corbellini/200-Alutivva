import { usePropertyFilters } from "../../hooks/usePropertyFilters";
import { Header } from "../../components/marketplace/Header";
import { HeroSection } from "../../components/marketplace/HeroSection";
import { FiltersSection } from "../../components/marketplace/FiltersSection";
import { ResultsSummary } from "../../components/marketplace/ResultsSummary";
import { PropertiesGrid } from "../../components/marketplace/PropertiesGrid";
import { EmptyState } from "../../components/marketplace/EmptyState";
import "../../components/marketplace/styles/index.css";

export default function MarketplacePage() {
  const { filters, filteredProperties, handleFilterChange, clearFilters } =
    usePropertyFilters();

  return (
    <div>
      <Header />

      <div className="container">
        <HeroSection
          title="Invista em Imóveis com Segurança"
          description="Diversifique seus investimentos com cotas de empreendimentos imobiliários selecionados. Rentabilidade atrativa e transparência total."
        />

        <FiltersSection filters={filters} onFilterChange={handleFilterChange} />

        <ResultsSummary count={filteredProperties.length} />

        {filteredProperties.length > 0 ? (
          <PropertiesGrid properties={filteredProperties} />
        ) : (
          <EmptyState onClearFilters={clearFilters} />
        )}
      </div>
    </div>
  );
}
