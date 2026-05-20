const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate, authorizeSelf } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', authorizeSelf, updateUser);
router.delete('/:id', authorizeSelf, deleteUser);

module.exports = router;
