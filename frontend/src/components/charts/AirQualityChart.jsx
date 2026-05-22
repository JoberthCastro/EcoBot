import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';

function AirQualityChart({ data }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const chartData = [
    { subject: 'PM2.5', value: data?.pm25 || 0, fullMark: 50 },
    { subject: 'PM10', value: data?.pm10 || 0, fullMark: 80 },
    { subject: 'NO2', value: data?.no2 || 0, fullMark: 40 },
    { subject: 'O3', value: data?.o3 || 0, fullMark: 60 },
    { subject: 'CO', value: data?.co || 0, fullMark: 10 },
    { subject: 'SO2', value: data?.so2 || 0, fullMark: 20 },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <PolarGrid stroke={isDark ? '#374151' : '#e5e5e5'} />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#374151' }} />
          <PolarRadiusAxis tick={{ fontSize: 10, fill: isDark ? '#9ca3af' : '#374151' }} />
          <Radar
            name="Qualidade do Ar"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#4b5563' : '#e5e5e5'}`,
              borderRadius: '8px',
              fontSize: '14px',
              color: isDark ? '#f9fafb' : '#111827'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AirQualityChart;
