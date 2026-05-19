import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildExecutiveInsights, buildPitchSummaryText } from '../utils/esgInsights';
import './DashboardPitchPanel.css';

const DEMO_STEPS = [
  { step: 1, title: 'Dashboard', text: 'Mostre KPIs, comparativo mensal e score ESG com filtros de cidade/mês.' },
  { step: 2, title: 'Qualidade do Ar', text: 'Destaque integração OpenAQ v3, AQI e radar de poluentes (PM2.5, NO2, O3…).' },
  { step: 3, title: 'Histórico ESG', text: 'Evolução Jan–Jun e tendências de CO₂, energia e reciclagem.' },
  { step: 4, title: 'Chatbot ESG', text: 'Use os prompts rápidos: consumo, sugestões e qualidade do ar.' },
  { step: 5, title: 'Sugestões', text: 'Feche com ações priorizadas (impacto % e prioridade alta/média).' },
];

function DashboardPitchPanel({
  city,
  month,
  score,
  airQuality,
  esgData,
  metricsData,
  isSimulated,
  source,
}) {
  const [showScript, setShowScript] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  const insights = buildExecutiveInsights({
    city,
    month,
    score,
    airQuality,
    esgData,
    metricsData,
    isSimulated,
    source,
  });

  const handleCopySummary = async () => {
    const text = buildPitchSummaryText({
      city,
      month,
      score,
      airQuality,
      esgData,
      metricsData,
      isSimulated,
      source,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('Resumo copiado!');
      setTimeout(() => setCopyFeedback(''), 2500);
    } catch {
      setCopyFeedback('Não foi possível copiar');
    }
  };

  return (
    <section className="pitch-panel" aria-label="Painel executivo para apresentação">
      <header className="pitch-panel-header">
        <div>
          <p className="pitch-eyebrow">Visão executiva · {city} · {month}</p>
          <h2 className="pitch-title">
            Plataforma ESG com dados de qualidade do ar e indicadores operacionais
          </h2>
        </div>
        <div className="pitch-actions">
          <button type="button" className="pitch-btn secondary" onClick={() => setShowScript((v) => !v)}>
            {showScript ? 'Ocultar roteiro' : 'Roteiro da demo (5 min)'}
          </button>
          <button type="button" className="pitch-btn primary" onClick={handleCopySummary}>
            {copyFeedback || 'Copiar resumo para pitch'}
          </button>
        </div>
      </header>

      <div className="pitch-insights-grid">
        {insights.map((item) => (
          <article key={item.title} className={`pitch-insight pitch-insight--${item.tone}`}>
            <span className="pitch-insight-icon" aria-hidden="true">{item.icon}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>

      {showScript && (
        <div className="pitch-script">
          <h3>Roteiro sugerido para apresentação</h3>
          <ol className="pitch-script-list">
            {DEMO_STEPS.map((item) => (
              <li key={item.step}>
                <strong>{item.step}. {item.title}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ol>
          <p className="pitch-script-links">
            <Link to="/qualidade-do-ar">Qualidade do Ar</Link>
            {' · '}
            <Link to="/historico">Histórico ESG</Link>
            {' · '}
            <Link to="/chatbot">Chatbot ESG</Link>
          </p>
        </div>
      )}
    </section>
  );
}

export default DashboardPitchPanel;
