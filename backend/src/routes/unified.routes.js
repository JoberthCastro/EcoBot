const express = require('express');
const {
  getUnifiedData,
  getUnifiedMetrics,
  getUnifiedMap,
  getAvailableCities,
  getAvailableMonths
} = require('../controllers/unified.controller');

const router = express.Router();

router.get('/data', getUnifiedData);
router.get('/metrics', getUnifiedMetrics);
router.get('/map', getUnifiedMap);
router.get('/cities', getAvailableCities);
router.get('/months', getAvailableMonths);

module.exports = router;
