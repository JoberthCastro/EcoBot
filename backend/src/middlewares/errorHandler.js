const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  console.error(err?.stack || err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'E-mail já cadastrado' });
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador inválido' });
  }

  const statusCode = Number(err?.statusCode) || 500;
  const message = err?.message || 'Erro interno do servidor';

  return res.status(statusCode).json({ message });
}

module.exports = errorHandler;
