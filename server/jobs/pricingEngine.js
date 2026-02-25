/**
 * Pricing Engine — Cron Jobs
 *
 * Three scheduled jobs:
 *   1. updatePrices        — every 5 min  (recalculates dynamic prices)
 *   2. resetHourlyViews    — every hour   (clears viewsLastHour)
 *   3. cleanupExpiredProducts — every 30 min (marks past-expiry items as soldOut)
 */

const cron = require('node-cron');
const Product = require('../models/Product');
const { calculateDynamicPrice } = require('../utils/pricingAlgorithm');

// Job references for graceful shutdown
let priceUpdateJob = null;
let viewResetJob = null;
let cleanupJob = null;

// ── MAIN PRICE UPDATE ───────────────────────────────────────

const updatePrices = async () => {
    try {
        const now = new Date();
        console.log(`[Pricing Engine] Running at ${now.toLocaleTimeString()}`);

        // Fetch only products needing update
        const productsToUpdate = await Product.find({
            soldOut: false,
            isPaused: false,
            expiryTime: { $gte: now },
            $or: [
                { nextPriceUpdate: { $lte: now } },
                { nextPriceUpdate: null },
            ],
        }).select(
            'name originalPrice currentPrice expiryTime listedAt currentStock initialStock ' +
            'stock viewsLastHour watchersCount pricingStrategy priceHistory'
        );

        if (productsToUpdate.length === 0) {
            console.log('[Pricing Engine] No products to update');
            return;
        }

        console.log(`[Pricing Engine] Updating ${productsToUpdate.length} products`);

        const updates = [];

        for (const product of productsToUpdate) {
            const oldPrice = product.currentPrice;
            const { newPrice, breakdown, nextUpdateTime } = calculateDynamicPrice(product);

            if (newPrice !== oldPrice) {
                product.currentPrice = newPrice;
                product.lastPriceUpdate = now;
                product.nextPriceUpdate = nextUpdateTime;

                // Add to price history
                if (!product.priceHistory) product.priceHistory = [];
                product.priceHistory.push({
                    price: newPrice,
                    timestamp: now,
                    reason: `Time: ${breakdown.timeProgress}, Stock: ${breakdown.stockRatio}, Demand: ${breakdown.demandScore}`,
                });

                // Keep only last 50 entries
                if (product.priceHistory.length > 50) {
                    product.priceHistory = product.priceHistory.slice(-50);
                }

                updates.push(product.save());

                console.log(
                    `  📉 ${product.name}: ₹${oldPrice} → ₹${newPrice}`,
                    `(${breakdown.discountPercentage} off) | Next: ${nextUpdateTime.toLocaleTimeString()}`
                );
            } else {
                // Price unchanged — just schedule next check
                product.nextPriceUpdate = nextUpdateTime;
                updates.push(product.save());
            }
        }

        await Promise.all(updates);
        console.log(`[Pricing Engine] Completed ${updates.length} updates`);
    } catch (error) {
        console.error('[Pricing Engine] CRITICAL ERROR:', error.message);
    }
};

// ── RESET HOURLY VIEWS ──────────────────────────────────────

const resetHourlyViews = async () => {
    try {
        const result = await Product.updateMany(
            { viewsLastHour: { $gt: 0 } },
            { $set: { viewsLastHour: 0 } }
        );
        if (result.modifiedCount > 0) {
            console.log(`[Pricing Engine] Reset hourly views for ${result.modifiedCount} products`);
        }
    } catch (error) {
        console.error('[Pricing Engine] Error resetting views:', error.message);
    }
};

// ── CLEANUP EXPIRED PRODUCTS ────────────────────────────────

const cleanupExpiredProducts = async () => {
    try {
        const now = new Date();
        const result = await Product.updateMany(
            { expiryTime: { $lt: now }, soldOut: false, expiryTime: { $ne: null } },
            { $set: { soldOut: true } }
        );
        if (result.modifiedCount > 0) {
            console.log(`[Pricing Engine] Marked ${result.modifiedCount} products as expired/sold`);
        }
    } catch (error) {
        console.error('[Pricing Engine] Error cleaning up:', error.message);
    }
};

// ── INITIALIZE ──────────────────────────────────────────────

const initializePricingEngine = () => {
    console.log('[Pricing Engine] Initializing...');

    // Stop existing jobs if any (for hot reload safety)
    if (priceUpdateJob) priceUpdateJob.stop();
    if (viewResetJob) viewResetJob.stop();
    if (cleanupJob) cleanupJob.stop();

    const updateInterval = process.env.PRICING_UPDATE_INTERVAL || 5;
    const cleanupInterval = process.env.CLEANUP_INTERVAL || 30;

    // Schedule jobs
    priceUpdateJob = cron.schedule(`*/${updateInterval} * * * *`, updatePrices);
    console.log(`[Pricing Engine] ⏱  Price updates every ${updateInterval} minutes`);

    viewResetJob = cron.schedule('0 * * * *', resetHourlyViews);
    console.log('[Pricing Engine] ⏱  Hourly view reset scheduled');

    cleanupJob = cron.schedule(`*/${cleanupInterval} * * * *`, cleanupExpiredProducts);
    console.log(`[Pricing Engine] ⏱  Cleanup every ${cleanupInterval} minutes`);

    // Run initial update immediately
    updatePrices();
};

// ── GRACEFUL SHUTDOWN ───────────────────────────────────────

const shutdownPricingEngine = () => {
    console.log('[Pricing Engine] Shutting down...');
    if (priceUpdateJob) priceUpdateJob.stop();
    if (viewResetJob) viewResetJob.stop();
    if (cleanupJob) cleanupJob.stop();
    console.log('[Pricing Engine] Stopped all jobs');
};

module.exports = { initializePricingEngine, shutdownPricingEngine, updatePrices };
