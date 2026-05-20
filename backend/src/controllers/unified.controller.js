const {
  fetchAirQualityByCity,
  fetchCityHistoricalFromOpenAQ,
  getSimulatedData,
  MONTH_LABELS_PT,
} = require('../services/openaq.service');
const { buildEsgFromAirQuality, buildSustainabilityScore } = require('../utils/esgFromAirQuality');

const supportedCities = require('../data/cities.data');

const defaultMonthOrder = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

function pickMonthData(series, month) {
  if (!series?.length) {
    return null;
  }

  if (month) {
    return series.find((entry) => entry.month === month) || series[series.length - 1];
  }

  return series[series.length - 1];
}

function scoreLevel(score) {
  if (score >= 80) {
    return 'good';
  }
  if (score >= 60) {
    return 'moderate';
  }
  return 'attention';
}

function buildSnapshotFromLive(latest, city, country) {
  const esgMetrics = buildEsgFromAirQuality(latest.airQuality || {});
  return {
    location: latest.location || city,
    city,
    country: latest.country || country,
    airQuality: latest.airQuality || {},
    esgMetrics,
    sustainabilityScore: buildSustainabilityScore(latest.airQuality || {}, esgMetrics),
    source: latest.source || 'OpenAQ API v3',
    timestamp: latest.timestamp || new Date(),
  };
}

function buildSimulatedSeries(city) {
  const simulated = getSimulatedData(city)[0];
  return defaultMonthOrder.map((month, index) => ({
    ...simulated,
    city,
    month,
    source: 'Simulado (sem histórico OpenAQ para esta cidade)',
    timestamp: new Date(new Date().getFullYear(), index, 15),
  }));
}

async function getCitySeries(city) {
  const matchedCity = supportedCities.find((entry) => entry.name === city);
  if (!matchedCity) {
    return null;
  }

  const history = await fetchCityHistoricalFromOpenAQ(matchedCity.name, matchedCity.country);
  if (history?.series?.length) {
    return {
      series: history.series,
      availableMonths: history.availableMonths,
      source: history.series[history.series.length - 1]?.source,
    };
  }

  const live = await fetchAirQualityByCity(matchedCity.name, matchedCity.country);
  const latest = Array.isArray(live) ? live[0] : null;

  if (latest && !String(latest.source).toLowerCase().includes('simulado')) {
    const snapshot = buildSnapshotFromLive(latest, matchedCity.name, matchedCity.country);
    return {
      series: [{
        ...snapshot,
        month: MONTH_LABELS_PT[new Date().getMonth()],
        source: snapshot.source,
      }],
      availableMonths: [MONTH_LABELS_PT[new Date().getMonth()]],
      source: snapshot.source,
    };
  }

  return {
    series: buildSimulatedSeries(matchedCity.name),
    availableMonths: defaultMonthOrder,
    source: 'Simulado',
  };
}

async function getUnifiedData(req, res) {
  try {
    const { city = 'São Paulo', month } = req.query;

    if (!supportedCities.some((entry) => entry.name === city)) {
      const cityNames = supportedCities.map((c) => c.name);
      return res.status(400).json({ error: `Cidade não encontrada. Disponíveis: ${cityNames.join(', ')}` });
    }

    const { series } = await getCitySeries(city);
    if (!series?.length) {
      return res.status(502).json({ error: 'Não foi possível obter dados da OpenAQ para a cidade informada.' });
    }

    if (month) {
      let monthData = series.find((entry) => entry.month === month);
      if (!monthData) {
        monthData = series[series.length - 1];
      }
      return res.json(monthData);
    }

    res.json(series);
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

    const { series, source } = await getCitySeries(city);
    if (!series?.length) {
      return res.status(502).json({ error: 'Não foi possível obter métricas da OpenAQ.' });
    }

    let monthIndex = series.findIndex((entry) => entry.month === month);
    if (monthIndex < 0) {
      monthIndex = series.length - 1;
    }

    const current = series[monthIndex];
    const previous = series[monthIndex > 0 ? monthIndex - 1 : 0];
    const resolvedMonth = current.month;

    const metrics = {
      month: resolvedMonth,
      requestedMonth: month,
      previousMonth: monthIndex > 0 ? series[monthIndex - 1].month : resolvedMonth,
      source,
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

async function getUnifiedMap(req, res) {
  try {
    const { month = 'Jun' } = req.query;

    const cities = await Promise.all(
      supportedCities.map(async (cityMeta) => {
        const { series, source } = await getCitySeries(cityMeta.name);
        const data = pickMonthData(series, month);

        return {
          name: cityMeta.name,
          country: cityMeta.country,
          lat: cityMeta.lat,
          lng: cityMeta.lng,
          mapX: cityMeta.mapX,
          mapY: cityMeta.mapY,
          month: data?.month || month,
          sustainabilityScore: data?.sustainabilityScore ?? null,
          scoreLevel: scoreLevel(Number(data?.sustainabilityScore ?? 0)),
          esgMetrics: data?.esgMetrics || {},
          airQuality: data?.airQuality || {},
          source: data?.source || source || 'Indisponível'
        };
      })
    );

    res.json({
      month,
      cities,
      totalCities: cities.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAvailableCities(req, res) {
  res.json(supportedCities.map(({ name, country, lat, lng }) => ({ name, country, lat, lng })));
}

async function getAvailableMonths(req, res) {
  try {
    const { city } = req.query;

    if (city) {
      if (!supportedCities.some((entry) => entry.name === city)) {
        return res.status(400).json({ error: 'Cidade não encontrada' });
      }

      const { availableMonths } = await getCitySeries(city);
      return res.json(availableMonths?.length ? availableMonths : defaultMonthOrder);
    }

    res.json(defaultMonthOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getUnifiedData,
  getUnifiedMetrics,
  getUnifiedMap,
  getAvailableCities,
  getAvailableMonths,
};
