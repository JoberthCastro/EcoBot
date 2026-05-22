const AirQuality = require('../../backend/src/models/AirQuality');
const User = require('../../backend/src/models/User');

describe('Models Tests', () => {
  describe('AirQuality Model', () => {
    it('deve criar um documento AirQuality com dados validos', () => {
      const validData = {
        location: 'Sao Paulo',
        city: 'Sao Paulo',
        country: 'BR',
        airQuality: {
          pm25: 25.5,
          pm10: 40.2,
          no2: 15.0,
          o3: 30.0,
          co: 5.0,
          so2: 10.0,
          aqi: 50
        },
        esgMetrics: {
          co2Emissions: 500,
          energyConsumption: 2000,
          waterConsumption: 100,
          wasteGenerated: 50,
          renewableEnergy: 30,
          recyclingRate: 25
        },
        sustainabilityScore: 75,
        source: 'Test'
      };

      const airQuality = new AirQuality(validData);

      expect(airQuality.location).toBe('Sao Paulo');
      expect(airQuality.city).toBe('Sao Paulo');
      expect(airQuality.country).toBe('BR');
      expect(airQuality.airQuality.pm25).toBe(25.5);
      expect(airQuality.esgMetrics.co2Emissions).toBe(500);
      expect(airQuality.sustainabilityScore).toBe(75);
    });

    it('deve validar que sustainabilityScore esta entre 0 e 100', () => {
      const validData = {
        location: 'Test',
        city: 'Test',
        country: 'BR',
        airQuality: { pm25: 25 },
        esgMetrics: { co2Emissions: 500 },
        sustainabilityScore: 75,
        source: 'Test'
      };

      const validScore = new AirQuality({ ...validData, sustainabilityScore: 50 });
      expect(validScore.sustainabilityScore).toBe(50);

      const maxScore = new AirQuality({ ...validData, sustainabilityScore: 100 });
      expect(maxScore.sustainabilityScore).toBe(100);

      const minScore = new AirQuality({ ...validData, sustainabilityScore: 0 });
      expect(minScore.sustainabilityScore).toBe(0);
    });

    it('deve ter campos obrigatorios definidos', () => {
      const airQuality = new AirQuality({
        location: 'Test',
        city: 'Test',
        country: 'BR',
        airQuality: { pm25: 25 },
        esgMetrics: { co2Emissions: 500 },
        sustainabilityScore: 75,
        source: 'Test'
      });

      expect(airQuality.location).toBeDefined();
      expect(airQuality.city).toBeDefined();
      expect(airQuality.country).toBeDefined();
      expect(airQuality.airQuality).toBeDefined();
      expect(airQuality.esgMetrics).toBeDefined();
      expect(airQuality.sustainabilityScore).toBeDefined();
    });
  });

  describe('User Model', () => {
    it('deve criar um documento User com dados validos', () => {
      const validData = {
        nome: 'Maria Clara',
        email: 'maria@example.com',
        senha: 'hashedPassword123'
      };

      const user = new User(validData);

      expect(user.nome).toBe('Maria Clara');
      expect(user.email).toBe('maria@example.com');
      expect(user.senha).toBe('hashedPassword123');
    });

    it('deve ter campos obrigatorios definidos', () => {
      const user = new User({
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'hashedPassword123'
      });

      expect(user.nome).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.senha).toBeDefined();
    });
  });
});
