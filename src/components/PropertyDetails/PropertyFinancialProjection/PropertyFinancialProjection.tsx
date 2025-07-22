import React from "react";
import "./PropertyFinancialProjection.css";

type TimelineItem = {
  year: number;
  value: number;
  return: number;
};

type PropertyFinancialProjectionProps = {
  financialProjection: {
    investmentValue: number;
    monthlyReturn: number;
    annualReturn: number;
    roi: number;
    paybackPeriod: number;
    projectedAppreciation: number;
    timeline: TimelineItem[];
  };
  formatCurrency: (value: number) => string;
};

const PropertyFinancialProjection: React.FC<
  PropertyFinancialProjectionProps
> = ({ financialProjection, formatCurrency }) => {
  return (
    <section className="financial-projection">
      <h2 className="section-title"> Projecao Financeira</h2>
      <div className="projection-summary">
        <div className="projection-item">
          <span className="projection-value">
            {formatCurrency(financialProjection.monthlyReturn)}
          </span>
          <span className="projection-label">Retorno Mensal</span>
        </div>
        <div className="projection-item">
          <span className="projection-value">{financialProjection.roi}%</span>
          <span className="projection-label">ROI Anual</span>
        </div>
        <div className="projection-item">
          <span className="projection-value">
            {financialProjection.paybackPeriod} meses
          </span>
          <span className="projection-label">Payback(meses)</span>
        </div>
        <div className="projection-item">
          <span className="projection-value">
            {financialProjection.projectedAppreciation}%
          </span>
          <span className="projection-label">Valorização Projetada</span>
        </div>
      </div>

      <div className="timeline-chart">
        <h3>Projeção de Retorno</h3>
        <table className="timeline-table">
          <thead>
            <tr>
              <th>Ano</th>
              <th>Valor do Investimento</th>
              <th>Retorno Anual</th>
              <th>Retorno Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {financialProjection.timeline.map((item, index) => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>{formatCurrency(item.value)}</td>
                <td>{formatCurrency(item.return)}</td>
                <td>
                  {formatCurrency(
                    financialProjection.timeline
                      .slice(0, index + 1)
                      .reduce((acc, curr) => acc + curr.return, 0)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PropertyFinancialProjection;
