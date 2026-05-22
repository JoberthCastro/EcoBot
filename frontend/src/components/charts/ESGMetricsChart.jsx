import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';

function ESGMetricsChart({ data }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const chartData = [
    { name: 'CO2 (t)', value: data?.co2Emissions || 0, color: '#ef4444' },
    { name: 'Energia (kWh)', value: data?.energyConsumption || 0, color: '#f97316' },
    { name: 'Água (m³)', value: data?.waterConsumption || 0, color: '#3b82f6' },
    { name: 'Resíduos (t)', value: data?.wasteGenerated || 0, color: '#8b5cf6' },
    { name: 'Renovável (%)', value: data?.renewableEnergy || 0, color: '#22c55e' },
    { name: 'Reciclagem (%)', value: data?.recyclingRate || 0, color: '#10b981' },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e5e5'} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#374151' }} />
          <YAxis tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#374151' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#4b5563' : '#e5e5e5'}`,
              borderRadius: '8px',
              fontSize: '14px',
              color: isDark ? '#f9fafb' : '#111827'
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ESGMetricsChart;
