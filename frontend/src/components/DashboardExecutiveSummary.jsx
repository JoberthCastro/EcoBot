import React from 'react';
import { Link } from 'react-router-dom';
import { buildExecutiveInsights } from '../utils/esgInsights';
import './DashboardExecutiveSummary.css';

function DashboardExecutiveSummary({
  city,
  month,
  score,
  airQuality,
  esgData,
  metricsData,
  isSimulated,
  source,
}) {
  const insights = buildExecutiveInsights({
    city,
    month,
    score,
    airQuality,
    esgData,
    metricsData,
    isSimulated,
    source,
  }).slice(0, 3);

  const scoreClass =
    score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'attention';

  return (
    <section className="executive-summary" aria-label="Resumo do período">
      <div className="executive-summary-top">
        <div>
          <p className="executive-summary-eyebrow">
            {city} · {month}
            {isSimulated && <span className="executive-summary-tag">Demo</span>}
          </p>
          <h2 className="executive-summary-title">Resumo do período</h2>
        </div>
        <div className={`executive-summary-score executive-summary-score--${scoreClass}`}>
          <span className="executive-summary-score-value">{Number(score).toFixed(1)}</span>
          <span className="executive-summary-score-label">Score ESG</span>
        </div>
      </div>

      <div className="executive-summary-grid">
        {insights.map((item) => (
          <article key={item.title} className={`executive-summary-card executive-summary-card--${item.tone}`}>
            <span className="executive-summary-icon" aria-hidden="true">{item.icon}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>

      <nav className="executive-summary-nav" aria-label="Atalhos do produto">
        <Link to="/qualidade-do-ar">Qualidade do ar</Link>
        <Link to="/historico">Histórico ESG</Link>
        <Link to="/chatbot">Assistente ESG</Link>
      </nav>
    </section>
  );
}

export default DashboardExecutiveSummary;
