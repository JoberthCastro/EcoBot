function errorHandler(err, req, res, next) {
  console.error(err?.stack || err);

  // Erro comum do Mongoose ao receber ObjectId com formato inválido
  if (err?.name === 'CastError' && err?.kind === 'ObjectId') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  // Violação de índice unique no Mongo/Mongoose (ex.: email duplicado)
  if (err?.code === 11000) {
    return res.status(409).json({ message: 'Registro já existe' });
  }

  const statusCode = Number(err?.statusCode) || 500;
  const message = err?.message || 'Erro interno do servidor';

  return res.status(statusCode).json({ message });
}

module.exports = errorHandler;

