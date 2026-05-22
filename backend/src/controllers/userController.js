const User = require('../models/User');
const mongoose = require('mongoose');

function toSafeUserPayload(userDoc) {
  const safeUser = userDoc.toObject();
  delete safeUser.senha;
  return {
    id: String(safeUser._id),
    name: safeUser.nome,
    email: safeUser.email,
    role: safeUser.role || 'Usuário',
    avatar: safeUser.avatar || '/logo.png',
    joinedDate: safeUser.joinedDate || new Date().toLocaleDateString('pt-BR'),
    preferences: {
      theme: safeUser.preferences?.theme || 'light',
      notifications: typeof safeUser.preferences?.notifications === 'boolean' ? safeUser.preferences.notifications : true,
      language: safeUser.preferences?.language || 'pt-BR'
    }
  };
}

async function createUser(req, res, next) {
  try {
    const { nome, email, senha, role, avatar } = req.body;

    const user = await User.create({ nome, email, senha, role, avatar });

    return res.status(201).json(toSafeUserPayload(user));
  } catch (error) {
    return next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.senha !== senha) {
      return res.status(401).json({ message: 'As credenciais estão incorretas.' });
    }

    return res.status(200).json(toSafeUserPayload(user));
  } catch (error) {
    return next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(toSafeUserPayload(user));
  } catch (error) {
    return next(error);
  }
}

async function updateUserPreferences(req, res, next) {
  try {
    const { id } = req.params;
    const { theme, notifications, language } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const update = {};
    if (typeof theme !== 'undefined') update['preferences.theme'] = theme;
    if (typeof notifications !== 'undefined') update['preferences.notifications'] = notifications;
    if (typeof language !== 'undefined') update['preferences.language'] = language;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(toSafeUserPayload(updatedUser));
  } catch (error) {
    return next(error);
  }
}

async function updateCurrentUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, role, avatar } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const update = {};
    if (typeof name !== 'undefined') update.nome = name;
    if (typeof email !== 'undefined') update.email = email;
    if (typeof role !== 'undefined') update.role = role;
    if (typeof avatar !== 'undefined') update.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(toSafeUserPayload(updatedUser));
  } catch (error) {
    return next(error);
  }
}

async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Este email já está cadastrado.' });
    }

    const user = await User.create({
      nome: name.trim(),
      email: normalizedEmail,
      senha: password
    });

    return res.status(201).json(toSafeUserPayload(user));
  } catch (error) {
    return next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users.map(toSafeUserPayload));
  } catch (error) {
    return next(error);
  }
}

async function updateLegacyUser(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const update = {};
    if (typeof nome !== 'undefined') update.nome = nome;
    if (typeof email !== 'undefined') update.email = email;
    if (typeof senha !== 'undefined') update.senha = senha;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(toSafeUserPayload(updatedUser));
  } catch (error) {
    return next(error);
  }
}

async function removeUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUser,
  registerUser,
  loginUser,
  getUserById,
  updateCurrentUser,
  updateUserPreferences,
  listUsers,
  updateLegacyUser,
  removeUser,
  getUsers: listUsers,
  updateUser: updateLegacyUser,
  deleteUser: removeUser
};

