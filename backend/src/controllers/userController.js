const User = require('../models/User');
const AppError = require('../utils/AppError');
const sanitizeUser = require('../utils/sanitizeUser');
const asyncHandler = require('../utils/asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res.status(200).json(users.map(sanitizeUser));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return res.status(200).json(sanitizeUser(user));
});

const updateUser = asyncHandler(async (req, res) => {
  const { nome, email, senha } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  if (nome) user.nome = nome;
  if (email) user.email = email;
  if (senha) user.senha = senha;

  await user.save();

  return res.status(200).json(sanitizeUser(user));
});

const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return res.status(204).send();
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
