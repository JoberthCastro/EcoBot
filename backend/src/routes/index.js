const express = require('express');
const metricsRoutes = require('./metrics.routes');
const suggestionsRoutes = require('./suggestions.routes');
const chatRoutes = require('./chat.routes');
const airQualityRoutes = require('./airQuality.routes');
const authRoutes = require('./auth.routes');
const unifiedRoutes = require('./unified.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EcoBot API'
  });
});

router.use('/auth', authRoutes);
router.use('/metrics', metricsRoutes);
router.use('/suggestions', suggestionsRoutes);
router.use('/chat', chatRoutes);
router.use('/air-quality', airQualityRoutes);
router.use('/unified', unifiedRoutes);

module.exports = router;
