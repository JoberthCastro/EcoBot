const express = require('express');
const { sendChatResponse } = require('../controllers/chat.controller');
const { validateBody } = require('../middlewares/validateBody');

const router = express.Router();

router.post('/', validateBody(['message']), sendChatResponse);

module.exports = router;
