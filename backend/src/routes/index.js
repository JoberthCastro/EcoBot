const express = require('express');
const metricsRoutes = require('./metrics.routes');
const suggestionsRoutes = require('./suggestions.routes');
const chatRoutes = require('./chat.routes');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EcoBot API'
  });
});

router.use('/metrics', metricsRoutes);
router.use('/suggestions', suggestionsRoutes);
router.use('/chat', chatRoutes);
router.use('/auth', authRoutes);

module.exports = router;
