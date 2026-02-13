const weatherService = require('../services/weatherService');

exports.getWeather = async (req, res) => {
    try {
        const result = await weatherService.getWeatherData();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCacheStatus = (req, res) => {
    const status = weatherService.getCacheStatus();
    res.json({ status });
};