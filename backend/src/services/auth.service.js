const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const sanitizeUser = require('../utils/sanitizeUser');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

function assertJwtConfigured() {
  if (!jwtSecret) {
    throw new AppError('JWT_SECRET não configurado no servidor', 500);
  }
}

function signToken(userId) {
  assertJwtConfigured();
  return jwt.sign({ sub: userId.toString() }, jwtSecret, {
    expiresIn: jwtExpiresIn
  });
}

async function register({ nome, email, senha }) {
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError('E-mail já cadastrado', 409);
  }

  const user = await User.create({ nome, email, senha });
  const token = signToken(user._id);

  return { user: sanitizeUser(user), token };
}

async function login({ email, senha }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+senha');

  if (!user) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const isPasswordValid = await user.comparePassword(senha);

  if (!isPasswordValid) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const token = signToken(user._id);

  return { user: sanitizeUser(user), token };
}

module.exports = {
  register,
  login
};
