function getAqiLabel(aqi) {
  if (aqi <= 50) return { label: 'Bom', tone: 'success' };
  if (aqi <= 100) return { label: 'Moderado', tone: 'warning' };
  if (aqi <= 150) return { label: 'Insalubre (sensíveis)', tone: 'warning' };
  return { label: 'Insalubre', tone: 'danger' };
}

export function buildExecutiveInsights({
  city,
  month,
  score,
  airQuality,
  esgData,
  metricsData,
  isSimulated,
}) {
  const insights = [];
  const aqi = Number(airQuality?.aqi || 0);
  const aqiInfo = getAqiLabel(aqi);

  insights.push({
    tone: isSimulated ? 'warning' : 'success',
    icon: isSimulated ? '⚠️' : '🛰️',
    title: isSimulated ? 'Modo demonstração' : 'Dados em tempo real',
    text: isSimulated
      ? 'Métricas estáveis para apresentação. Em produção, conectamos à OpenAQ v3 com API key.'
      : `Qualidade do ar integrada via OpenAQ v3 para ${city}.`,
  });

  if (score >= 80) {
    insights.push({
      tone: 'success',
      icon: '🌿',
      title: 'Score ESG elevado',
      text: `Índice de ${score} em ${month} indica maturidade ambiental acima da média para ${city}.`,
    });
  } else if (score >= 60) {
    insights.push({
      tone: 'neutral',
      icon: '📊',
      title: 'Score ESG em evolução',
      text: `Índice de ${score} em ${month} — há espaço para ganhos rápidos em energia e emissões.`,
    });
  } else {
    insights.push({
      tone: 'danger',
      icon: '🔴',
      title: 'Atenção ao score ESG',
      text: `Índice de ${score} em ${month} sugere priorizar redução de CO₂ e eficiência energética.`,
    });
  }

  if (aqi > 0) {
    insights.push({
      tone: aqiInfo.tone,
      icon: '💨',
      title: `Qualidade do ar: ${aqiInfo.label}`,
      text: `AQI ${aqi} — PM2.5 ${airQuality.pm25} µg/m³, PM10 ${airQuality.pm10} µg/m³ na região monitorada.`,
    });
  }

  const energyReduction = metricsData?.energyConsumption?.reduction ?? 0;
  const co2Reduction = metricsData?.carbonEmissions?.reduction ?? 0;

  if (energyReduction > 0) {
    insights.push({
      tone: 'success',
      icon: '⚡',
      title: 'Energia em queda',
      text: `Consumo caiu ${Math.abs(energyReduction)}% vs ${metricsData?.previousMonth || 'mês anterior'}.`,
    });
  } else if (energyReduction < 0) {
    insights.push({
      tone: 'danger',
      icon: '⚡',
      title: 'Energia em alta',
      text: `Consumo subiu ${Math.abs(energyReduction)}% vs ${metricsData?.previousMonth || 'mês anterior'} — priorize eficiência.`,
    });
  }

  if (co2Reduction > 0) {
    insights.push({
      tone: 'success',
      icon: '🌍',
      title: 'Emissões controladas',
      text: `CO₂ reduziu ${Math.abs(co2Reduction)}% no período (${esgData?.co2Emissions} t atuais).`,
    });
  } else if (co2Reduction < 0) {
    insights.push({
      tone: 'danger',
      icon: '🌍',
      title: 'Pressão nas emissões',
      text: `CO₂ aumentou ${Math.abs(co2Reduction)}% — alinhar com metas ESG corporativas.`,
    });
  }

  if (Number(esgData?.renewableEnergy) < 30) {
    insights.push({
      tone: 'neutral',
      icon: '☀️',
      title: 'Oportunidade renovável',
      text: `Apenas ${esgData?.renewableEnergy}% de energia renovável — quick win para o pitch de descarbonização.`,
    });
  }

  return insights.slice(0, 5);
}

export function buildPitchSummaryText({
  city,
  month,
  score,
  airQuality,
  esgData,
  metricsData,
  isSimulated,
}) {
  const source = isSimulated ? 'Simulado (demo)' : 'OpenAQ API v3';
  return [
    `# EcoBot — Resumo ESG`,
    ``,
    `**Cidade:** ${city} | **Período:** ${month}`,
    `**Fonte:** ${source}`,
    ``,
    `## Indicadores principais`,
    `- Score de sustentabilidade: **${score}/100**`,
    `- AQI: **${airQuality?.aqi ?? '—'}**`,
    `- CO₂: **${esgData?.co2Emissions} t** (${metricsData?.carbonEmissions?.reduction > 0 ? '▼' : '▲'} ${Math.abs(metricsData?.carbonEmissions?.reduction ?? 0)}%)`,
    `- Energia: **${esgData?.energyConsumption} kWh** (${metricsData?.energyConsumption?.reduction > 0 ? '▼' : '▲'} ${Math.abs(metricsData?.energyConsumption?.reduction ?? 0)}%)`,
    `- Energia renovável: **${esgData?.renewableEnergy}%**`,
    `- Taxa de reciclagem: **${esgData?.recyclingRate}%**`,
    ``,
    `## Mensagem para stakeholders`,
    `O EcoBot unifica qualidade do ar (OpenAQ) e métricas ESG derivadas em um único painel,`,
    `com histórico mensal, comparativos e assistente para apoiar decisões sustentáveis.`,
    ``,
    `Demo: https://ecobotti.vercel.app`,
  ].join('\n');
}
