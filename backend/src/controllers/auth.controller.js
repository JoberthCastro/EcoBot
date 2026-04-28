const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    const result = await authService.register({ nome, email, senha });
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    const result = await authService.login({ email, senha });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};

