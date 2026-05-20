const express = require('express');
const {
  getAirQualityByLocation,
  getAirQualityByCity,
  saveAirQualityData,
  getStoredAirQuality
} = require('../controllers/airQuality.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/location/:location', getAirQualityByLocation);
router.get('/city', getAirQualityByCity);
router.get('/stored/:location', getStoredAirQuality);
router.post('/', authenticate, saveAirQualityData);

module.exports = router;
