import { useEffect, useState } from "react";
import type { Filters, Property } from "../types/property";
import { listProperties } from "../services/PropertiesService";

export function usePropertyFilters() {
  const [filters, setFilter] = useState<Filters>({
    region: "all",
    type: "all",
    maxValue: "",
    minValue: "",
    minRoi: "",
    search: "",
  });

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  const reload = async () => {
    try {
      const props = await listProperties();
      setAllProperties(props);
      setFilteredProperties(props);
    } catch (e) {
      console.error("Erro ao carregar propriedades", e);
      setAllProperties([]);
      setFilteredProperties([]);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const applyFilters = (currentFilters: Filters) => {
    let filtered = allProperties;

    if (currentFilters.search) {
      filtered = filtered.filter(
        (prop) =>
          prop.title
            .toLowerCase()
            .includes(currentFilters.search.toLowerCase()) ||
          prop.description
            .toLowerCase()
            .includes(currentFilters.search.toLowerCase()) ||
          prop.location.address
            .toLowerCase()
            .includes(currentFilters.search.toLowerCase())
      );
    }

    if (currentFilters.region !== "all") {
      filtered = filtered.filter((prop) =>
        prop.location.address
          .toLowerCase()
          .includes(currentFilters.region.toLowerCase())
      );
    }

    if (currentFilters.type !== "all") {
      filtered = filtered.filter((prop) => prop.type === currentFilters.type);
    }

    if (currentFilters.minValue) {
      filtered = filtered.filter(
        (prop) => prop.quotaValue >= Number.parseInt(currentFilters.minValue)
      );
    }

    if (currentFilters.maxValue) {
      filtered = filtered.filter(
        (prop) => prop.quotaValue <= Number.parseInt(currentFilters.maxValue)
      );
    }

    if (currentFilters.minRoi) {
      filtered = filtered.filter(
        (prop) => prop.roi >= Number.parseFloat(currentFilters.minRoi)
      );
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilter(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const initialFilters: Filters = {
      region: "all",
      type: "all",
      maxValue: "",
      minValue: "",
      minRoi: "",
      search: "",
    };
    setFilter(initialFilters);
    setFilteredProperties(allProperties);
  };

  return {
    filters,
    filteredProperties,
    handleFilterChange,
    clearFilters,
    reload,
  };
}
