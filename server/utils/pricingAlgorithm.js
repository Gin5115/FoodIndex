/**
 * Dynamic Pricing Algorithm
 *
 * 4-factor price calculation:
 *   1. Time Decay      (40% weight) — price drops as pickup time approaches
 *   2. Stock Pressure   (30% weight) — high stock = bigger discount, low = scarcity premium
 *   3. Demand Factor    (20% weight) — high demand = less discount
 *   4. Urgency Boost    (10% weight) — final-hour aggressive drop
 */

const calculateDynamicPrice = (product) => {
    const now = new Date();

    // ── EDGE-CASE GUARDS ────────────────────────────────────

    if (!product.expiryTime) {
        console.warn(`[Pricing] Product ${product._id || 'unknown'} missing expiryTime`);
        return {
            newPrice: product.currentPrice,
            breakdown: {},
            nextUpdateTime: new Date(now.getTime() + 30 * 60 * 1000),
            updateIntervalMinutes: 30,
        };
    }

    const listedAt = product.listedAt ? new Date(product.listedAt) : now;
    const initialStock = product.initialStock || product.currentStock || product.stock || 1;
    const currentStock = product.currentStock || product.stock || 1;
    const originalPrice = product.originalPrice;
    const pickupTime = new Date(product.expiryTime);

    // Already expired
    if (pickupTime <= now) {
        return {
            newPrice: Math.round((originalPrice * (product.pricingStrategy?.minProfitMargin || 0.3)) / 10) * 10,
            breakdown: { timeProgress: '100%', hoursRemaining: '0.0', expired: true },
            nextUpdateTime: new Date(now.getTime() + 60 * 60 * 1000),
            updateIntervalMinutes: 60,
        };
    }

    // ── FACTOR 1: TIME DECAY (40% weight) ───────────────────

    const totalDuration = pickupTime - listedAt;
    const timeElapsed = now - listedAt;
    const timeProgress = Math.min(1, Math.max(0, timeElapsed / totalDuration));

    const aggressiveness = product.pricingStrategy?.aggressiveness || 5;
    const decayCurve = Math.pow(timeProgress, 2 - (aggressiveness / 10));
    const timeMultiplier = 1 - (0.7 * decayCurve); // Max 70% discount from time alone

    // ── FACTOR 2: STOCK PRESSURE (30% weight) ───────────────

    const stockRatio = currentStock / initialStock;
    let stockMultiplier;
    if (stockRatio > 0.7) {
        stockMultiplier = 0.85; // Lots of stock — big discount
    } else if (stockRatio > 0.4) {
        stockMultiplier = 0.95; // Medium stock
    } else {
        stockMultiplier = 1.0;  // Low stock — scarcity, minimal discount
    }

    // ── FACTOR 3: DEMAND FACTOR (20% weight) ────────────────

    const viewsLastHour = product.viewsLastHour || 0;
    const watchersCount = product.watchersCount || 0;
    const demandScore = viewsLastHour + (watchersCount * 2);

    let demandMultiplier;
    if (!product.pricingStrategy?.enableDemandPricing) {
        demandMultiplier = 1.0;
    } else if (demandScore > 50) {
        demandMultiplier = 1.1;  // High demand — reduce discount
    } else if (demandScore > 20) {
        demandMultiplier = 1.05;
    } else if (demandScore < 5) {
        demandMultiplier = 0.9;  // Low demand — increase discount
    } else {
        demandMultiplier = 1.0;
    }

    // ── FACTOR 4: URGENCY BOOST (10% weight) ────────────────

    const hoursRemaining = (pickupTime - now) / (1000 * 60 * 60);
    let urgencyMultiplier = 1.0;
    if (hoursRemaining < 1) {
        urgencyMultiplier = 0.85; // Final hour — aggressive
    } else if (hoursRemaining < 2) {
        urgencyMultiplier = 0.93;
    }

    // ── CALCULATE FINAL PRICE ───────────────────────────────

    let calculatedPrice = originalPrice * timeMultiplier * stockMultiplier * demandMultiplier * urgencyMultiplier;

    // Constraints
    const minPrice = originalPrice * (product.pricingStrategy?.minProfitMargin || 0.3);
    const maxPrice = originalPrice;

    let newPrice = Math.max(minPrice, Math.min(maxPrice, calculatedPrice));
    newPrice = Math.round(newPrice / 10) * 10; // Round to nearest ₹10

    // Never increase price
    if (product.currentPrice && newPrice > product.currentPrice) {
        newPrice = product.currentPrice;
    }

    // ── NEXT UPDATE INTERVAL ────────────────────────────────

    let updateIntervalMinutes;
    if (hoursRemaining < 1) {
        updateIntervalMinutes = 5;
    } else if (hoursRemaining < 3) {
        updateIntervalMinutes = 15;
    } else {
        updateIntervalMinutes = 30;
    }

    const nextUpdateTime = new Date(now.getTime() + updateIntervalMinutes * 60 * 1000);

    // ── RETURN ──────────────────────────────────────────────

    return {
        newPrice,
        breakdown: {
            timeMultiplier: timeMultiplier.toFixed(2),
            stockMultiplier: stockMultiplier.toFixed(2),
            demandMultiplier: demandMultiplier.toFixed(2),
            urgencyMultiplier: urgencyMultiplier.toFixed(2),
            timeProgress: (timeProgress * 100).toFixed(1) + '%',
            hoursRemaining: hoursRemaining.toFixed(1),
            stockRatio: (stockRatio * 100).toFixed(0) + '%',
            demandScore,
            discountPercentage: (((originalPrice - newPrice) / originalPrice) * 100).toFixed(0) + '%',
        },
        nextUpdateTime,
        updateIntervalMinutes,
    };
};

module.exports = { calculateDynamicPrice };
