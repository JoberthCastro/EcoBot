const {
  fetchAirQualityByLocation,
  fetchAirQualityByCity,
  getSimulatedData,
  normalizeOpenAQData
} = require('../../backend/src/services/openaq.service');

// Mock do axios
jest.mock('axios');
const axios = require('axios');

// Mock do fs
jest.mock('fs');
const fs = require('fs');

// Mock do path
jest.mock('path');
const path = require('path');

describe('OpenAQ Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSimulatedData', () => {
    it('deve retornar dados simulados com estrutura ESG completa', () => {
      const location = 'Sao Paulo';
      const data = getSimulatedData(location);

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].location).toBe(location);
      expect(data[0].airQuality).toBeDefined();
      expect(data[0].esgMetrics).toBeDefined();
      expect(data[0].sustainabilityScore).toBeDefined();
    });

    it('deve retornar valores numéricos para métricas de qualidade do ar', () => {
      const data = getSimulatedData('Test');
      
      expect(typeof data[0].airQuality.pm25).toBe('number');
      expect(typeof data[0].airQuality.pm10).toBe('number');
      expect(typeof data[0].airQuality.no2).toBe('number');
      expect(typeof data[0].airQuality.o3).toBe('number');
      expect(typeof data[0].airQuality.co).toBe('number');
      expect(typeof data[0].airQuality.so2).toBe('number');
      expect(data[0].airQuality.pm25).toBeGreaterThanOrEqual(0);
    });

    it('deve retornar valores numéricos para métricas ESG', () => {
      const data = getSimulatedData('Test');
      
      expect(typeof data[0].esgMetrics.co2Emissions).toBe('number');
      expect(typeof data[0].esgMetrics.energyConsumption).toBe('number');
      expect(typeof data[0].esgMetrics.waterConsumption).toBe('number');
      expect(typeof data[0].esgMetrics.wasteGenerated).toBe('number');
      expect(typeof data[0].esgMetrics.renewableEnergy).toBe('number');
      expect(typeof data[0].esgMetrics.recyclingRate).toBe('number');
    });

    it('deve retornar pontuação de sustentabilidade entre 0 e 100', () => {
      const data = getSimulatedData('Test');
      
      expect(data[0].sustainabilityScore).toBeGreaterThanOrEqual(0);
      expect(data[0].sustainabilityScore).toBeLessThanOrEqual(100);
    });
  });

  describe('normalizeOpenAQData', () => {
    it('deve retornar array vazio se measurements for null', () => {
      const result = normalizeOpenAQData(null);
      expect(result).toEqual([]);
    });

    it('deve retornar array vazio se measurements não for array', () => {
      const result = normalizeOpenAQData({});
      expect(result).toEqual([]);
    });

    it('deve normalizar dados da OpenAQ corretamente', () => {
      const mockMeasurements = [
        {
          location: 'Test Location',
          country: 'BR',
          city: 'Test City',
          parameter: 'pm25',
          value: 25.5,
          datetime: { utc: '2024-01-01T00:00:00Z' }
        }
      ];

      const result = normalizeOpenAQData(mockMeasurements);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0].location).toBe('Test Location');
      expect(result[0].country).toBe('BR');
      expect(result[0].city).toBe('Test City');
    });
  });

  describe('fetchAirQualityByLocation', () => {
    it('deve retornar dados simulados quando não houver API key', async () => {
      // Mock para não encontrar API key
      fs.readFileSync.mockReturnValue('');
      
      const data = await fetchAirQualityByLocation('Sao Paulo');
      
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].source).toContain('Simulado');
    });
  });

  describe('fetchAirQualityByCity', () => {
    it('deve retornar dados simulados quando não houver API key', async () => {
      // Mock para não encontrar API key
      fs.readFileSync.mockReturnValue('');
      
      const data = await fetchAirQualityByCity('Sao Paulo', 'BR');
      
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].source).toContain('Simulado');
    });
  });
});
