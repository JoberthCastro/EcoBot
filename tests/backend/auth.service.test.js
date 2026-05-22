const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authService = require('../../backend/src/services/auth.service');
const User = require('../../backend/src/models/User');
const AppError = require('../../backend/src/utils/AppError');

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-ecobot';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('auth.service', () => {
  const userData = {
    nome: 'Service Test',
    email: 'service@ecobot.local',
    senha: 'senha456'
  };

  describe('register', () => {
    it('deve registrar e retornar token', async () => {
      const result = await authService.register(userData);

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email);
    });

    it('deve lançar erro 409 para e-mail duplicado', async () => {
      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toMatchObject({
        message: 'E-mail já cadastrado',
        statusCode: 409
      });
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await authService.register(userData);
    });

    it('deve autenticar com credenciais corretas', async () => {
      const result = await authService.login({
        email: userData.email,
        senha: userData.senha
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email);
    });

    it('deve lançar erro 401 para senha incorreta', async () => {
      await expect(
        authService.login({ email: userData.email, senha: 'errada' })
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        authService.login({ email: userData.email, senha: 'errada' })
      ).rejects.toMatchObject({
        message: 'Credenciais inválidas',
        statusCode: 401
      });
    });
  });
});
