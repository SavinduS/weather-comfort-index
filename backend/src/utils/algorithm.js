exports.calculateComfortIndex = (temp, humidity, windSpeed) => {
    const tempScore = Math.max(0, 100 - Math.abs(temp - 22) * 4);
    const humidityScore = Math.max(0, 100 - Math.abs(humidity - 45));
    const windScore = Math.max(0, 100 - windSpeed * 5);

    const finalScore = (tempScore * 0.5) + (humidityScore * 0.3) + (windScore * 0.2);
    return Math.round(finalScore);
};