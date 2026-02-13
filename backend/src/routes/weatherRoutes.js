const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/weather', weatherController.getWeather);
router.get('/cache-status', weatherController.getCacheStatus);

module.exports = router;