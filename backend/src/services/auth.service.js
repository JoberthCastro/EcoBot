const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const env = require('../config/env');
const HttpError = require('../utils/httpError');

function requireSecrets() {
  if (!env.jwtAccessSecret) {
    throw new Error('JWT_ACCESS_SECRET não foi definido no ambiente');
  }
  if (!env.jwtRefreshSecret) {
    throw new Error('JWT_REFRESH_SECRET não foi definido no ambiente');
  }
}

function toSafeUser(userDoc) {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.senha;
  return user;
}

function generateTokens(user) {
  requireSecrets();

  const subject = user._id.toString();
  const basePayload = { sub: subject, email: user.email };

  const accessToken = jwt.sign(basePayload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn
  });

  const refreshToken = jwt.sign({ ...basePayload, typ: 'refresh' }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn
  });

  return { accessToken, refreshToken };
}

async function register({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    throw new HttpError(400, 'nome, email e senha são obrigatórios');
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail }).select('_id');
  if (existingUser) {
    throw new HttpError(409, 'E-mail já cadastrado');
  }

  const passwordHash = await bcrypt.hash(String(senha), env.bcryptSaltRounds);
  const user = await User.create({
    nome: String(nome).trim(),
    email: normalizedEmail,
    senha: passwordHash
  });

  const tokens = generateTokens(user);
  return { user: toSafeUser(user), ...tokens };
}

async function login({ email, senha }) {
  if (!email || !senha) {
    throw new HttpError(400, 'email e senha são obrigatórios');
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+senha');
  if (!user) {
    throw new HttpError(401, 'Credenciais inválidas');
  }

  const passwordMatches = await bcrypt.compare(String(senha), user.senha);
  if (!passwordMatches) {
    throw new HttpError(401, 'Credenciais inválidas');
  }

  const tokens = generateTokens(user);
  return { user: toSafeUser(user), ...tokens };
}

module.exports = {
  register,
  login
};

