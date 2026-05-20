function sanitizeUser(user) {
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.senha;
  return safeUser;
}

module.exports = sanitizeUser;
