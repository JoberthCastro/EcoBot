const { fetchAirQualityByCity } = require('../services/openaq.service');

const monthOrder = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
const supportedCities = [
  { name: 'São Paulo', country: 'BR' },
  { name: 'Rio de Janeiro', country: 'BR' },
  { name: 'Belo Horizonte', country: 'BR' },
  { name: 'Curitiba', country: 'BR' }
];

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
    recyclingRate: parseFloat(clampMetric(55 - (aqi * 0.28), 12, 55).toFixed(1))
  };
}

function buildSustainabilityScore(airQuality, esgMetrics) {
  const aqiPenalty = Number(airQuality?.aqi || 50) * 0.45;
  const renewableBonus = Number(esgMetrics.renewableEnergy || 0) * 0.35;
  const recyclingBonus = Number(esgMetrics.recyclingRate || 0) * 0.25;
  const co2Penalty = Number(esgMetrics.co2Emissions || 0) * 0.015;
  return parseFloat(clampMetric(100 - aqiPenalty + renewableBonus + recyclingBonus - co2Penalty, 0, 100).toFixed(1));
}

async function getLiveCitySnapshot(city) {
  const matchedCity = supportedCities.find((entry) => entry.name === city);
  if (!matchedCity) {
    return null;
  }

  const measurements = await fetchAirQualityByCity(matchedCity.name, matchedCity.country);
  const latest = Array.isArray(measurements) ? measurements[0] : null;

  if (!latest) {
    return null;
  }

  const esgMetrics = buildEsgFromAirQuality(latest.airQuality || {});
  const sustainabilityScore = buildSustainabilityScore(latest.airQuality || {}, esgMetrics);

  return {
    location: latest.location || matchedCity.name,
    city: matchedCity.name,
    country: latest.country || matchedCity.country,
    airQuality: latest.airQuality || {},
    esgMetrics,
    sustainabilityScore,
    source: latest.source || 'OpenAQ API v3',
    timestamp: latest.timestamp || new Date()
  };
}

function scaleReading(value, factor, fallback) {
  const base = value != null ? value : fallback;
  return parseFloat((base * factor).toFixed(1));
}

function buildHistoricalSeriesFromSnapshot(snapshot) {
  const baseAq = snapshot.airQuality || {};

  return monthOrder.map((month, index) => {
    const factor = 1 + ((index - (monthOrder.length - 1)) * 0.03);

    const airQuality = {
      pm25: scaleReading(baseAq.pm25, factor, 15),
      pm10: scaleReading(baseAq.pm10, factor, 25),
      no2: scaleReading(baseAq.no2, factor, 12),
      o3: scaleReading(baseAq.o3, factor, 18),
      co: scaleReading(baseAq.co, factor, 2),
      so2: scaleReading(baseAq.so2, factor, 5),
      aqi: 0,
    };

    airQuality.aqi = parseFloat(
      clampMetric(
        Math.max(
          airQuality.pm25 || 0,
          airQuality.pm10 || 0,
          airQuality.no2 || 0,
          airQuality.o3 || 0,
          airQuality.co || 0,
          airQuality.so2 || 0
        ),
        1,
        300
      ).toFixed(1)
    );

    const esgMetrics = buildEsgFromAirQuality(airQuality);

    return {
      ...snapshot,
      month,
      airQuality,
      esgMetrics,
      sustainabilityScore: buildSustainabilityScore(airQuality, esgMetrics),
      source: `${snapshot.source} · projeção mensal estimada`,
      timestamp: new Date(new Date().getFullYear(), index, 15)
    };
  });
}

async function getUnifiedData(req, res) {
  try {
    const { city = 'São Paulo', month } = req.query;

    const cityNames = supportedCities.map(c => c.name);

    if (!cityNames.includes(city)) {
      return res.status(400).json({ error: `Cidade não encontrada. Disponíveis: ${cityNames.join(', ')}` });
    }

    const snapshot = await getLiveCitySnapshot(city);
    if (!snapshot) {
      return res.status(502).json({ error: 'Não foi possível obter dados em tempo real para a cidade informada.' });
    }

    if (month) {
      const historicalSeries = buildHistoricalSeriesFromSnapshot(snapshot);
      const monthData = historicalSeries.find((entry) => entry.month === month);
      if (!monthData) {
        return res.status(400).json({ error: `Mês inválido. Disponíveis: ${monthOrder.join(', ')}` });
      }
      return res.json(monthData);
    }

    const data = buildHistoricalSeriesFromSnapshot(snapshot);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function calcReduction(previous, current) {
  if (!previous) {
    return 0;
  }
  return parseFloat((((previous - current) / previous) * 100).toFixed(1));
}

async function getUnifiedMetrics(req, res) {
  try {
    const { city = 'São Paulo', month = 'Jun' } = req.query;

    if (!supportedCities.some((entry) => entry.name === city)) {
      return res.status(400).json({ error: 'Cidade não encontrada' });
    }

    const monthIndex = monthOrder.indexOf(month);
    if (monthIndex < 0) {
      return res.status(400).json({ error: `Mês inválido. Disponíveis: ${monthOrder.join(', ')}` });
    }

    const snapshot = await getLiveCitySnapshot(city);
    if (!snapshot) {
      return res.status(502).json({ error: 'Não foi possível obter métricas em tempo real.' });
    }

    const history = buildHistoricalSeriesFromSnapshot(snapshot);
    const current = history[monthIndex];
    const previous = history[monthIndex > 0 ? monthIndex - 1 : 0];

    const metrics = {
      month,
      previousMonth: monthIndex > 0 ? monthOrder[monthIndex - 1] : month,
      source: snapshot.source,
      energyConsumption: {
        current: current.esgMetrics.energyConsumption,
        previous: previous.esgMetrics.energyConsumption,
        reduction: calcReduction(previous.esgMetrics.energyConsumption, current.esgMetrics.energyConsumption),
      },
      digitalStorage: {
        current: parseFloat((current.esgMetrics.recyclingRate * 15).toFixed(1)),
        previous: parseFloat((previous.esgMetrics.recyclingRate * 15).toFixed(1)),
        reduction: calcReduction(
          previous.esgMetrics.recyclingRate * 15,
          current.esgMetrics.recyclingRate * 15
        ),
      },
      carbonEmissions: {
        current: current.esgMetrics.co2Emissions,
        previous: previous.esgMetrics.co2Emissions,
        reduction: calcReduction(previous.esgMetrics.co2Emissions, current.esgMetrics.co2Emissions),
      },
      sustainabilityScore: {
        current: current.sustainabilityScore,
        previous: previous.sustainabilityScore,
        reduction: calcReduction(previous.sustainabilityScore, current.sustainabilityScore),
      },
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function getAvailableCities(req, res) {
  res.json(supportedCities);
}

function getAvailableMonths(req, res) {
  res.json(monthOrder);
}

module.exports = {
  getUnifiedData,
  getUnifiedMetrics,
  getAvailableCities,
  getAvailableMonths
};
