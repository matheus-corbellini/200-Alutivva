import React from "react";
import Button from "../Button/Button";

type EmptyStateProps = {
  onClearFilters: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => (
  <div className="empty-state">
    <p className="empty-state-text">
      Nenhum empreendimento encontrado com os filtros selecionados.
    </p>
    <Button className="btn btn-outline mt-4" onClick={onClearFilters}>
      Limpar filtros
    </Button>
  </div>
);
