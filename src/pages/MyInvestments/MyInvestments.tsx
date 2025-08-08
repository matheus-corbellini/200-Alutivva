import { useState } from "react";
import "./MyInvestments.css";
// import { useAuth } from "../../hooks/useAuth"; // Removido pois não está sendo usado
import { MdRocketLaunch, MdTrendingUp, MdClose, MdFilterList } from "react-icons/md";

interface Investment {
  id: string;
  propertyName: string;
  location: string;
  investmentAmount: number;
  investmentDate: string;
  projectStatus: "em_andamento" | "concluido" | "planejamento";
  expectedReturn: number;
  currentValue: number;
  photos: string[];
  lastUpdate: string;
}

const MyInvestments: React.FC = () => {
  // const { user } = useAuth(); // Removido pois não está sendo usado

  const [investments] = useState<Investment[]>([
    {
      id: "1",
      propertyName: "Resort Tropical Paradise",
      location: "Maceió, AL",
      investmentAmount: 50000,
      investmentDate: "2024-01-15",
      projectStatus: "em_andamento",
      expectedReturn: 12.5,
      currentValue: 56250,
      photos: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"],
      lastUpdate: "2024-03-15"
    },
    {
      id: "2",
      propertyName: "Hotel Business Center",
      location: "São Paulo, SP",
      investmentAmount: 75000,
      investmentDate: "2023-11-20",
      projectStatus: "concluido",
      expectedReturn: 15.0,
      currentValue: 86250,
      photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"],
      lastUpdate: "2024-02-28"
    },
    {
      id: "3",
      propertyName: "Pousada Serra Verde",
      location: "Gramado, RS",
      investmentAmount: 30000,
      investmentDate: "2024-02-10",
      projectStatus: "planejamento",
      expectedReturn: 18.0,
      currentValue: 30000,
      photos: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"],
      lastUpdate: "2024-03-10"
    },
    {
      id: "4",
      propertyName: "Hotel Beach Resort",
      location: "Florianópolis, SC",
      investmentAmount: 45000,
      investmentDate: "2024-01-05",
      projectStatus: "em_andamento",
      expectedReturn: 14.0,
      currentValue: 51300,
      photos: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"],
      lastUpdate: "2024-03-20"
    }
  ]);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Estados para modal de detalhes
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Estados para modal de simulação
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [simulationInvestment, setSimulationInvestment] = useState<Investment | null>(null);
  const [simulationPeriod, setSimulationPeriod] = useState(12);
  const [simulationReturn, setSimulationReturn] = useState(0);

  // Estado para filtros
  const [showFilters, setShowFilters] = useState(false);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "em_andamento": return "Em Andamento";
      case "concluido": return "Concluído";
      case "planejamento": return "Planejamento";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_andamento": return "orange";
      case "concluido": return "green";
      case "planejamento": return "blue";
      default: return "gray";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateTotalInvestment = () => {
    return investments.reduce((total, inv) => total + inv.investmentAmount, 0);
  };

  const calculateTotalCurrentValue = () => {
    return investments.reduce((total, inv) => total + inv.currentValue, 0);
  };

  const calculateTotalReturn = () => {
    const totalInvestment = calculateTotalInvestment();
    const totalCurrentValue = calculateTotalCurrentValue();
    return ((totalCurrentValue - totalInvestment) / totalInvestment) * 100;
  };

  // Função para filtrar investimentos
  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch = investment.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || investment.projectStatus === selectedStatus;

    const matchesLocation = selectedLocation === "all" ||
      investment.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Obter locais únicos para o filtro
  const uniqueLocations = Array.from(new Set(investments.map(inv => inv.location)));

  // Funções para modal
  const handleViewDetails = (investment: Investment) => {
    setSelectedInvestment(investment);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedInvestment(null);
  };

  const handleSimulation = (investment: Investment) => {
    setSimulationInvestment(investment);
    setSimulationReturn(investment.expectedReturn);
    setShowSimulationModal(true);
  };

  const handleCloseSimulationModal = () => {
    setShowSimulationModal(false);
    setSimulationInvestment(null);
    setSimulationPeriod(12);
    setSimulationReturn(0);
  };

  const calculateSimulation = () => {
    if (!simulationInvestment) return { finalValue: 0, totalReturn: 0, monthlyReturn: 0 };

    const initialValue = simulationInvestment.investmentAmount;
    const monthlyRate = simulationReturn / 100 / 12;
    const finalValue = initialValue * Math.pow(1 + monthlyRate, simulationPeriod);
    const totalReturn = finalValue - initialValue;
    const monthlyReturn = totalReturn / simulationPeriod;

    return { finalValue, totalReturn, monthlyReturn };
  };

  return (
    <div className="my-investments-container">
      <div className="my-investments-header">
        <h1>Meus Investimentos</h1>
        <p>Acompanhe o desempenho dos seus investimentos em resorts e hotéis</p>
      </div>

      <div className="investments-overview">
        <div className="overview-card">
          <h3>Total Investido</h3>
          <p className="amount">{formatCurrency(calculateTotalInvestment())}</p>
        </div>
        <div className="overview-card">
          <h3>Valor Atual</h3>
          <p className="amount">{formatCurrency(calculateTotalCurrentValue())}</p>
        </div>
        <div className="overview-card">
          <h3>Retorno Total</h3>
          <p className={`amount ${calculateTotalReturn() >= 0 ? 'positive' : 'negative'}`}>
            {calculateTotalReturn().toFixed(2)}%
          </p>
        </div>
        <div className="overview-card">
          <h3>Projetos Ativos</h3>
          <p className="amount">{investments.length}</p>
        </div>
      </div>

      {/* Seção de Filtros */}
      <div className="investments-filters-section">
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
          <div className="investments-filters">
            <div className="filters-content">
              <div className="filter-group">
                <label htmlFor="search">Buscar investimento</label>
                <div className="search-input-container">
                  <input
                    type="text"
                    id="search"
                    placeholder="Buscar por nome ou localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="status">Status do Projeto</label>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos os status</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="planejamento">Planejamento</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="location">Localização</label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todas as localizações</option>
                  {uniqueLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="investments-grid">
        {filteredInvestments.map((investment) => (
          <div key={investment.id} className="investment-card">
            <div className="investment-image">
              <img src={investment.photos[0]} alt={investment.propertyName} />
              <div className="investment-status">
                <span className={`status-badge ${getStatusColor(investment.projectStatus)}`}>
                  {getStatusLabel(investment.projectStatus)}
                </span>
              </div>
            </div>

            <div className="investment-info">
              <h3>{investment.propertyName}</h3>
              <p className="investment-location">{investment.location}</p>

              <div className="investment-details">
                <div className="detail-item">
                  <span className="label">Investimento:</span>
                  <span className="value">{formatCurrency(investment.investmentAmount)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Valor Atual:</span>
                  <span className="value">{formatCurrency(investment.currentValue)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Retorno Esperado:</span>
                  <span className="value">{investment.expectedReturn}%</span>
                </div>
                <div className="detail-item">
                  <span className="label">Data do Investimento:</span>
                  <span className="value">{new Date(investment.investmentDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Última Atualização:</span>
                  <span className="value">{new Date(investment.lastUpdate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="investment-actions">
                <button
                  className="btn-details"
                  onClick={() => handleViewDetails(investment)}
                >
                  Ver Detalhes
                </button>
                <button
                  className="btn-simulation"
                  onClick={() => handleSimulation(investment)}
                >
                  Simular Rendimento
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInvestments.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <h3>Nenhum investimento encontrado</h3>
          <p>Comece investindo em resorts e hotéis para aparecer aqui</p>
          <button className="btn-primary">Explorar Oportunidades</button>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedInvestment && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Investimento</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="investment-detail-image">
                <img src={selectedInvestment.photos[0]} alt={selectedInvestment.propertyName} />
                <div className="investment-detail-status">
                  <span className={`status-badge ${getStatusColor(selectedInvestment.projectStatus)}`}>
                    {getStatusLabel(selectedInvestment.projectStatus)}
                  </span>
                </div>
              </div>

              <div className="investment-detail-info">
                <h3>{selectedInvestment.propertyName}</h3>
                <p className="investment-detail-location">{selectedInvestment.location}</p>

                <div className="investment-detail-stats">
                  <div className="detail-stat">
                    <span className="stat-label">Investimento Inicial</span>
                    <span className="stat-value">{formatCurrency(selectedInvestment.investmentAmount)}</span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">Valor Atual</span>
                    <span className="stat-value">{formatCurrency(selectedInvestment.currentValue)}</span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">Retorno Esperado</span>
                    <span className="stat-value">{selectedInvestment.expectedReturn}%</span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">Retorno Real</span>
                    <span className={`stat-value ${selectedInvestment.currentValue > selectedInvestment.investmentAmount ? 'positive' : 'negative'}`}>
                      {((selectedInvestment.currentValue - selectedInvestment.investmentAmount) / selectedInvestment.investmentAmount * 100).toFixed(2)}%
                    </span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">Data do Investimento</span>
                    <span className="stat-value">{new Date(selectedInvestment.investmentDate).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="detail-stat">
                    <span className="stat-label">Última Atualização</span>
                    <span className="stat-value">{new Date(selectedInvestment.lastUpdate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="investment-detail-description">
                  <h4>Descrição do Projeto</h4>
                  <p>
                    Este investimento representa uma participação em um projeto imobiliário de alto padrão.
                    O projeto está focado em oferecer experiências únicas para os hóspedes, combinando
                    conforto, luxo e sustentabilidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Fechar
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  handleCloseModal();
                  handleSimulation(selectedInvestment);
                }}
              >
                Simular Rendimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Simulação */}
      {showSimulationModal && simulationInvestment && (
        <div className="modal-overlay" onClick={handleCloseSimulationModal}>
          <div className="modal-content simulation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Simular Rendimento</h2>
              <button className="modal-close" onClick={handleCloseSimulationModal}>
                <MdClose size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="simulation-info">
                <h3>{simulationInvestment.propertyName}</h3>
                <p className="simulation-location">{simulationInvestment.location}</p>
                <p className="simulation-initial">Investimento Inicial: {formatCurrency(simulationInvestment.investmentAmount)}</p>
              </div>

              <div className="simulation-controls">
                <div className="simulation-control">
                  <label htmlFor="period">Período (meses)</label>
                  <input
                    type="range"
                    id="period"
                    min="1"
                    max="60"
                    value={simulationPeriod}
                    onChange={(e) => setSimulationPeriod(Number(e.target.value))}
                    className="simulation-slider"
                  />
                  <span className="slider-value">{simulationPeriod} meses</span>
                </div>

                <div className="simulation-control">
                  <label htmlFor="return">Taxa de Retorno Anual (%)</label>
                  <input
                    type="range"
                    id="return"
                    min="0"
                    max="30"
                    step="0.5"
                    value={simulationReturn}
                    onChange={(e) => setSimulationReturn(Number(e.target.value))}
                    className="simulation-slider"
                  />
                  <span className="slider-value">{simulationReturn}%</span>
                </div>
              </div>

              <div className="simulation-results">
                <h4>Resultados da Simulação</h4>
                <div className="results-grid">
                  <div className="result-card">
                    <span className="result-label">Valor Final</span>
                    <span className="result-value">{formatCurrency(calculateSimulation().finalValue)}</span>
                  </div>

                  <div className="result-card">
                    <span className="result-label">Retorno Total</span>
                    <span className="result-value positive">{formatCurrency(calculateSimulation().totalReturn)}</span>
                  </div>

                  <div className="result-card">
                    <span className="result-label">Retorno Mensal</span>
                    <span className="result-value">{formatCurrency(calculateSimulation().monthlyReturn)}</span>
                  </div>

                  <div className="result-card">
                    <span className="result-label">Rentabilidade</span>
                    <span className="result-value positive">
                      {((calculateSimulation().finalValue - simulationInvestment.investmentAmount) / simulationInvestment.investmentAmount * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="simulation-chart">
                <h4>Projeção de Crescimento</h4>
                <div className="chart-container">
                  <div className="chart-bar initial">
                    <div className="bar-icon">
                      <MdRocketLaunch size={24} />
                    </div>
                    <div className="bar-label">Valor Inicial</div>
                    <div className="bar-value">{formatCurrency(simulationInvestment.investmentAmount)}</div>
                  </div>
                  <div className="chart-arrow">
                    <span className="arrow-icon">→</span>
                    <span className="growth-percentage">
                      +{((calculateSimulation().finalValue - simulationInvestment.investmentAmount) / simulationInvestment.investmentAmount * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className={`chart-bar final ${calculateSimulation().finalValue > simulationInvestment.investmentAmount ? 'positive' : 'negative'}`}>
                    <div className="bar-icon">
                      <MdTrendingUp size={24} />
                    </div>
                    <div className="bar-label">Valor Final Projetado</div>
                    <div className="bar-value">{formatCurrency(calculateSimulation().finalValue)}</div>
                    <div className="bar-growth">
                      {calculateSimulation().finalValue > simulationInvestment.investmentAmount ? '+' : ''}
                      {((calculateSimulation().finalValue - simulationInvestment.investmentAmount) / simulationInvestment.investmentAmount * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseSimulationModal}>
                Fechar
              </button>
              <button className="btn-primary">
                Salvar Simulação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvestments; 