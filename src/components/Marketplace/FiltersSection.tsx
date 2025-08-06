import React, { useState } from "react";
import { Search } from "lucide-react";
import { MdFilterList } from "react-icons/md";
import type { Filters } from "../../types/property";

type FiltersSectionProps = {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
};

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  onFilterChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="filters-section">
      <div className="filters-toggle">
        <button
          className="filters-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="filters-toggle-text">
            <MdFilterList size={18} style={{ marginRight: '0.5rem' }} />
            Filtros de Busca
          </span>
          <span className={`toggle-icon ${showFilters ? 'open' : 'closed'}`}>
            {showFilters ? '−' : '+'}
          </span>
        </button>
      </div>

      {showFilters && (
        <div className="card-content">
          <div className="filters-grid">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nome, localização..."
                className="search-input"
                value={filters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
              />
            </div>

            <select
              className="select"
              value={filters.region}
              onChange={(e) => onFilterChange("region", e.target.value)}
            >
              <option value="all">Selecione a região</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="SP">São Paulo</option>
              <option value="PE">Pernambuco</option>
            </select>

            <select
              className="select"
              value={filters.type}
              onChange={(e) => onFilterChange("type", e.target.value)}
            >
              <option value="all">Selecione o tipo</option>
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Hoteleiro">Hoteleiro</option>
            </select>

            <input
              type="number"
              placeholder="ROI mínimo (ex: 10)"
              className="input"
              value={filters.minRoi}
              onChange={(e) => onFilterChange("minRoi", e.target.value)}
            />
          </div>

          <div className="filters-grid-2">
            <input
              type="number"
              placeholder="Valor mínimo (ex: 50000)"
              className="input"
              value={filters.minValue}
              onChange={(e) => onFilterChange("minValue", e.target.value)}
            />
            <input
              type="number"
              placeholder="Valor máximo (ex: 100000)"
              className="input"
              value={filters.maxValue}
              onChange={(e) => onFilterChange("maxValue", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
