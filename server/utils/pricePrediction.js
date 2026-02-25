/**
 * Price Prediction Utility
 *
 * Forecasts up to 4 future hourly price points using the same
 * algorithm factors, for PriceChart frontend integration.
 */

const predictFuturePrices = (product) => {
    const now = new Date();
    const pickupTime = new Date(product.expiryTime);
    const hoursUntilPickup = (pickupTime - now) / (1000 * 60 * 60);

    if (hoursUntilPickup <= 0) return [];

    const predictions = [];
    const intervals = Math.min(4, Math.ceil(hoursUntilPickup));
    const listedAt = product.listedAt ? new Date(product.listedAt) : now;
    const totalDuration = pickupTime - listedAt;
    const originalPrice = product.originalPrice;
    const aggressiveness = product.pricingStrategy?.aggressiveness || 5;
    const minPrice = originalPrice * (product.pricingStrategy?.minProfitMargin || 0.3);
    const initialStock = product.initialStock || product.currentStock || product.stock || 1;
    const currentStock = product.currentStock || product.stock || 1;

    for (let i = 1; i <= intervals; i++) {
        const futureTime = new Date(now.getTime() + i * 60 * 60 * 1000);
        if (futureTime > pickupTime) break;

        // Simulate time decay at future point
        const timeElapsed = futureTime - listedAt;
        const timeProgress = Math.min(1, Math.max(0, timeElapsed / totalDuration));
        const decayCurve = Math.pow(timeProgress, 2 - (aggressiveness / 10));
        const timeMultiplier = 1 - (0.7 * decayCurve);

        // Simulate stock depletion (assume ~1 unit sold per hour)
        const futureStock = Math.max(1, currentStock - i);
        const stockRatio = futureStock / initialStock;
        let stockMultiplier;
        if (stockRatio > 0.7) stockMultiplier = 0.85;
        else if (stockRatio > 0.4) stockMultiplier = 0.95;
        else stockMultiplier = 1.0;

        // Urgency at future time
        const futureHoursRemaining = (pickupTime - futureTime) / (1000 * 60 * 60);
        let urgencyMultiplier = 1.0;
        if (futureHoursRemaining < 1) urgencyMultiplier = 0.85;
        else if (futureHoursRemaining < 2) urgencyMultiplier = 0.93;

        let predictedPrice = originalPrice * timeMultiplier * stockMultiplier * urgencyMultiplier;
        predictedPrice = Math.max(minPrice, predictedPrice);
        predictedPrice = Math.round(predictedPrice / 10) * 10;

        predictions.push({
            time: futureTime.toISOString(),
            timeLabel: futureTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            predictedPrice,
            discount: (((originalPrice - predictedPrice) / originalPrice) * 100).toFixed(0) + '%',
            hoursFromNow: i,
        });
    }

    return predictions;
};

module.exports = { predictFuturePrices };
