function clampMetric(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildEsgFromAirQuality(airQuality) {
  const aqi = Number(airQuality?.aqi || 50);

  return {
    co2Emissions: parseFloat(clampMetric((aqi * 14) + 180, 150, 1200).toFixed(1)),
    energyConsumption: parseFloat(clampMetric((aqi * 42) + 1100, 900, 5200).toFixed(1)),
    waterConsumption: parseFloat(clampMetric((aqi * 1.1) + 70, 50, 260).toFixed(1)),
    wasteGenerated: parseFloat(clampMetric((aqi * 0.35) + 20, 15, 120).toFixed(1)),
    renewableEnergy: parseFloat(clampMetric(60 - (aqi * 0.4), 8, 60).toFixed(1)),
    recyclingRate: parseFloat(clampMetric(55 - (aqi * 0.28), 12, 55).toFixed(1)),
  };
}

function buildSustainabilityScore(airQuality, esgMetrics) {
  const aqiPenalty = Number(airQuality?.aqi || 50) * 0.45;
  const renewableBonus = Number(esgMetrics.renewableEnergy || 0) * 0.35;
  const recyclingBonus = Number(esgMetrics.recyclingRate || 0) * 0.25;
  const co2Penalty = Number(esgMetrics.co2Emissions || 0) * 0.015;
  return parseFloat(
    clampMetric(100 - aqiPenalty + renewableBonus + recyclingBonus - co2Penalty, 0, 100).toFixed(1)
  );
}

module.exports = {
  buildEsgFromAirQuality,
  buildSustainabilityScore,
};
