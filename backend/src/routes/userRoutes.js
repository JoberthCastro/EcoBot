const express = require('express');
const {
  getUserById,
  updateCurrentUser,
  updateUserPreferences,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate, authorizeSelf } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id/preferences', updateUserPreferences);
router.put('/:id/profile', updateCurrentUser);
router.put('/:id', authorizeSelf, updateUser);
router.delete('/:id', authorizeSelf, deleteUser);

module.exports = router;
