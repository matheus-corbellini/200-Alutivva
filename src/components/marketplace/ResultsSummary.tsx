import React from "react";

type ResultsSummaryProps = {
  count: number;
};

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ count }) => (
  <div className="results-summary">
    <p>
      Encontrados <span className="font-semibold">{count}</span> empreendimentos
    </p>
  </div>
);
