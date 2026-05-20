const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { jwtSecret } = require('../config/env');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401);
    }

    if (!jwtSecret) {
      throw new AppError('JWT_SECRET não configurado no servidor', 500);
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new AppError('Usuário não encontrado', 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Token inválido ou expirado', 401));
    }

    return next(error);
  }
}

function authorizeSelf(req, res, next) {
  if (req.user._id.toString() !== req.params.id) {
    return next(new AppError('Acesso negado', 403));
  }

  return next();
}

module.exports = {
  authenticate,
  authorizeSelf
};
