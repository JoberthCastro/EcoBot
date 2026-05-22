import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import AirQualityChart from '../components/charts/AirQualityChart';
import PollutantBarsChart from '../components/charts/PollutantBarsChart';
import { getDataForCityAndMonth } from '../services/unifiedApi';
import './airQuality.css';

function AirQuality() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ city: 'São Paulo', month: 'Jun' });

  useEffect(() => {
    let isMounted = true;

    async function loadAirQualityData() {
      setLoading(true);
      setError(null);

      try {
        const result = await getDataForCityAndMonth(filters.city, filters.month);
        if (!isMounted) {
          return;
        }
        setData(result);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        console.error('Erro ao carregar qualidade do ar:', requestError);
        setError(requestError?.response?.data?.error || 'Não foi possível carregar os dados.');
        setData(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAirQualityData();

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
      <Layout title="Qualidade do Ar">
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Qualidade do Ar">
        <div className="airquality-container">
          <FilterBar onFilterChange={handleFilterChange} defaultCity={filters.city} defaultMonth={filters.month} />
          <p className="loading">{error}</p>
        </div>
      </Layout>
    );
  }

  const airData = data?.airQuality || {
    pm25: 18.5, pm10: 32.0, no2: 15.2,
    o3: 28.4, co: 3.2, so2: 8.1, aqi: 35
  };

  const locationInfo = data ? {
    city: data.city || 'São Paulo',
    country: data.country || 'BR',
    location: data.location || 'São Paulo',
    source: data.source || 'Simulado',
  } : { city: 'São Paulo', country: 'BR', location: 'São Paulo', source: 'Simulado' };

  const pollutants = [
    { name: 'PM2.5', value: airData.pm25, unit: 'µg/m³', limit: 25, color: '#ef4444' },
    { name: 'PM10', value: airData.pm10, unit: 'µg/m³', limit: 50, color: '#f97316' },
    { name: 'NO2', value: airData.no2, unit: 'µg/m³', limit: 40, color: '#eab308' },
    { name: 'O3', value: airData.o3, unit: 'µg/m³', limit: 60, color: '#3b82f6' },
    { name: 'CO', value: airData.co, unit: 'mg/m³', limit: 10, color: '#8b5cf6' },
    { name: 'SO2', value: airData.so2, unit: 'µg/m³', limit: 20, color: '#ec4899' },
  ];

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return '#22c55e';
    if (aqi <= 100) return '#eab308';
    if (aqi <= 150) return '#f97316';
    return '#ef4444';
  };

  const getAqiLabel = (aqi) => {
    if (aqi <= 50) return 'Bom';
    if (aqi <= 100) return 'Moderado';
    if (aqi <= 150) return 'Insalubre para Sensíveis';
    if (aqi <= 200) return 'Insalubre';
    if (aqi <= 300) return 'Muito Insalubre';
    return 'Perigoso';
  };

  return (
    <Layout title="Qualidade do Ar">
      <div className="airquality-container">
        <FilterBar onFilterChange={handleFilterChange} defaultCity={filters.city} defaultMonth={filters.month} />

        {/* Location Info */}
        <div className="aq-location-bar">
          <span className="aq-location">{locationInfo.city}, {locationInfo.country}</span>
          <span className="aq-source">Fonte: {locationInfo.source}</span>
        </div>

        {/* KPI + Radar Row */}
        <div className="airquality-grid">
          <div className="airquality-card aqi-card">
            <h3 className="card-title">Índice de Qualidade do Ar (AQI)</h3>
            <div className="aqi-display">
              <span className="aqi-value" style={{ color: getAqiColor(airData.aqi) }}>
                {Math.round(airData.aqi)}
              </span>
              <span className="aqi-label" style={{ color: getAqiColor(airData.aqi) }}>
                {getAqiLabel(airData.aqi)}
              </span>
            </div>
            <div className="aqi-scale">
              <div className="aqi-scale-bar">
                <div className="aqi-scale-fill" style={{ width: `${Math.min(100, (airData.aqi / 300) * 100)}%`, backgroundColor: getAqiColor(airData.aqi) }} />
              </div>
              <div className="aqi-scale-labels">
                <span>0</span>
                <span>150</span>
                <span>300+</span>
              </div>
            </div>
          </div>

          <div className="airquality-card">
            <h3 className="card-title">Radar de Poluentes</h3>
            <AirQualityChart data={airData} />
          </div>
        </div>

        {/* Pollutants Detail + Bar Chart */}
        <div className="airquality-grid">
          <div className="airquality-card pollutants-card">
            <h3 className="card-title">Detalhes dos Poluentes</h3>
            <div className="pollutants-list">
              {pollutants.map((p) => (
                <div key={p.name} className="pollutant-item">
                  <div className="pollutant-header">
                    <span className="pollutant-name">{p.name}</span>
                    <span className="pollutant-value" style={{ color: p.color }}>{p.value} {p.unit}</span>
                  </div>
                  <div className="pollutant-bar-bg">
                    <div
                      className="pollutant-bar-fill"
                      style={{
                        width: `${Math.min(100, (p.value / p.limit) * 100)}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                  <span className="pollutant-limit">Limite: {p.limit} {p.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="airquality-card">
            <h3 className="card-title">Concentração por Poluente</h3>
            <PollutantBarsChart data={airData} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AirQuality;
