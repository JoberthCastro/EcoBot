import React from 'react';
import { useApp } from '../../context/AppContext';

/** Ponto no semicírculo superior: 0% = esquerda, 100% = direita */
function pointOnArc(cx, cy, radius, percent) {
  const angle = Math.PI - (percent / 100) * Math.PI;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  };
}

function arcPath(cx, cy, radius, startPercent, endPercent) {
  const start = pointOnArc(cx, cy, radius, startPercent);
  const end = pointOnArc(cx, cy, radius, endPercent);
  const largeArc = endPercent - startPercent > 50 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const ZONES = [
  { from: 0, to: 20, color: '#ef4444' },
  { from: 20, to: 40, color: '#f97316' },
  { from: 40, to: 60, color: '#eab308' },
  { from: 60, to: 80, color: '#84cc16' },
  { from: 80, to: 100, color: '#22c55e' },
];

function scoreColor(value) {
  if (value >= 80) return '#22c55e';
  if (value >= 60) return '#84cc16';
  if (value >= 40) return '#eab308';
  if (value >= 20) return '#f97316';
  return '#ef4444';
}

function SustainabilityScoreChart({ score = 0 }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const value = Math.min(100, Math.max(0, Number(score) || 0));
  const displayValue = Number.isInteger(value) ? value : value.toFixed(1);

  const cx = 120;
  const cy = 108;
  const radius = 88;
  const stroke = 16;
  const needleTip = pointOnArc(cx, cy, radius - 12, value);

  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="sustainability-gauge">
      <svg viewBox="0 0 240 130" aria-hidden="true">
        {/* Trilho de fundo */}
        <path
          d={arcPath(cx, cy, radius, 0, 100)}
          fill="none"
          stroke={isDark ? '#374151' : '#e2e8f0'}
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Faixas de cor (sem gaps grandes) */}
        {ZONES.map((zone) => (
          <path
            key={`${zone.from}-${zone.to}`}
            d={arcPath(cx, cy, radius, zone.from, zone.to)}
            fill="none"
            stroke={zone.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
          />
        ))}

        {/* Marcadores */}
        {ticks.map((tick) => {
          const inner = pointOnArc(cx, cy, radius - stroke / 2 - 4, tick);
          const outer = pointOnArc(cx, cy, radius + stroke / 2 + 2, tick);
          const label = pointOnArc(cx, cy, radius + 22, tick);
          return (
            <g key={tick}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={isDark ? '#6b7280' : '#94a3b8'}
                strokeWidth={1.5}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isDark ? '#9ca3af' : '#64748b'}
                fontSize="11"
                fontWeight="600"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Agulha */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke={isDark ? '#f9fafb' : '#1e293b'}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={5} fill={isDark ? '#e5e7eb' : '#334155'} />
        <circle cx={needleTip.x} cy={needleTip.y} r={4} fill={scoreColor(value)} />
      </svg>

      <div className="sustainability-gauge__value" style={{ color: scoreColor(value) }}>
        {displayValue}
      </div>
      <div className="sustainability-gauge__label">Índice ESG Atual</div>
    </div>
  );
}

export default SustainabilityScoreChart;
