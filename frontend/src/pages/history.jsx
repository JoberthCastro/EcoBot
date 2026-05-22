import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import ESGHistoricChart from '../components/charts/ESGHistoricChart';
import ScoreTrendChart from '../components/charts/ScoreTrendChart';
import { getDataForCityAndMonth } from '../services/unifiedApi';
import './history.css';

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: 'São Paulo' });

  useEffect(() => {
    let isMounted = true;

    async function loadHistoryData() {
      setLoading(true);
      const result = await getDataForCityAndMonth(filters.city);
      const formattedData = result.map(d => ({
        month: d.month,
        co2: d.esgMetrics.co2Emissions,
        energy: d.esgMetrics.energyConsumption,
        water: d.esgMetrics.waterConsumption,
        waste: d.esgMetrics.wasteGenerated,
        renewable: d.esgMetrics.renewableEnergy,
        recycling: d.esgMetrics.recyclingRate,
        score: d.sustainabilityScore
      }));

      if (!isMounted) {
        return;
      }

      setHistoryData(formattedData);
      setLoading(false);
    }

    loadHistoryData();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      if (prev.city === newFilters.city) {
        return prev;
      }
      return { city: newFilters.city };
    });
  };

  if (loading) {
    return (
      <Layout title="Histórico ESG">
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </Layout>
    );
  }

  const current = historyData[historyData.length - 1];
  const previous = historyData[historyData.length - 2];

  const trends = [
    { label: 'CO2', current: current.co2, previous: previous.co2, unit: 't', lowerIsBetter: true },
    { label: 'Energia', current: current.energy, previous: previous.energy, unit: 'kWh', lowerIsBetter: true },
    { label: 'Água', current: current.water, previous: previous.water, unit: 'm³', lowerIsBetter: true },
    { label: 'Renovável', current: current.renewable, previous: previous.renewable, unit: '%', lowerIsBetter: false },
    { label: 'Reciclagem', current: current.recycling, previous: previous.recycling, unit: '%', lowerIsBetter: false },
    { label: 'Score', current: current.score, previous: previous.score, unit: '', lowerIsBetter: false },
  ];

  return (
    <Layout title="Histórico ESG">
      <div className="history-container">
        <FilterBar onFilterChange={handleFilterChange} defaultCity={filters.city} defaultMonth="Jun" showMonthFilter={false} />

        {/* Trend Cards */}
        <div className="trend-row">
          {trends.map(t => {
            const diff = t.current - t.previous;
            const pct = ((diff / t.previous) * 100).toFixed(1);
            const isGood = t.lowerIsBetter ? diff < 0 : diff > 0;
            return (
              <div key={t.label} className="trend-card">
                <div className="trend-header">
                  <span className="trend-label">{t.label}</span>
                  <span className={`trend-badge ${isGood ? 'good' : 'bad'}`}>
                    {diff > 0 ? '▲' : '▼'} {Math.abs(pct)}%
                  </span>
                </div>
                <div className="trend-value">{t.current} <small>{t.unit}</small></div>
                <div className="trend-footer">vs {t.previous} {t.unit} no mês anterior</div>
              </div>
            );
          })}
        </div>

        <div className="history-grid">
          <div className="history-card">
            <h3 className="card-title">Evolução das Métricas Ambientais</h3>
            <ESGHistoricChart data={historyData} />
          </div>

          <div className="history-card">
            <h3 className="card-title">Evolução do Score ESG</h3>
            <ScoreTrendChart data={historyData.map(d => ({ month: d.month, score: d.score }))} />
          </div>

          <div className="history-card table-card">
            <h3 className="card-title">Histórico Mensal Completo</h3>
            <div className="table-scroll">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>CO2 (t)</th>
                    <th>Energia (kWh)</th>
                    <th>Água (m³)</th>
                    <th>Resíduos (t)</th>
                    <th>Renovável (%)</th>
                    <th>Reciclagem (%)</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((row, idx) => {
                    const isLatest = idx === historyData.length - 1;
                    return (
                      <tr key={row.month} className={isLatest ? 'latest-row' : ''}>
                        <td><strong>{row.month}</strong>{isLatest && <span className="latest-tag">Atual</span>}</td>
                        <td>{row.co2}</td>
                        <td>{row.energy}</td>
                        <td>{row.water}</td>
                        <td>{row.waste}</td>
                        <td>{row.renewable}</td>
                        <td>{row.recycling}</td>
                        <td><span className="score-cell">{row.score}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default History;
