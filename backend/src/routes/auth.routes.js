const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateBody, validateEmail } = require('../middlewares/validateBody');

const router = express.Router();

router.post(
  '/register',
  validateBody(['nome', 'email', 'senha']),
  validateEmail,
  register
);
router.post(
  '/login',
  validateBody(['email', 'senha']),
  validateEmail,
  login
);
router.get('/me', authenticate, getMe);

module.exports = router;
