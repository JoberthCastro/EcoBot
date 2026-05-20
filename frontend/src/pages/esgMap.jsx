import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { BRAZIL_MAP, projectCity } from '../constants/brazilMap';
import { getMapOverview, getMonths } from '../services/unifiedApi';
import './esgMap.css';

const scoreLabels = {
  good: 'Bom',
  moderate: 'Moderado',
  attention: 'Atenção',
};

const CITY_LAYOUT = {
  'São Paulo': { labelX: -46, labelY: -52, anchor: 'end' },
  'Rio de Janeiro': { labelX: 46, labelY: -48, anchor: 'start' },
  'Belo Horizonte': { labelX: 0, labelY: -56, anchor: 'middle' },
  Curitiba: { labelX: -50, labelY: 42, anchor: 'end' },
};

function MapMarker({ city, isSelected, isHovered, onSelect, onHover }) {
  const point = projectCity(city.lat, city.lng);
  const layout = CITY_LAYOUT[city.name] || { labelX: 0, labelY: -48, anchor: 'middle' };
  const isActive = isSelected || isHovered;
  const score = city.sustainabilityScore ?? '—';

  return (
    <g
      className={`esg-map-marker ${city.scoreLevel} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      transform={`translate(${point.x}, ${point.y})`}
      onClick={() => onSelect(city)}
      onMouseEnter={() => onHover(city.name)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(city.name)}
      onBlur={() => onHover(null)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(city);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${city.name}, score ${score}`}
    >
      {isActive && <circle className="esg-map-marker-pulse" r="18" />}

      <line
        className="esg-map-marker-line"
        x1={0}
        y1={-16}
        x2={layout.labelX * 0.35}
        y2={layout.labelY * 0.55}
      />

      <g className="esg-map-marker-pin">
        <path d="M0,-17 C-7.5,-17 -12.5,-11.5 -12.5,-5 C-12.5,2.5 0,18 0,18 C0,18 12.5,2.5 12.5,-5 C12.5,-11.5 7.5,-17 0,-17 Z" />
        <circle className="esg-map-marker-pin-core" cy="-6.5" r="4.8" />
      </g>

      <g transform={`translate(${layout.labelX}, ${layout.labelY})`}>
        <rect
          className="esg-map-marker-label-bg"
          x={layout.anchor === 'start' ? 0 : layout.anchor === 'end' ? -92 : -46}
          y={-14}
          width={92}
          height={28}
          rx={8}
        />
        <text
          className="esg-map-marker-label-title"
          x={layout.anchor === 'start' ? 8 : layout.anchor === 'end' ? -8 : 0}
          y={-1}
          textAnchor={layout.anchor}
        >
          {city.name}
        </text>
        <text
          className="esg-map-marker-label-score"
          x={layout.anchor === 'start' ? 8 : layout.anchor === 'end' ? -8 : 0}
          y={10}
          textAnchor={layout.anchor}
        >
          Score {score}
        </text>
      </g>

      {isActive && (
        <g className="esg-map-marker-tooltip" transform="translate(0, -72)">
          <rect x="-58" y="-18" width="116" height="36" rx="10" />
          <text y="-2" textAnchor="middle">
            {scoreLabels[city.scoreLevel]} · AQI {city.airQuality?.aqi ?? '—'}
          </text>
          <text className="esg-map-marker-tooltip-sub" y="12" textAnchor="middle">
            Clique para detalhes
          </text>
        </g>
      )}
    </g>
  );
}

function BrazilMap({ cities, selectedCity, onSelectCity }) {
  const [hoveredCity, setHoveredCity] = useState(null);
  const { width, height, outlinePath } = BRAZIL_MAP;

  const gridLines = useMemo(
    () => [-5, -15, -25].map((lat) => {
      const point = projectCity(lat, -54);
      return { lat, y: point.y };
    }),
    []
  );

  return (
    <div className="esg-map-canvas-wrap">
      <svg
        className="esg-map-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Mapa do Brasil com cidades monitoradas"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="55%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
          <linearGradient id="landGradient" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="45%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <filter id="landShadow" x="-8%" y="-8%" width="116%" height="116%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f766e" floodOpacity="0.22" />
          </filter>
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.28" />
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#oceanGradient)" rx="14" />

        {gridLines.map((line) => (
          <g key={line.lat}>
            <line
              className="esg-map-grid-line"
              x1="24"
              y1={line.y}
              x2={width - 24}
              y2={line.y}
            />
            <text className="esg-map-grid-label" x="28" y={line.y - 4}>
              {Math.abs(line.lat)}°S
            </text>
          </g>
        ))}

        <path
          className="esg-map-country"
          d={outlinePath}
          filter="url(#landShadow)"
        />

        <path className="esg-map-country-highlight" d={outlinePath} />

        {cities.map((city) => (
          <MapMarker
            key={city.name}
            city={city}
            isSelected={selectedCity?.name === city.name}
            isHovered={hoveredCity === city.name}
            onSelect={onSelectCity}
            onHover={setHoveredCity}
          />
        ))}

        <g className="esg-map-compass" transform={`translate(${width - 54}, 42)`}>
          <circle r="16" />
          <polygon points="0,-10 3,2 -3,2" />
          <text y="24">N</text>
        </g>
      </svg>
    </div>
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
