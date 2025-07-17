import React from "react";
import { Filter, Search } from "lucide-react";
import type { Filters } from "../../types/property";

type FiltersSectionProps = {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
};

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  onFilterChange,
}) => (
  <div className="card filters-section">
    <div className="card-header">
      <h3 className="card-title flex items-center gap-2">
        <Filter className="icon" />
        Filtros de Busca
      </h3>
    </div>
    <div className="card-content">
      <div className="filters-grid mb-4">
        <div className="search-input-container">
          <Search className="search-icon icon" />
          <input
            type="text"
            placeholder="Buscar empreendimento..."
            className="input search-input"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>

        <select
          className="select"
          value={filters.region}
          onChange={(e) => onFilterChange("region", e.target.value)}
        >
          <option value="all">Todas as regiões</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="SP">São Paulo</option>
          <option value="PE">Pernambuco</option>
        </select>

        <select
          className="select"
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
        >
          <option value="all">Todos os tipos</option>
          <option value="Residencial">Residencial</option>
          <option value="Comercial">Comercial</option>
          <option value="Hoteleiro">Hoteleiro</option>
        </select>

        <input
          type="number"
          placeholder="ROI mínimo (%)"
          className="input"
          value={filters.minRoi}
          onChange={(e) => onFilterChange("minRoi", e.target.value)}
        />
      </div>

      <div className="filters-grid-2">
        <input
          type="number"
          placeholder="Valor mínimo da cota (R$)"
          className="input"
          value={filters.minValue}
          onChange={(e) => onFilterChange("minValue", e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor máximo da cota (R$)"
          className="input"
          value={filters.maxValue}
          onChange={(e) => onFilterChange("maxValue", e.target.value)}
        />
      </div>
    </div>
  </div>
);
