import React, { useState, useEffect } from "react";
import "./ReturnsHistory.css";
import { useAuth } from "../../hooks/useAuth";
import { MdTrendingUp, MdTrendingDown, MdRemove } from "react-icons/md";

interface ReturnRecord {
  id: string;
  propertyName: string;
  date: string;
  initialValue: number;
  currentValue: number;
  returnPercentage: number;
  returnAmount: number;
  period: string;
  status: "positive" | "negative" | "neutral";
}

const ReturnsHistory: React.FC = () => {
  const { user } = useAuth();

  const [returnsHistory, setReturnsHistory] = useState<ReturnRecord[]>([
    {
      id: "1",
      propertyName: "Resort Tropical Paradise",
      date: "2024-03-15",
      initialValue: 50000,
      currentValue: 56250,
      returnPercentage: 12.5,
      returnAmount: 6250,
      period: "3 meses",
      status: "positive"
    },
    {
      id: "2",
      propertyName: "Hotel Business Center",
      date: "2024-02-28",
      initialValue: 75000,
      currentValue: 86250,
      returnPercentage: 15.0,
      returnAmount: 11250,
      period: "4 meses",
      status: "positive"
    },
    {
      id: "3",
      propertyName: "Pousada Serra Verde",
      date: "2024-03-10",
      initialValue: 30000,
      currentValue: 30000,
      returnPercentage: 0.0,
      returnAmount: 0,
      period: "1 mês",
      status: "neutral"
    },
    {
      id: "4",
      propertyName: "Resort Beach Club",
      date: "2024-01-20",
      initialValue: 45000,
      currentValue: 42750,
      returnPercentage: -5.0,
      returnAmount: -2250,
      period: "2 meses",
      status: "negative"
    }
  ]);

  const [filterPeriod, setFilterPeriod] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateTotalReturn = () => {
    return returnsHistory.reduce((total, record) => total + record.returnAmount, 0);
  };

  const calculateAverageReturn = () => {
    const totalReturn = calculateTotalReturn();
    const totalInitial = returnsHistory.reduce((total, record) => total + record.initialValue, 0);
    return totalInitial > 0 ? (totalReturn / totalInitial) * 100 : 0;
  };

  const filteredHistory = returnsHistory.filter(record => {
    const periodMatch = filterPeriod === "all" || record.period.includes(filterPeriod);
    const statusMatch = filterStatus === "all" || record.status === filterStatus;
    return periodMatch && statusMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "positive": return <MdTrendingUp size={20} />;
      case "negative": return <MdTrendingDown size={20} />;
      case "neutral": return <MdRemove size={20} />;
      default: return <MdRemove size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive": return "positive";
      case "negative": return "negative";
      case "neutral": return "neutral";
      default: return "neutral";
    }
  };

  return (
    <div className="returns-history-container">
      <div className="returns-history-header">
        <h1>Histórico de Rendimentos</h1>
        <p>Acompanhe o histórico de rendimentos dos seus investimentos</p>
      </div>

      <div className="returns-overview">
        <div className="overview-card">
          <h3>Retorno Total</h3>
          <p className={`amount ${calculateTotalReturn() >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(calculateTotalReturn())}
          </p>
        </div>
        <div className="overview-card">
          <h3>Retorno Médio</h3>
          <p className={`amount ${calculateAverageReturn() >= 0 ? 'positive' : 'negative'}`}>
            {calculateAverageReturn().toFixed(2)}%
          </p>
        </div>
        <div className="overview-card">
          <h3>Registros</h3>
          <p className="amount">{returnsHistory.length}</p>
        </div>
        <div className="overview-card">
          <h3>Período Médio</h3>
          <p className="amount">2.5 meses</p>
        </div>
      </div>

      <div className="returns-filters-section">
        <div className="filter-group">
          <label>Período:</label>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os períodos</option>
            <option value="1 mês">1 mês</option>
            <option value="2 meses">2 meses</option>
            <option value="3 meses">3 meses</option>
            <option value="4 meses">4 meses</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os status</option>
            <option value="positive">Positivo</option>
            <option value="negative">Negativo</option>
            <option value="neutral">Neutro</option>
          </select>
        </div>
      </div>

      <div className="returns-table">
        <div className="table-header">
          <div className="header-cell">Propriedade</div>
          <div className="header-cell">Data</div>
          <div className="header-cell">Valor Inicial</div>
          <div className="header-cell">Valor Atual</div>
          <div className="header-cell">Retorno</div>
          <div className="header-cell">Período</div>
          <div className="header-cell">Status</div>
        </div>

        <div className="table-body">
          {filteredHistory.map((record) => (
            <div key={record.id} className="table-row">
              <div className="table-cell property-name">
                {record.propertyName}
              </div>
              <div className="table-cell">
                {new Date(record.date).toLocaleDateString('pt-BR')}
              </div>
              <div className="table-cell">
                {formatCurrency(record.initialValue)}
              </div>
              <div className="table-cell">
                {formatCurrency(record.currentValue)}
              </div>
              <div className="table-cell">
                <span className={`return-value ${getStatusColor(record.status)}`}>
                  {record.returnPercentage > 0 ? '+' : ''}{record.returnPercentage.toFixed(2)}%
                </span>
                <div className="return-amount">
                  {formatCurrency(record.returnAmount)}
                </div>
              </div>
              <div className="table-cell">
                {record.period}
              </div>
              <div className="table-cell">
                <span className={`status-indicator ${getStatusColor(record.status)}`}>
                  {getStatusIcon(record.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Nenhum registro encontrado</h3>
          <p>Tente ajustar os filtros ou aguarde novos registros de rendimento</p>
        </div>
      )}

      <div className="returns-chart-section">
        <h3>Evolução dos Rendimentos</h3>
        <div className="returns-chart-container">
          <div className="returns-chart-bars">
            {filteredHistory.map((record) => (
              <div key={record.id} className="returns-chart-bar-container">
                <div
                  className={`returns-chart-bar ${getStatusColor(record.status)}`}
                  style={{
                    height: `${Math.max(25, Math.abs(record.returnPercentage) * 2.5)}%`,
                    minHeight: '40px'
                  }}
                >
                  <div className="returns-bar-value">
                    {record.returnPercentage > 0 ? '+' : ''}{record.returnPercentage.toFixed(1)}%
                  </div>
                  <div className="returns-bar-label">
                    {record.propertyName.split(' ')[0]}
                  </div>
                </div>
                <div className="returns-bar-tooltip">
                  <strong>{record.propertyName}</strong>
                  <div>Retorno: {record.returnPercentage > 0 ? '+' : ''}{record.returnPercentage.toFixed(2)}%</div>
                  <div>Valor: {formatCurrency(record.returnAmount)}</div>
                  <div>Período: {record.period}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="returns-chart-legend">
            <div className="returns-legend-item">
              <div className="returns-legend-color positive"></div>
              <span>Positivo</span>
            </div>
            <div className="returns-legend-item">
              <div className="returns-legend-color negative"></div>
              <span>Negativo</span>
            </div>
            <div className="returns-legend-item">
              <div className="returns-legend-color neutral"></div>
              <span>Neutro</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReturnsHistory; 