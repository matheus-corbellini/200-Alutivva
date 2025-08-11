import { useEffect, useState } from "react";
import "./ReturnsHistory.css";
// import { useAuth } from "../../hooks/useAuth"; // Removido pois não está sendo usado
import { MdTrendingUp, MdTrendingDown, MdRemove, MdFilterList } from "react-icons/md";
import { listReturnsByUser, type ReturnRecord as ServiceReturnRecord } from "../../services/ReturnsService";
import { useAuth } from "../../contexts/AuthContext";

type ReturnRecord = ServiceReturnRecord;

const ReturnsHistory: React.FC = () => {
  const { user } = useAuth();

  const [returnsHistory, setReturnsHistory] = useState<ReturnRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await listReturnsByUser(user.id);
        setReturnsHistory(data);
      } catch (e) {
        console.error("Erro ao carregar rendimentos:", e);
        setError("Não foi possível carregar os rendimentos agora.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  const [filterPeriod, setFilterPeriod] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodMatch = filterPeriod === "all" || (record as any).period?.includes?.(filterPeriod);
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

      {error && <div className="error-box">{error}</div>}

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
          <div className="filters-content">
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
        )}
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
          {loading ? (
            <div className="table-row"><div className="table-cell" style={{ gridColumn: '1 / -1' }}>Carregando...</div></div>
          ) : (
            filteredHistory.map((record) => (
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
            ))
          )}
        </div>
      </div>

      {filteredHistory.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3v18h18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="6" y="14" width="3" height="4" fill="#cbd5e1" />
              <rect x="11" y="10" width="3" height="8" fill="#94a3b8" />
              <rect x="16" y="6" width="3" height="12" fill="#64748b" />
            </svg>
          </div>
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