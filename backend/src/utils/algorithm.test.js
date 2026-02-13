const { calculateComfortIndex } = require('./algorithm');

describe('Comfort Index Algorithm Tests', () => {
    
    test('Perfect conditions should return a high score (close to 100)', () => {
        // 22°C Temp, 45% Humidity, 0 Wind Speed - Ideal conditions
        const score = calculateComfortIndex(22, 45, 0);
        expect(score).toBeGreaterThanOrEqual(95);
        expect(score).toBeLessThanOrEqual(100);
    });

    test('Extreme heat should return a low score', () => {
        // 45°C is very uncomfortable
        const score = calculateComfortIndex(50, 90, 2);
        expect(score).toBeLessThan(40);
    });

    test('Extreme cold should return a low score', () => {
        // -10°C is very uncomfortable
        const score = calculateComfortIndex(-10, 20, 10);
        expect(score).toBeLessThan(40);
    });

    test('High wind speed should reduce the score', () => {
        const calmScore = calculateComfortIndex(22, 45, 0);
        const windyScore = calculateComfortIndex(22, 45, 15); // 15m/s wind
        expect(windyScore).toBeLessThan(calmScore);
    });

    test('Score should always be between 0 and 100', () => {
        const score = calculateComfortIndex(100, 100, 100); // Impossible weather
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
    });
});