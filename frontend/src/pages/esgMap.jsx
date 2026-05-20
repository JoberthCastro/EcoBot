import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getMapOverview, getMonths } from '../services/unifiedApi';
import './esgMap.css';

const scoreLabels = {
  good: 'Bom',
  moderate: 'Moderado',
  attention: 'Atenção',
};

function BrazilMap({ cities, selectedCity, onSelectCity }) {
  return (
    <svg
      className="esg-map-svg"
      viewBox="0 0 100 100"
      role="img"
      aria-label="Mapa do Brasil com cidades monitoradas"
    >
      <defs>
        <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>
      </defs>

      <rect width="100" height="100" fill="url(#mapBg)" rx="4" />

      <path
        className="esg-map-country"
        d="M 18 8 L 28 6 L 38 8 L 48 10 L 58 12 L 68 14 L 76 18 L 82 24 L 84 32 L 82 40 L 78 48 L 74 56 L 70 64 L 66 72 L 60 78 L 52 84 L 44 88 L 36 90 L 28 88 L 22 82 L 18 74 L 16 66 L 14 58 L 12 50 L 10 42 L 10 34 L 12 26 L 14 18 Z"
      />

      {cities.map((city) => {
        const isSelected = selectedCity?.name === city.name;
        return (
          <g
            key={city.name}
            className={`esg-map-pin ${city.scoreLevel} ${isSelected ? 'selected' : ''}`}
            transform={`translate(${city.mapX}, ${city.mapY})`}
            onClick={() => onSelectCity(city)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelectCity(city);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`${city.name}, score ${city.sustainabilityScore ?? 'N/A'}`}
          >
            <circle className="esg-map-pin-ring" r={isSelected ? 6 : 4.5} />
            <circle className="esg-map-pin-dot" r={2.2} />
            <text className="esg-map-pin-label" y={-7}>
              {city.name.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function EsgMap() {
  const [month, setMonth] = useState('Jun');
  const [months, setMonths] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMonths() {
      const monthsData = await getMonths();
      if (isMounted && monthsData.length) {
        setMonths(monthsData);
        if (!monthsData.includes(month)) {
          setMonth(monthsData[monthsData.length - 1]);
        }
      }
    }

    loadMonths();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadMap() {
      setLoading(true);
      try {
        const data = await getMapOverview(month);
        if (!isMounted) {
          return;
        }

        setCities(data.cities || []);
        setSelectedCity((prev) => {
          if (prev && data.cities.some((city) => city.name === prev.name)) {
            return data.cities.find((city) => city.name === prev.name);
          }
          return data.cities[0] || null;
        });
      } catch (error) {
        console.error('Erro ao carregar mapa ESG:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMap();

    return () => {
      isMounted = false;
    };
  }, [month]);

  const avgScore = cities.length
    ? Math.round(
        cities.reduce((sum, city) => sum + (city.sustainabilityScore || 0), 0) / cities.length
      )
    : 0;

  if (loading) {
    return (
      <Layout title="Mapa ESG">
        <div className="esg-map-page">
          <div className="loading">Carregando mapa...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mapa ESG">
      <div className="esg-map-page">
        <div className="esg-map-toolbar">
          <div className="esg-map-toolbar-text">
            <h2>Cobertura de dados ESG no Brasil</h2>
            <p>
              {cities.length} cidades com métricas disponíveis · média de sustentabilidade:{' '}
              <strong>{avgScore}</strong>
            </p>
          </div>
          <div className="esg-map-month-filter">
            <label htmlFor="map-month">Mês:</label>
            <select
              id="map-month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            >
              {months.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="esg-map-layout">
          <div className="esg-map-panel">
            <BrazilMap
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
            />
            <div className="esg-map-legend">
              <span className="legend-item good">≥ 80 — Bom</span>
              <span className="legend-item moderate">60–79 — Moderado</span>
              <span className="legend-item attention">&lt; 60 — Atenção</span>
            </div>
          </div>

          <aside className="esg-map-details">
            {selectedCity ? (
              <>
                <div className="esg-map-details-header">
                  <h3>{selectedCity.name}</h3>
                  <span className={`score-badge ${selectedCity.scoreLevel}`}>
                    {scoreLabels[selectedCity.scoreLevel]} · {selectedCity.sustainabilityScore ?? '—'}
                  </span>
                </div>

                <p className="esg-map-source">Fonte: {selectedCity.source}</p>

                <div className="esg-map-metrics-grid">
                  <div className="esg-map-metric">
                    <span className="metric-label">CO₂ (t)</span>
                    <span className="metric-value">
                      {selectedCity.esgMetrics?.co2Emissions ?? '—'}
                    </span>
                  </div>
                  <div className="esg-map-metric">
                    <span className="metric-label">Energia (MWh)</span>
                    <span className="metric-value">
                      {selectedCity.esgMetrics?.energyConsumption ?? '—'}
                    </span>
                  </div>
                  <div className="esg-map-metric">
                    <span className="metric-label">Reciclagem (%)</span>
                    <span className="metric-value">
                      {selectedCity.esgMetrics?.recyclingRate ?? '—'}
                    </span>
                  </div>
                  <div className="esg-map-metric">
                    <span className="metric-label">AQI</span>
                    <span className="metric-value">
                      {selectedCity.airQuality?.aqi ?? '—'}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/dashboard?city=${encodeURIComponent(selectedCity.name)}&month=${encodeURIComponent(month)}`}
                  className="esg-map-dashboard-link"
                >
                  Ver dashboard completo →
                </Link>
              </>
            ) : (
              <p className="esg-map-empty">Nenhuma cidade selecionada.</p>
            )}

            <div className="esg-map-city-list">
              <h4>Todas as cidades</h4>
              <ul>
                {cities.map((city) => (
                  <li key={city.name}>
                    <button
                      type="button"
                      className={selectedCity?.name === city.name ? 'active' : ''}
                      onClick={() => setSelectedCity(city)}
                    >
                      <span>{city.name}</span>
                      <span className={`mini-score ${city.scoreLevel}`}>
                        {city.sustainabilityScore ?? '—'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export default EsgMap;
