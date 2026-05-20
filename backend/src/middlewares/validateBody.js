const AppError = require('../utils/AppError');

function validateBody(requiredFields) {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || String(value).trim() === '';
    });

    if (missingFields.length > 0) {
      return next(
        new AppError(`Campos obrigatórios: ${missingFields.join(', ')}`, 400)
      );
    }

    return next();
  };
}

function validateEmail(req, res, next) {
  const { email } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return next(new AppError('E-mail inválido', 400));
  }

  return next();
}

module.exports = {
  validateBody,
  validateEmail
};
