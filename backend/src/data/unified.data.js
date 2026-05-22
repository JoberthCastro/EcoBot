/**
 * Dados simulados unificados para EcoBot.
 * Chave: cidade
 * Cada cidade tem airQuality + esgMetrics por mês e um sustainabilityScore
 */
const unifiedData = {
  'São Paulo': {
    country: 'BR',
    months: {
      Jan: {
        airQuality: { pm25: 28.5, pm10: 42.0, no2: 22.1, o3: 35.4, co: 4.5, so2: 9.2, aqi: 45 },
        esgMetrics: { co2Emissions: 820, energyConsumption: 4200, waterConsumption: 180, wasteGenerated: 55, renewableEnergy: 18, recyclingRate: 22 },
        sustainabilityScore: 65
      },
      Fev: {
        airQuality: { pm25: 26.0, pm10: 39.5, no2: 20.8, o3: 33.0, co: 4.2, so2: 8.5, aqi: 42 },
        esgMetrics: { co2Emissions: 780, energyConsumption: 4000, waterConsumption: 170, wasteGenerated: 52, renewableEnergy: 20, recyclingRate: 24 },
        sustainabilityScore: 68
      },
      Mar: {
        airQuality: { pm25: 24.2, pm10: 37.0, no2: 19.5, o3: 31.2, co: 3.9, so2: 7.8, aqi: 40 },
        esgMetrics: { co2Emissions: 750, energyConsumption: 3800, waterConsumption: 165, wasteGenerated: 50, renewableEnergy: 22, recyclingRate: 26 },
        sustainabilityScore: 70
      },
      Abr: {
        airQuality: { pm25: 20.5, pm10: 34.0, no2: 17.2, o3: 29.5, co: 3.5, so2: 7.0, aqi: 37 },
        esgMetrics: { co2Emissions: 700, energyConsumption: 3600, waterConsumption: 150, wasteGenerated: 48, renewableEnergy: 24, recyclingRate: 28 },
        sustainabilityScore: 72
      },
      Mai: {
        airQuality: { pm25: 18.0, pm10: 31.0, no2: 15.0, o3: 27.0, co: 3.2, so2: 6.5, aqi: 34 },
        esgMetrics: { co2Emissions: 650, energyConsumption: 3400, waterConsumption: 140, wasteGenerated: 45, renewableEnergy: 26, recyclingRate: 30 },
        sustainabilityScore: 75
      },
      Jun: {
        airQuality: { pm25: 16.5, pm10: 28.5, no2: 14.0, o3: 25.0, co: 2.8, so2: 5.8, aqi: 30 },
        esgMetrics: { co2Emissions: 600, energyConsumption: 3200, waterConsumption: 130, wasteGenerated: 42, renewableEnergy: 28, recyclingRate: 32 },
        sustainabilityScore: 78
      }
    }
  },
  'Rio de Janeiro': {
    country: 'BR',
    months: {
      Jan: {
        airQuality: { pm25: 22.0, pm10: 38.0, no2: 18.5, o3: 40.0, co: 3.8, so2: 7.5, aqi: 42 },
        esgMetrics: { co2Emissions: 760, energyConsumption: 3900, waterConsumption: 195, wasteGenerated: 58, renewableEnergy: 22, recyclingRate: 20 },
        sustainabilityScore: 66
      },
      Fev: {
        airQuality: { pm25: 20.5, pm10: 35.5, no2: 17.2, o3: 38.0, co: 3.5, so2: 7.0, aqi: 40 },
        esgMetrics: { co2Emissions: 720, energyConsumption: 3700, waterConsumption: 185, wasteGenerated: 55, renewableEnergy: 24, recyclingRate: 22 },
        sustainabilityScore: 69
      },
      Mar: {
        airQuality: { pm25: 19.0, pm10: 33.0, no2: 16.0, o3: 36.0, co: 3.2, so2: 6.5, aqi: 38 },
        esgMetrics: { co2Emissions: 690, energyConsumption: 3500, waterConsumption: 175, wasteGenerated: 52, renewableEnergy: 26, recyclingRate: 24 },
        sustainabilityScore: 71
      },
      Abr: {
        airQuality: { pm25: 17.5, pm10: 30.5, no2: 14.5, o3: 33.0, co: 2.9, so2: 6.0, aqi: 35 },
        esgMetrics: { co2Emissions: 640, energyConsumption: 3300, waterConsumption: 160, wasteGenerated: 49, renewableEnergy: 28, recyclingRate: 26 },
        sustainabilityScore: 74
      },
      Mai: {
        airQuality: { pm25: 15.5, pm10: 28.0, no2: 13.0, o3: 30.5, co: 2.6, so2: 5.5, aqi: 32 },
        esgMetrics: { co2Emissions: 590, energyConsumption: 3100, waterConsumption: 148, wasteGenerated: 46, renewableEnergy: 30, recyclingRate: 28 },
        sustainabilityScore: 76
      },
      Jun: {
        airQuality: { pm25: 14.0, pm10: 25.5, no2: 12.0, o3: 28.0, co: 2.4, so2: 5.0, aqi: 29 },
        esgMetrics: { co2Emissions: 540, energyConsumption: 2900, waterConsumption: 138, wasteGenerated: 43, renewableEnergy: 32, recyclingRate: 30 },
        sustainabilityScore: 79
      }
    }
  },
  'Belo Horizonte': {
    country: 'BR',
    months: {
      Jan: {
        airQuality: { pm25: 25.0, pm10: 40.0, no2: 20.0, o3: 32.0, co: 4.0, so2: 8.0, aqi: 43 },
        esgMetrics: { co2Emissions: 790, energyConsumption: 4100, waterConsumption: 175, wasteGenerated: 54, renewableEnergy: 20, recyclingRate: 21 },
        sustainabilityScore: 64
      },
      Fev: {
        airQuality: { pm25: 23.5, pm10: 37.5, no2: 18.8, o3: 30.5, co: 3.7, so2: 7.5, aqi: 41 },
        esgMetrics: { co2Emissions: 750, energyConsumption: 3900, waterConsumption: 165, wasteGenerated: 51, renewableEnergy: 22, recyclingRate: 23 },
        sustainabilityScore: 67
      },
      Mar: {
        airQuality: { pm25: 21.8, pm10: 35.0, no2: 17.5, o3: 29.0, co: 3.4, so2: 7.0, aqi: 39 },
        esgMetrics: { co2Emissions: 710, energyConsumption: 3700, waterConsumption: 155, wasteGenerated: 49, renewableEnergy: 24, recyclingRate: 25 },
        sustainabilityScore: 70
      },
      Abr: {
        airQuality: { pm25: 19.5, pm10: 32.5, no2: 15.8, o3: 27.0, co: 3.1, so2: 6.3, aqi: 36 },
        esgMetrics: { co2Emissions: 660, energyConsumption: 3500, waterConsumption: 145, wasteGenerated: 46, renewableEnergy: 26, recyclingRate: 27 },
        sustainabilityScore: 73
      },
      Mai: {
        airQuality: { pm25: 17.0, pm10: 29.5, no2: 14.2, o3: 25.0, co: 2.8, so2: 5.8, aqi: 33 },
        esgMetrics: { co2Emissions: 610, energyConsumption: 3300, waterConsumption: 135, wasteGenerated: 44, renewableEnergy: 28, recyclingRate: 29 },
        sustainabilityScore: 75
      },
      Jun: {
        airQuality: { pm25: 15.5, pm10: 27.0, no2: 13.0, o3: 23.0, co: 2.5, so2: 5.2, aqi: 30 },
        esgMetrics: { co2Emissions: 560, energyConsumption: 3100, waterConsumption: 125, wasteGenerated: 41, renewableEnergy: 30, recyclingRate: 31 },
        sustainabilityScore: 78
      }
    }
  },
  'Curitiba': {
    country: 'BR',
    months: {
      Jan: {
        airQuality: { pm25: 18.0, pm10: 32.0, no2: 15.5, o3: 28.0, co: 3.2, so2: 6.5, aqi: 35 },
        esgMetrics: { co2Emissions: 680, energyConsumption: 3600, waterConsumption: 150, wasteGenerated: 48, renewableEnergy: 30, recyclingRate: 35 },
        sustainabilityScore: 74
      },
      Fev: {
        airQuality: { pm25: 16.5, pm10: 30.0, no2: 14.2, o3: 26.5, co: 2.9, so2: 6.0, aqi: 33 },
        esgMetrics: { co2Emissions: 640, energyConsumption: 3400, waterConsumption: 142, wasteGenerated: 45, renewableEnergy: 32, recyclingRate: 37 },
        sustainabilityScore: 76
      },
      Mar: {
        airQuality: { pm25: 15.0, pm10: 28.0, no2: 13.0, o3: 25.0, co: 2.7, so2: 5.5, aqi: 31 },
        esgMetrics: { co2Emissions: 600, energyConsumption: 3200, waterConsumption: 135, wasteGenerated: 42, renewableEnergy: 34, recyclingRate: 39 },
        sustainabilityScore: 78
      },
      Abr: {
        airQuality: { pm25: 13.5, pm10: 25.5, no2: 11.8, o3: 23.0, co: 2.4, so2: 5.0, aqi: 28 },
        esgMetrics: { co2Emissions: 550, energyConsumption: 3000, waterConsumption: 125, wasteGenerated: 39, renewableEnergy: 36, recyclingRate: 41 },
        sustainabilityScore: 80
      },
      Mai: {
        airQuality: { pm25: 12.0, pm10: 23.0, no2: 10.5, o3: 21.0, co: 2.1, so2: 4.5, aqi: 25 },
        esgMetrics: { co2Emissions: 500, energyConsumption: 2800, waterConsumption: 115, wasteGenerated: 36, renewableEnergy: 38, recyclingRate: 43 },
        sustainabilityScore: 82
      },
      Jun: {
        airQuality: { pm25: 10.5, pm10: 21.0, no2: 9.5, o3: 19.0, co: 1.9, so2: 4.0, aqi: 23 },
        esgMetrics: { co2Emissions: 450, energyConsumption: 2600, waterConsumption: 105, wasteGenerated: 33, renewableEnergy: 40, recyclingRate: 45 },
        sustainabilityScore: 85
      }
    }
  }
};

const monthOrder = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

function getCities() {
  return Object.keys(unifiedData).map(city => ({
    name: city,
    country: unifiedData[city].country
  }));
}

function getDataForCityAndMonth(city, month) {
  const cityData = unifiedData[city];
  if (!cityData) return null;

  if (month && cityData.months[month]) {
    const monthData = cityData.months[month];
    return {
      location: city,
      city,
      country: cityData.country,
      month,
      airQuality: monthData.airQuality,
      esgMetrics: monthData.esgMetrics,
      sustainabilityScore: monthData.sustainabilityScore,
      source: 'Simulado (EcoBot Unified Data)',
      timestamp: new Date(2024, monthOrder.indexOf(month), 15)
    };
  }

  // Se não passar mês, retorna array com todos os meses
  return monthOrder.map(m => {
    const md = cityData.months[m];
    return {
      location: city,
      city,
      country: cityData.country,
      month: m,
      airQuality: md.airQuality,
      esgMetrics: md.esgMetrics,
      sustainabilityScore: md.sustainabilityScore,
      source: 'Simulado (EcoBot Unified Data)',
      timestamp: new Date(2024, monthOrder.indexOf(m), 15)
    };
  });
}

function getMetricsForCity(city) {
  const cityData = unifiedData[city];
  if (!cityData) return null;
  const latestMonth = monthOrder[monthOrder.length - 1];
  const md = cityData.months[latestMonth];
  return {
    energyConsumption: {
      current: md.esgMetrics.energyConsumption,
      previous: cityData.months[monthOrder[monthOrder.length - 2]].esgMetrics.energyConsumption,
      reduction: parseFloat((((cityData.months[monthOrder[monthOrder.length - 2]].esgMetrics.energyConsumption - md.esgMetrics.energyConsumption) / cityData.months[monthOrder[monthOrder.length - 2]].esgMetrics.energyConsumption) * 100).toFixed(1))
    },
    digitalStorage: {
      current: md.esgMetrics.recyclingRate * 15,
      previous: cityData.months[monthOrder[monthOrder.length - 2]].esgMetrics.recyclingRate * 15,
      reduction: parseFloat((((cityData.months[monthOrder[monthOrder.length - 2]].esgMetrics.recyclingRate * 15 - md.esgMetrics.recyclingRate * 15) / (cityData.months[monthOrder[monthOrder.length - 2]].esgMetrics.recyclingRate * 15)) * 100).toFixed(1))
    },
    carbonEmissions: {
      current: md.esgMetrics.co2Emissions,
      previous: cityData.months[monthOrder[monthOrder.length - 2]].esgMetrics.co2Emissions,
      reduction: parseFloat((((cityData.months[monthOrder[monthOrder.length - 2]].esgMetrics.co2Emissions - md.esgMetrics.co2Emissions) / cityData.months[monthOrder[monthOrder.length - 2]].esgMetrics.co2Emissions) * 100).toFixed(1))
    }
  };
}

module.exports = {
  unifiedData,
  getCities,
  getDataForCityAndMonth,
  getMetricsForCity,
  monthOrder
};
