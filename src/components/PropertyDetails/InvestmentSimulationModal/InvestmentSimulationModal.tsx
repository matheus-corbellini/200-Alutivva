import React, { useState, useEffect } from "react";
import { MdClose, MdTrendingUp, MdCalculate, MdInfo } from "react-icons/md";
import "./InvestmentSimulationModal.css";

interface InvestmentSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    title: string;
    roi: number;
    quotaValue: number;
    totalQuotas: number;
    soldQuotas: number;
    completionDate: string;
    financialProjection: {
      investmentValue: number;
      monthlyReturn: number;
      annualReturn: number;
      paybackPeriod: number;
    };
  };
  formatCurrency: (value: number) => string;
}

const InvestmentSimulationModal: React.FC<InvestmentSimulationModalProps> = ({
  isOpen,
  onClose,
  property,
  formatCurrency,
}) => {
  const [investmentAmount, setInvestmentAmount] = useState(property.quotaValue);
  const [investmentPeriod, setInvestmentPeriod] = useState(12);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [simulationResults, setSimulationResults] = useState({
    totalInvestment: 0,
    totalReturn: 0,
    monthlyReturn: 0,
    annualReturn: 0,
    paybackPeriod: 0,
    finalValue: 0,
  });

  useEffect(() => {
    if (isOpen) {
      calculateSimulation();
    }
  }, [isOpen, investmentAmount, investmentPeriod, monthlyContribution]);

  const calculateSimulation = () => {
    const totalInvestment = investmentAmount + (monthlyContribution * investmentPeriod);
    const annualReturnRate = property.roi / 100;
    const monthlyReturnRate = annualReturnRate / 12;
    
    let finalValue = investmentAmount;
    for (let month = 1; month <= investmentPeriod; month++) {
      finalValue = finalValue * (1 + monthlyReturnRate) + monthlyContribution;
    }
    
    const totalReturn = finalValue - totalInvestment;
    const monthlyReturn = totalReturn / investmentPeriod;
    const annualReturn = monthlyReturn * 12;
    const paybackPeriod = totalInvestment / monthlyReturn;

    setSimulationResults({
      totalInvestment,
      totalReturn,
      monthlyReturn,
      annualReturn,
      paybackPeriod,
      finalValue,
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="investment-simulation-modal-overlay"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Simulador de investimento"
    >
      <div
        className="investment-simulation-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-section">
            <MdCalculate className="modal-icon" />
            <div>
              <h2>Simulador de Investimento</h2>
              <p className="property-title">{property.title}</p>
            </div>
          </div>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Fechar simulador"
          >
            <MdClose />
          </button>
        </div>

        <div className="modal-body">
          <div className="simulation-inputs">
            <h3>Parâmetros do Investimento</h3>
            
            <div className="input-group">
              <label htmlFor="investment-amount">
                Valor Inicial do Investimento
              </label>
              <div className="input-wrapper">
                <input
                  id="investment-amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={property.quotaValue}
                  step={1000}
                />
                <span className="input-suffix">R$</span>
              </div>
              <small>Valor mínimo: {formatCurrency(property.quotaValue)}</small>
            </div>

            <div className="input-group">
              <label htmlFor="investment-period">
                Período de Investimento (meses)
              </label>
              <div className="input-wrapper">
                <input
                  id="investment-period"
                  type="number"
                  value={investmentPeriod}
                  onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                  min={1}
                  max={120}
                />
                <span className="input-suffix">meses</span>
              </div>
              <small>Máximo: 120 meses (10 anos)</small>
            </div>

            <div className="input-group">
              <label htmlFor="monthly-contribution">
                Contribuição Mensal (opcional)
              </label>
              <div className="input-wrapper">
                <input
                  id="monthly-contribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  min={0}
                  step={100}
                />
                <span className="input-suffix">R$</span>
              </div>
              <small>Deixe em 0 se não quiser contribuir mensalmente</small>
            </div>
          </div>

          <div className="simulation-results">
            <h3>
              <MdTrendingUp className="results-icon" />
              Resultados da Simulação
            </h3>
            
            <div className="results-grid">
              <div className="result-card">
                <span className="result-label">Investimento Total</span>
                <span className="result-value total-investment">
                  {formatCurrency(simulationResults.totalInvestment)}
                </span>
              </div>
              
              <div className="result-card">
                <span className="result-label">Retorno Total</span>
                <span className="result-value total-return">
                  {formatCurrency(simulationResults.totalReturn)}
                </span>
              </div>
              
              <div className="result-card">
                <span className="result-label">Retorno Mensal</span>
                <span className="result-value monthly-return">
                  {formatCurrency(simulationResults.monthlyReturn)}
                </span>
              </div>
              
              <div className="result-card">
                <span className="result-label">Retorno Anual</span>
                <span className="result-value annual-return">
                  {formatCurrency(simulationResults.annualReturn)}
                </span>
              </div>
              
              <div className="result-card">
                <span className="result-label">Payback</span>
                <span className="result-value payback">
                  {simulationResults.paybackPeriod.toFixed(1)} meses
                </span>
              </div>
              
              <div className="result-card highlight">
                <span className="result-label">Valor Final</span>
                <span className="result-value final-value">
                  {formatCurrency(simulationResults.finalValue)}
                </span>
              </div>
            </div>
          </div>

          <div className="simulation-info">
            <div className="info-card">
              <MdInfo className="info-icon" />
              <div>
                <h4>Informações Importantes</h4>
                <ul>
                  <li>ROI baseado em {property.roi}% ao ano</li>
                  <li>Simulação considera juros compostos mensais</li>
                  <li>Resultados são estimativas e podem variar</li>
                  <li>Consulte um consultor financeiro antes de investir</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Fechar
          </button>
          <button className="btn-primary">
            Reservar Investimento
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSimulationModal; 