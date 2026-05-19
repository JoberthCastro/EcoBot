import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import ESGMetricsChart from '../components/charts/ESGMetricsChart';
import AirQualityChart from '../components/charts/AirQualityChart';
import SustainabilityScoreChart from '../components/charts/SustainabilityScoreChart';
import ComparisonChart from '../components/charts/ComparisonChart';
import DashboardPitchPanel from '../components/DashboardPitchPanel';
import { getDataForCityAndMonth, getMetricsForCity } from '../services/unifiedApi';
import { getSuggestions } from '../services/suggestionsApi';
import './dashboard.css';

function Dashboard() {
  const [airData, setAirData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: 'São Paulo', month: 'Jun' });

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      try {
        const [data, metrics, apiSuggestions] = await Promise.all([
          getDataForCityAndMonth(filters.city, filters.month),
          getMetricsForCity(filters.city, filters.month),
          getSuggestions()
        ]);

        if (!isMounted) {
          return;
        }

        setAirData(data);
        setMetricsData(metrics);
        setSuggestions(apiSuggestions);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      if (prev.city === newFilters.city && prev.month === newFilters.month) {
        return prev;
      }
      return newFilters;
    });
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </Layout>
    );
  }

  const esgData = airData?.esgMetrics || {
    co2Emissions: 650,
    energyConsumption: 3200,
    waterConsumption: 145,
    wasteGenerated: 45,
    renewableEnergy: 25,
    recyclingRate: 30,
  };

  const aqData = airData?.airQuality || {
    pm25: 18.5, pm10: 32.0, no2: 15.2,
    o3: 28.4, co: 3.2, so2: 8.1,
  };

  const score = airData?.sustainabilityScore || 72;

  const sourceText = (airData?.source || metricsData?.source || '').toLowerCase();
  const isSimulated = sourceText.includes('simulado');
  const compareLabel = metricsData?.previousMonth
    ? `vs ${metricsData.previousMonth}:`
    : 'vs anterior:';

  const kpiList = [
    {
      label: 'Consumo de Energia',
      current: metricsData?.energyConsumption?.current ?? 1500,
      previous: metricsData?.energyConsumption?.previous ?? 1800,
      unit: 'kWh',
      reduction: metricsData?.energyConsumption?.reduction ?? 0,
      lowerIsBetter: true,
    },
    {
      label: 'Armazenamento Digital',
      current: metricsData?.digitalStorage?.current ?? 500,
      previous: metricsData?.digitalStorage?.previous ?? 700,
      unit: 'GB',
      reduction: metricsData?.digitalStorage?.reduction ?? 0,
      lowerIsBetter: true,
    },
    {
      label: 'Emissões CO2',
      current: metricsData?.carbonEmissions?.current ?? 200,
      previous: metricsData?.carbonEmissions?.previous ?? 250,
      unit: 't',
      reduction: metricsData?.carbonEmissions?.reduction ?? 0,
      lowerIsBetter: true,
    },
  ].map((kpi) => {
    const isGood = kpi.lowerIsBetter ? kpi.reduction > 0 : kpi.reduction > 0;
    const arrow = kpi.reduction >= 0 ? '▼' : '▲';
    return { ...kpi, isGood, arrow };
  });

  return (
    <Layout title="Dashboard">
      <div className="dashboard-container">
        <FilterBar onFilterChange={handleFilterChange} defaultCity={filters.city} defaultMonth={filters.month} />

        <DashboardPitchPanel
          city={filters.city}
          month={filters.month}
          score={score}
          airQuality={aqData}
          esgData={esgData}
          metricsData={metricsData}
          isSimulated={isSimulated}
        />

        {isSimulated && (
          <div className="data-source-banner" role="status">
            Dados simulados — configure OPENAQ_API_KEY na Vercel ou aguarde sincronização com a OpenAQ para esta cidade.
          </div>
        )}

        {/* KPI Cards */}
        <div className="kpi-row">
          {kpiList.map((kpi, i) => (
            <div key={i} className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">{kpi.label}</span>
                <span className={`kpi-badge ${kpi.isGood ? 'good' : 'bad'}`}>
                  {kpi.arrow} {Math.abs(kpi.reduction)}%
                </span>
              </div>
              <div className="kpi-value">{kpi.current} <small>{kpi.unit}</small></div>
              <div className="kpi-bar-bg">
                <div
                  className="kpi-bar-fill"
                  style={{
                    width: `${Math.min(100, (kpi.current / kpi.previous) * 100)}%`,
                    backgroundColor: kpi.isGood ? '#22c55e' : '#ef4444',
                  }}
                />
              </div>
              <div className="kpi-footer">
                {compareLabel} {kpi.previous} {kpi.unit}
              </div>
            </div>
          ))}

          <div className="kpi-card score-mini">
            <div className="kpi-label">Score de Sustentabilidade</div>
            <SustainabilityScoreChart score={score} />
          </div>
        </div>

        {/* Charts Row */}
        <div className="dashboard-grid">
          <div className="dashboard-card full-width">
            <h3 className="card-title">Comparativo Período Anterior vs Atual</h3>
            <ComparisonChart
              data={metricsData}
              previousMonthLabel={metricsData?.previousMonth || 'Anterior'}
            />
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Métricas ESG Detalhadas</h3>
            <ESGMetricsChart data={esgData} />
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Qualidade do Ar (Radar)</h3>
            <AirQualityChart data={aqData} />
          </div>

          <div className="dashboard-card metrics-summary">
            <h3 className="card-title">Resumo de Métricas Ambientais</h3>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">CO2</span>
                <span className="metric-value">{esgData.co2Emissions} t</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Energia</span>
                <span className="metric-value">{esgData.energyConsumption} kWh</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Água</span>
                <span className="metric-value">{esgData.waterConsumption} m³</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Resíduos</span>
                <span className="metric-value">{esgData.wasteGenerated} t</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Renovável</span>
                <span className="metric-value">{esgData.renewableEnergy}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Reciclagem</span>
                <span className="metric-value">{esgData.recyclingRate}%</span>
              </div>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="dashboard-card suggestions-card full-width">
              <h3 className="card-title">Sugestões de Otimização ESG</h3>
              <div className="suggestions-list">
                {suggestions.map((s) => (
                  <div key={s.id} className={`suggestion-item priority-${s.priority}`}>
                    <div className="suggestion-title">{s.title}</div>
                    <div className="suggestion-desc">{s.description}</div>
                    <div className="suggestion-impact">
                      <span className="impact-badge">{s.impact}</span>
                      <span className={`priority-badge ${s.priority}`}>{s.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
