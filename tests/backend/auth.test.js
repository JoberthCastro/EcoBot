const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../../backend/src/app');
const User = require('../../backend/src/models/User');

let mongoServer;

const testUser = {
  nome: 'Usuário Teste',
  email: 'teste@ecobot.local',
  senha: 'senha123'
};

beforeAll(async () => {
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

describe('POST /api/auth/register', () => {
  it('deve criar usuário e retornar token JWT', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe('string');
    expect(response.body.user).toMatchObject({
      nome: testUser.nome,
      email: testUser.email
    });
    expect(response.body.user.senha).toBeUndefined();

    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded.sub).toBe(response.body.user._id);
  });

  it('deve retornar 409 quando o e-mail já existe', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(409);

    expect(response.body.message).toBe('E-mail já cadastrado');
  });

  it('deve retornar 400 quando faltam campos obrigatórios', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: testUser.email })
      .expect(400);

    expect(response.body.message).toContain('Campos obrigatórios');
  });

  it('deve retornar 400 para e-mail inválido', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'email-invalido' })
      .expect(400);

    expect(response.body.message).toBe('E-mail inválido');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(testUser);
  });

  it('deve autenticar com credenciais válidas e retornar token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, senha: testUser.senha })
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(testUser.email);
  });

  it('deve retornar 401 para senha incorreta', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, senha: 'senha-errada' })
      .expect(401);

    expect(response.body.message).toBe('Credenciais inválidas');
  });

  it('deve retornar 401 para e-mail não cadastrado', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@ecobot.local', senha: testUser.senha })
      .expect(401);

    expect(response.body.message).toBe('Credenciais inválidas');
  });
});

describe('GET /api/auth/me', () => {
  it('deve retornar 401 sem token', async () => {
    const response = await request(app).get('/api/auth/me').expect(401);

    expect(response.body.message).toBe('Token não fornecido');
  });

  it('deve retornar 401 com token inválido', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token-invalido')
      .expect(401);

    expect(response.body.message).toBe('Token inválido ou expirado');
  });

  it('deve retornar o perfil do usuário autenticado', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const { token } = registerResponse.body;

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user.senha).toBeUndefined();
  });
});

describe('Rotas protegidas de usuários', () => {
  it('deve bloquear listagem de usuários sem token', async () => {
    await request(app).get('/api/users').expect(401);
  });

  it('deve listar usuários com token válido', async () => {
    const { body } = await request(app).post('/api/auth/register').send(testUser);

    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${body.token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Model User', () => {
  it('deve armazenar senha com hash, não em texto puro', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const userInDb = await User.findOne({ email: testUser.email }).select('+senha');

    expect(userInDb.senha).not.toBe(testUser.senha);
    expect(userInDb.senha).toMatch(/^\$2[aby]\$/);

    const isValid = await userInDb.comparePassword(testUser.senha);
    expect(isValid).toBe(true);
  });
});
