/**
 * Dynamic pricing — computed on every product fetch, not stored.
 *
 * Four factors (weights sum to 1.0):
 *   - Time decay    40%  cheaper as pickup approaches
 *   - Stock pressure 30%  cheaper when overstocked, pricier when scarce
 *   - Demand        20%  views and watchers nudge price up
 *   - Urgency       10%  aggressive cut in the final hour
 *
 * Price never drops below 30% of originalPrice (minimum margin).
 * Result is rounded to nearest whole number.
 */

const MIN_MARGIN = 0.3   // floor: 30% of original
const MAX_DISCOUNT = 0.7 // cap: 70% off

export function computeCurrentPrice(product) {
  const {
    originalPrice,
    stock,
    initialStock,
    pickupTime,
    viewsToday = 0,
    viewsLastHour = 0,
    watchersCount = 0,
  } = product

  const now = Date.now()
  const pickup = new Date(pickupTime).getTime()
  const created = new Date(product.createdAt).getTime()

  // How far along the product's life are we? 0 = just listed, 1 = at pickup time
  const totalWindow = pickup - created
  const elapsed = now - created
  const lifeFraction = Math.min(Math.max(elapsed / totalWindow, 0), 1)

  const minutesLeft = Math.max((pickup - now) / 60000, 0)

  // --- Factor 1: Time decay (40%) ---
  // Linear decay: at listing = 0 discount, at pickup = full decay
  const timeDecay = lifeFraction * 0.4

  // --- Factor 2: Stock pressure (30%) ---
  // High stock ratio = more discount (overstocked). Low ratio = less discount.
  const stockRatio = initialStock > 0 ? stock / initialStock : 0
  const stockPressure = stockRatio * 0.3

  // --- Factor 3: Demand (20%) ---
  // More views/watchers = slightly less discount (people want it)
  const demandScore = Math.min((viewsToday * 0.5 + viewsLastHour * 2 + watchersCount * 3) / 100, 1)
  const demandFactor = (1 - demandScore) * 0.2

  // --- Factor 4: Urgency (10%) ---
  // Final 60 minutes: extra aggressive cut
  const urgency = minutesLeft <= 60 ? ((60 - minutesLeft) / 60) * 0.1 : 0

  const totalDiscount = Math.min(timeDecay + stockPressure + demandFactor + urgency, MAX_DISCOUNT)
  const discountedPrice = originalPrice * (1 - totalDiscount)
  const currentPrice = Math.max(discountedPrice, originalPrice * MIN_MARGIN)

  return Math.round(currentPrice)
}

export function computeDiscount(originalPrice, currentPrice) {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}
