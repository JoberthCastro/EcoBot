import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';

function ScoreTrendChart({ data }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const defaultData = [
    { month: 'Jan', score: 65 },
    { month: 'Fev', score: 68 },
    { month: 'Mar', score: 70 },
    { month: 'Abr', score: 72 },
    { month: 'Mai', score: 75 },
    { month: 'Jun', score: 78 },
  ];

  const chartData = data || defaultData;

  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e5e5'} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#374151' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#374151' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#4b5563' : '#e5e5e5'}`,
              borderRadius: '8px',
              fontSize: '14px',
              color: isDark ? '#f9fafb' : '#111827'
            }}
            formatter={(value) => [`${value}`, 'Score']}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#22c55e"
            fill="url(#scoreGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScoreTrendChart;
