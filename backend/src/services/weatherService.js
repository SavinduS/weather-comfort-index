const axios = require('axios');
const cities = require('../../cities.json');
const { calculateComfortIndex } = require('../utils/algorithm');

let cache = { data: null, lastFetch: null };
const CACHE_DURATION = 5 * 60 * 1000;

exports.getWeatherData = async () => {
    const currentTime = Date.now();

    if (cache.data && (currentTime - cache.lastFetch < CACHE_DURATION)) {
        return { source: 'HIT', data: cache.data };
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherData = [];

    for (let city of cities) {
        const url = `https://api.openweathermap.org/data/2.5/weather?id=${city.CityCode}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const d = response.data;

        weatherData.push({
            city: d.name,
            temp: d.main.temp,
            humidity: d.main.humidity,
            windSpeed: d.wind.speed,
            description: d.weather[0].description,
            comfortScore: calculateComfortIndex(d.main.temp, d.main.humidity, d.wind.speed)
        });
    }

    const rankedData = weatherData.sort((a, b) => b.comfortScore - a.comfortScore)
                                  .map((item, index) => ({ ...item, rank: index + 1 }));

    cache = { data: rankedData, lastFetch: currentTime };
    return { source: 'MISS', data: rankedData };
};

exports.getCacheStatus = () => {
    const isExpired = !cache.lastFetch || (Date.now() - cache.lastFetch > CACHE_DURATION);
    return isExpired ? 'MISS' : 'HIT';
};