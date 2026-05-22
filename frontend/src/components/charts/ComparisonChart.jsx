import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';

function ComparisonChart({ data, previousMonthLabel = 'Anterior' }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const chartData = [
    {
      name: 'Energia (kWh)',
      Atual: data?.energyConsumption?.current || 1500,
      [previousMonthLabel]: data?.energyConsumption?.previous || 1800,
    },
    {
      name: 'Armaz. Digital (GB)',
      Atual: data?.digitalStorage?.current || 500,
      [previousMonthLabel]: data?.digitalStorage?.previous || 700,
    },
    {
      name: 'CO2 (t)',
      Atual: data?.carbonEmissions?.current || 200,
      [previousMonthLabel]: data?.carbonEmissions?.previous || 250,
    },
  ];

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }} barGap={4}>
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
          <Legend wrapperStyle={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#374151' }} />
          <Bar dataKey={previousMonthLabel} fill="#94a3b8" radius={[4, 4, 0, 0]} name={previousMonthLabel} />
          <Bar dataKey="Atual" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonChart;
