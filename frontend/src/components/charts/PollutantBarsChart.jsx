import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useApp } from '../../context/AppContext';

function PollutantBarsChart({ data }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const chartData = [
    { name: 'PM2.5', value: data?.pm25 || 18.5, limit: 25, color: '#ef4444' },
    { name: 'PM10', value: data?.pm10 || 32.0, limit: 50, color: '#f97316' },
    { name: 'NO2', value: data?.no2 || 15.2, limit: 40, color: '#eab308' },
    { name: 'O3', value: data?.o3 || 28.4, limit: 60, color: '#3b82f6' },
    { name: 'CO', value: data?.co || 3.2, limit: 10, color: '#8b5cf6' },
    { name: 'SO2', value: data?.so2 || 8.1, limit: 20, color: '#ec4899' },
  ];

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e5e5'} />
          <XAxis type="number" tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#374151' }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#374151' }} width={60} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#4b5563' : '#e5e5e5'}`,
              borderRadius: '8px',
              fontSize: '14px',
              color: isDark ? '#f9fafb' : '#111827'
            }}
            formatter={(value, name, props) => [`${value} µg/m³ (limite: ${props.payload.limit})`, name]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PollutantBarsChart;
