const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());

// Importar rotas
const apiRoutes = require('../../backend/src/routes/index');
app.use('/api', apiRoutes);

describe('Integration Tests - API Endpoints', () => {
  describe('Health Check', () => {
    it('GET /api/health deve retornar status ok', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('EcoBot API');
    });
  });

  describe('Metrics Endpoint', () => {
    it('GET /api/metrics deve retornar dados de metricas', async () => {
      const response = await request(app).get('/api/metrics');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe('Suggestions Endpoint', () => {
    it('GET /api/suggestions deve retornar sugestoes', async () => {
      const response = await request(app).get('/api/suggestions');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Air Quality Endpoints', () => {
    it('GET /api/air-quality/location/:location deve retornar dados ESG', async () => {
      const response = await request(app).get('/api/air-quality/location/Sao%20Paulo');
      
      expect(response.status).toBe(200);
      expect(response.body.location).toBe('Sao Paulo');
      expect(Array.isArray(response.body.measurements)).toBe(true);
      expect(response.body.measurements.length).toBeGreaterThan(0);
      
      // Validar estrutura ESG
      const measurement = response.body.measurements[0];
      expect(measurement.airQuality).toBeDefined();
      expect(measurement.esgMetrics).toBeDefined();
      expect(measurement.sustainabilityScore).toBeDefined();
      expect(typeof measurement.sustainabilityScore).toBe('number');
    });

    it('GET /api/air-quality/city deve retornar dados ESG com parametros corretos', async () => {
      const response = await request(app)
        .get('/api/air-quality/city')
        .query({ city: 'Sao Paulo', country: 'BR' });
      
      expect(response.status).toBe(200);
      expect(response.body.city).toBe('Sao Paulo');
      expect(response.body.country).toBe('BR');
      expect(Array.isArray(response.body.measurements)).toBe(true);
    });

    it('GET /api/air-quality/city deve retornar 400 sem parametros obrigatorios', async () => {
      const response = await request(app).get('/api/air-quality/city');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Chat Endpoint', () => {
    it('POST /api/chat deve responder com mensagem do bot', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Como reduzir CO2?' });
      
      expect(response.status).toBe(200);
      expect(response.body.response).toBeDefined();
      expect(typeof response.body.response).toBe('string');
    });

    it('POST /api/chat deve responder mesmo sem mensagem (comportamento atual)', async () => {
      const response = await request(app).post('/api/chat').send({});
      
      // O controller atual responde 200 mesmo sem mensagem
      expect(response.status).toBe(200);
    });
  });
});
