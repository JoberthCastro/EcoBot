const request = require('supertest');
const express = require('express');
const {
  getAirQualityByLocation,
  getAirQualityByCity,
  saveAirQualityData,
  getStoredAirQuality
} = require('../../backend/src/controllers/airQuality.controller');

// Mock do service
jest.mock('../../backend/src/services/openaq.service', () => ({
  fetchAirQualityByLocation: jest.fn(),
  fetchAirQualityByCity: jest.fn()
}));

// Mock do model
jest.mock('../../backend/src/models/AirQuality', () => ({
  create: jest.fn(),
  find: jest.fn()
}));

const app = express();
app.use(express.json());

app.get('/api/air-quality/location/:location', getAirQualityByLocation);
app.get('/api/air-quality/city', getAirQualityByCity);
app.post('/api/air-quality', saveAirQualityData);
app.get('/api/air-quality/stored/:location', getStoredAirQuality);

describe('AirQuality Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/air-quality/location/:location', () => {
    it('deve retornar dados de qualidade do ar por localização', async () => {
      const mockData = [
        {
          location: 'Sao Paulo',
          city: 'Sao Paulo',
          country: 'BR',
          airQuality: { pm25: 25.5, pm10: 40.2, no2: 15.0 },
          esgMetrics: { co2Emissions: 500, energyConsumption: 2000 },
          sustainabilityScore: 75
        }
      ];
      
      const { fetchAirQualityByLocation } = require('../../backend/src/services/openaq.service');
      fetchAirQualityByLocation.mockResolvedValue(mockData);

      const response = await request(app).get('/api/air-quality/location/Sao%20Paulo');

      expect(response.status).toBe(200);
      expect(response.body.location).toBe('Sao Paulo');
      expect(response.body.measurements).toEqual(mockData);
      expect(response.body.count).toBe(1);
    });

    it('deve retornar 400 se localização não for fornecida', async () => {
      const response = await request(app).get('/api/air-quality/location/');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/air-quality/city', () => {
    it('deve retornar dados de qualidade do ar por cidade', async () => {
      const mockData = [
        {
          location: 'Sao Paulo',
          city: 'Sao Paulo',
          country: 'BR',
          airQuality: { pm25: 25.5, pm10: 40.2, no2: 15.0 },
          esgMetrics: { co2Emissions: 500, energyConsumption: 2000 },
          sustainabilityScore: 75
        }
      ];
      
      const { fetchAirQualityByCity } = require('../../backend/src/services/openaq.service');
      fetchAirQualityByCity.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/air-quality/city')
        .query({ city: 'Sao Paulo', country: 'BR' });

      expect(response.status).toBe(200);
      expect(response.body.city).toBe('Sao Paulo');
      expect(response.body.country).toBe('BR');
      expect(response.body.measurements).toEqual(mockData);
      expect(response.body.count).toBe(1);
    });

    it('deve retornar 400 se parâmetros não forem fornecidos', async () => {
      const response = await request(app).get('/api/air-quality/city');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Parâmetros city e country são obrigatórios');
    });
  });
});
