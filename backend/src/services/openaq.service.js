const axios = require('axios');

const OPENAQ_BASE_URL = 'https://api.openaq.org/v3';

/** Coordenadas aproximadas das cidades suportadas (busca geoespacial OpenAQ v3). */
const CITY_COORDINATES = {
  'sao paulo': { latitude: -23.5505, longitude: -46.6333 },
  'rio de janeiro': { latitude: -22.9068, longitude: -43.1729 },
  'belo horizonte': { latitude: -19.9167, longitude: -43.9345 },
  curitiba: { latitude: -25.4284, longitude: -49.2733 },
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getCountryCode(location) {
  if (!location?.country) return '';
  if (typeof location.country === 'string') return location.country;
  return location.country.code || '';
}

function pickBestLocation(locations, query, country) {
  const normalizedQuery = normalizeText(query);
  const normalizedCountry = normalizeText(country);

  const candidates = locations.filter((loc) => {
    if (!normalizedCountry) {
      return true;
    }
    return normalizeText(getCountryCode(loc)) === normalizedCountry;
  });

  const scopedLocations = candidates.length > 0 ? candidates : locations;

  const ranked = scopedLocations
    .map((loc) => {
      const name = normalizeText(loc.name);
      const locality = normalizeText(loc.locality);

      let score = -1;
      if (locality === normalizedQuery || name === normalizedQuery) score = 4;
      else if (locality.startsWith(normalizedQuery) || name.startsWith(normalizedQuery)) score = 3;
      else if (locality.includes(normalizedQuery) || name.includes(normalizedQuery)) score = 2;
      else if ((locality.length >= 3 && normalizedQuery.includes(locality)) || (name.length >= 3 && normalizedQuery.includes(name))) score = 1;

      return { loc, score };
    })
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length) {
    return ranked[0].loc;
  }

  if (locations.length > 0) {
    const sorted = sortLocationsByDistance(locations);
    return sorted[0];
  }

  return null;
}

function sortLocationsByDistance(locations) {
  return [...locations].sort((a, b) => {
    const distA = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
    const distB = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
    return distA - distB;
  });
}

function formatCoordinates(latitude, longitude) {
  return `${Number(latitude).toFixed(4)},${Number(longitude).toFixed(4)}`;
}

function getOpenAQApiKey() {
  if (process.env.OPENAQ_API_KEY) {
    return process.env.OPENAQ_API_KEY.trim();
  }
  return '';
}

function hashString(str) {
  const normalized = normalizeText(str);
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function seededValue(seed, index, min, max) {
  const x = Math.sin(seed + index * 12.9898) * 43758.5453;
  const rand = x - Math.floor(x);
  return parseFloat((min + rand * (max - min)).toFixed(2));
}

async function fetchLocationsPage(headers, params) {
  try {
    const response = await axios.get(`${OPENAQ_BASE_URL}/locations`, { headers, params });
    return response.data.results || [];
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data?.detail || error.response?.data;
    console.warn(
      `[OpenAQ Service] Falha em /locations (${status || 'erro'}):`,
      JSON.stringify(params),
      detail ? JSON.stringify(detail) : error.message
    );
    throw error;
  }
}

async function resolveLocationForCity(city, country, headers) {
  const normalizedCity = normalizeText(city);
  const iso = String(country || 'BR').toUpperCase();
  const coords = CITY_COORDINATES[normalizedCity];

  if (coords) {
    try {
      const nearbyLocations = await fetchLocationsPage(headers, {
        coordinates: formatCoordinates(coords.latitude, coords.longitude),
        radius: 25000,
        limit: 100,
      });

      const nearbyMatch = pickBestLocation(nearbyLocations, city, country);
      if (nearbyMatch) {
        return nearbyMatch;
      }
    } catch (error) {
      if (error.response?.status !== 422) {
        throw error;
      }
    }
  }

  for (let page = 1; page <= 5; page += 1) {
    let locations;
    try {
      locations = await fetchLocationsPage(headers, {
        iso,
        limit: 1000,
        page,
      });
    } catch (error) {
      if (error.response?.status === 422 && page > 1) {
        break;
      }
      throw error;
    }

    if (!locations.length) {
      break;
    }

    const match = pickBestLocation(locations, city, country);
    if (match) {
      return match;
    }

    if (locations.length < 1000) {
      break;
    }
  }

  return null;
}

async function fetchAirQualityFromOpenAQ(query, country) {
  const OPENAQ_API_KEY = getOpenAQApiKey();
  if (!OPENAQ_API_KEY) {
    console.warn('[OpenAQ Service] API key não definida - usando dados simulados');
    return getSimulatedData(query);
  }

  try {
    const headers = { 'X-API-Key': OPENAQ_API_KEY };
    const matchedLocation = await resolveLocationForCity(query, country, headers);

    if (!matchedLocation) {
      console.warn(`[OpenAQ Service] Cidade "${query}" não encontrada - usando dados simulados`);
      return getSimulatedData(query);
    }

    const latestResponse = await axios.get(`${OPENAQ_BASE_URL}/locations/${matchedLocation.id}/latest`, {
      headers,
    });

    const latestData = latestResponse.data.results || [];
    return convertOpenAQToESG(latestData, matchedLocation);
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data?.detail || error.response?.data;
    console.error(
      '[OpenAQ Service] Erro ao buscar dados:',
      status ? `HTTP ${status}` : error.message,
      detail ? JSON.stringify(detail) : ''
    );
    console.warn('[OpenAQ Service] Usando dados simulados como fallback');
    return getSimulatedData(query);
  }
}

async function fetchAirQualityByLocation(location) {
  return fetchAirQualityFromOpenAQ(location, 'BR');
}

async function fetchAirQualityByCity(city, country) {
  return fetchAirQualityFromOpenAQ(city, country);
}

function convertOpenAQToESG(openAQData, locationInfo) {
  if (!openAQData || openAQData.length === 0) {
    return getSimulatedData(locationInfo?.name || 'Desconhecido');
  }

  const measurements = {
    pm25: null,
    pm10: null,
    no2: null,
    o3: null,
    co: null,
    so2: null,
    aqi: 0
  };

  openAQData.forEach(data => {
    if (data.value === undefined || data.value === null) return;
    const param = (data.parameter || '').toLowerCase().replace('.', '');
    if (param === 'pm25') measurements.pm25 = data.value;
    else if (param === 'pm10') measurements.pm10 = data.value;
    else if (param === 'no2') measurements.no2 = data.value;
    else if (param === 'o3') measurements.o3 = data.value;
    else if (param === 'co') measurements.co = data.value;
    else if (param === 'so2') measurements.so2 = data.value;
  });

  measurements.aqi = Math.max(
    measurements.pm25 || 0,
    measurements.pm10 || 0,
    measurements.no2 || 0,
    measurements.o3 || 0,
    measurements.co || 0,
    measurements.so2 || 0
  ) || 50;

  const aqi = measurements.aqi;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const co2Emissions = parseFloat(clamp((aqi * 14) + 180, 150, 1200).toFixed(1));
  const energyConsumption = parseFloat(clamp((aqi * 42) + 1100, 900, 5200).toFixed(1));
  const waterConsumption = parseFloat(clamp((aqi * 1.1) + 70, 50, 260).toFixed(1));
  const wasteGenerated = parseFloat(clamp((aqi * 0.35) + 20, 15, 120).toFixed(1));
  const renewableEnergy = parseFloat(clamp(60 - (aqi * 0.4), 8, 60).toFixed(1));
  const recyclingRate = parseFloat(clamp(55 - (aqi * 0.28), 12, 55).toFixed(1));

  const sustainabilityScore = parseFloat(clamp(
    100 - (aqi * 0.45) + (renewableEnergy * 0.35) + (recyclingRate * 0.25) - (co2Emissions * 0.015),
    0, 100
  ).toFixed(1));

  return [
    {
      location: locationInfo?.name || 'Desconhecido',
      city: locationInfo?.locality || locationInfo?.name || 'Desconhecido',
      country: locationInfo?.country?.code || 'BR',
      airQuality: measurements,
      esgMetrics: {
        co2Emissions,
        energyConsumption,
        waterConsumption,
        wasteGenerated,
        renewableEnergy,
        recyclingRate
      },
      sustainabilityScore: Math.min(100, Math.max(0, sustainabilityScore)),
      timestamp: new Date(),
      source: 'OpenAQ API v3 (Real)'
    }
  ];
}

function getSimulatedData(location) {
  const seed = hashString(location);

  const pm25 = seededValue(seed, 1, 10, 60);
  const pm10 = seededValue(seed, 2, 20, 100);
  const no2 = seededValue(seed, 3, 5, 45);
  const o3 = seededValue(seed, 4, 10, 70);
  const co = seededValue(seed, 5, 1, 11);
  const so2 = seededValue(seed, 6, 2, 22);

  const aqi = Math.max(pm25, pm10, no2, o3, co, so2);

  const co2Emissions = seededValue(seed, 7, 200, 1200);
  const energyConsumption = seededValue(seed, 8, 1000, 5200);
  const waterConsumption = seededValue(seed, 9, 50, 250);
  const wasteGenerated = seededValue(seed, 10, 20, 120);
  const renewableEnergy = seededValue(seed, 11, 10, 55);
  const recyclingRate = seededValue(seed, 12, 15, 50);

  const sustainabilityScore = parseFloat((
    100 - (aqi / 2) +
    (renewableEnergy * 0.5) +
    (recyclingRate * 0.3) -
    (co2Emissions / 100)
  ).toFixed(1));

  return [
    {
      location: location,
      city: location,
      country: 'BR',
      airQuality: {
        pm25,
        pm10,
        no2,
        o3,
        co,
        so2,
        aqi
      },
      esgMetrics: {
        co2Emissions,
        energyConsumption,
        waterConsumption,
        wasteGenerated,
        renewableEnergy,
        recyclingRate
      },
      sustainabilityScore: Math.min(100, Math.max(0, sustainabilityScore)),
      timestamp: new Date(),
      source: 'Simulado (EcoBot ESG Metrics)'
    }
  ];
}

function normalizeOpenAQData(measurements) {
  if (!measurements || !Array.isArray(measurements)) {
    return [];
  }

  return measurements.map((measurement) => {
    const normalized = {
      location: measurement.location || measurement.parameters?.location || 'Desconhecido',
      country: measurement.country || 'BR',
      city: measurement.city || measurement.location || 'Desconhecido',
      measurements: {
        pm25: null,
        pm10: null,
        no2: null,
        o3: null,
        co: null,
        so2: null
      },
      timestamp: measurement.datetime ? new Date(measurement.datetime.utc) : new Date(),
      source: 'OpenAQ'
    };

    if (measurement.parameter && measurement.value !== undefined) {
      const parameter = measurement.parameter.toLowerCase();
      const value = measurement.value;

      if (parameter === 'pm25') normalized.measurements.pm25 = value;
      else if (parameter === 'pm10') normalized.measurements.pm10 = value;
      else if (parameter === 'no2') normalized.measurements.no2 = value;
      else if (parameter === 'o3') normalized.measurements.o3 = value;
      else if (parameter === 'co') normalized.measurements.co = value;
      else if (parameter === 'so2') normalized.measurements.so2 = value;
    }

    return normalized;
  });
}

module.exports = {
  fetchAirQualityByLocation,
  fetchAirQualityByCity,
  normalizeOpenAQData,
  getSimulatedData,
  pickBestLocation,
  resolveLocationForCity,
  sortLocationsByDistance,
  formatCoordinates,
  CITY_COORDINATES,
};
