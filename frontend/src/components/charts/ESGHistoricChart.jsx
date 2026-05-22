import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';

function ESGHistoricChart({ data }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const defaultData = [
    { month: 'Jan', co2: 820, energy: 4200, water: 180 },
    { month: 'Fev', co2: 780, energy: 4000, water: 170 },
    { month: 'Mar', co2: 750, energy: 3800, water: 165 },
    { month: 'Abr', co2: 700, energy: 3600, water: 150 },
    { month: 'Mai', co2: 650, energy: 3400, water: 140 },
    { month: 'Jun', co2: 600, energy: 3200, water: 130 },
  ];

  const chartData = data || defaultData;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e5e5'} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#374151' }} />
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
          <Legend wrapperStyle={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#374151' }} />
          <Line type="monotone" dataKey="co2" stroke="#ef4444" name="CO2 (t)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="energy" stroke="#f97316" name="Energia (kWh)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="water" stroke="#3b82f6" name="Água (m³)" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ESGHistoricChart;
