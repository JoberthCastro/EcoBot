const authService = require('../services/auth.service');
const sanitizeUser = require('../utils/sanitizeUser');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { nome, email, senha } = req.body;
  const result = await authService.register({ nome, email, senha });

  return res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const { email, senha } = req.body;
  const result = await authService.login({ email, senha });

  return res.status(200).json(result);
});

const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
});

module.exports = {
  register,
  login,
  getMe
};
