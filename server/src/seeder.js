import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Product from './models/Product.js'
import Order from './models/Order.js'

dotenv.config()

// ── Mirrors the production algorithm so history prices are realistic ──────────
function simPrice(originalPrice, initialStock, stockAtTime, pickupMs, createdAtMs, atMs, demandScore = 0) {
  const lf = Math.min(Math.max((atMs - createdAtMs) / (pickupMs - createdAtMs), 0), 1)
  const minLeft = Math.max((pickupMs - atMs) / 60000, 0)
  const td  = lf * 0.4
  const sp  = (stockAtTime / initialStock) * 0.3
  const df  = (1 - Math.min(demandScore, 1)) * 0.2
  const urg = minLeft <= 60 ? ((60 - minLeft) / 60) * 0.1 : 0
  const disc = Math.min(td + sp + df + urg, 0.7)
  return Math.max(Math.round(originalPrice * (1 - disc)), Math.round(originalPrice * 0.3))
}

const SELLERS = [
  {
    name: 'Arjun Mehta',
    email: 'arjun@thecornerbakery.com',
    password: 'password123',
    isSeller: true,
    businessName: 'The Corner Bakery',
    businessType: 'bakery',
    businessAddress: 'Anna Salai, Chennai',
    phone: '9876543210',
    location: { type: 'Point', coordinates: [80.2707, 13.0827] },
  },
  {
    name: 'Priya Sharma',
    email: 'priya@saffronkitchen.com',
    password: 'password123',
    isSeller: true,
    businessName: 'Saffron Kitchen',
    businessType: 'restaurant',
    businessAddress: 'Nungambakkam, Chennai',
    phone: '9876500001',
    location: { type: 'Point', coordinates: [80.2417, 13.0569] },
  },
  {
    name: 'Ravi Kumar',
    email: 'ravi@brewmornings.com',
    password: 'password123',
    isSeller: true,
    businessName: 'Brew Mornings',
    businessType: 'cafe',
    businessAddress: 'Adyar, Chennai',
    phone: '9876500002',
    location: { type: 'Point', coordinates: [80.2565, 13.0012] },
  },
]

const BUYERS = [
  { name: 'Kavya Nair', email: 'kavya@email.com', password: 'password123' },
  { name: 'Sam Thomas', email: 'sam@email.com', password: 'password123' },
]

const now = Date.now()
const ms = {
  h: (h) => now + h * 3600000,
  ago: (h) => now - h * 3600000,
}

const makeProducts = (sellerIds) => {
  const S = sellerIds

  // Helper: compute history for a product with optional purchase events
  // events: [{hoursAgo, stockBefore, qtySold, demandAtTime}]
  const history = (product, events) => {
    const { originalPrice, initialStock, pickupMs, createdAtMs } = product
    const entries = []

    // Initial listing price (computed, not originalPrice)
    const listingPrice = simPrice(originalPrice, initialStock, initialStock, pickupMs, createdAtMs, createdAtMs, 0)
    entries.push({ price: listingPrice, reason: 'initial listing', recordedAt: new Date(createdAtMs) })

    for (const ev of events) {
      const atMs = now - ev.hoursAgo * 3600000
      const price = simPrice(originalPrice, initialStock, ev.stockBefore, pickupMs, createdAtMs, atMs, ev.demand)
      entries.push({ price, reason: `purchase — ${ev.qtySold} unit(s) sold`, recordedAt: new Date(atMs) })
    }

    return entries
  }

  const products = [
    // ── Corner Bakery ────────────────────────────────────────────────────────
    (() => {
      // No purchases — pure time decay visible on chart
      const createdAtMs = ms.ago(4)
      const pickupMs    = ms.h(2)
      const p = {
        seller: S[0], name: 'Sourdough Loaf',
        description: 'Stone-baked sourdough with a crispy crust. Baked fresh this morning.',
        category: 'bread', originalPrice: 220,
        stock: 8, initialStock: 8, pickupMs, createdAtMs,
        viewsToday: 34, viewsLastHour: 12, watchersCount: 5,
      }
      return { ...p, pickupTime: new Date(pickupMs), createdAt: new Date(createdAtMs), updatedAt: new Date(),
        priceHistory: history(p, []) }
    })(),

    (() => {
      // High demand, fast-selling: 6 sold early
      const createdAtMs = ms.ago(3)
      const pickupMs    = ms.h(1.5)
      const p = {
        seller: S[0], name: 'Butter Croissants (4 pack)',
        description: 'Classic French-style croissants, flaky and golden. Best with coffee.',
        category: 'pastry', originalPrice: 180,
        stock: 6, initialStock: 12, pickupMs, createdAtMs,
        viewsToday: 58, viewsLastHour: 21, watchersCount: 9,
      }
      return { ...p, pickupTime: new Date(pickupMs), createdAt: new Date(createdAtMs), updatedAt: new Date(),
        priceHistory: history(p, [
          { hoursAgo: 2, stockBefore: 12, qtySold: 4, demand: 0.3 },
          { hoursAgo: 1, stockBefore: 8,  qtySold: 2, demand: 0.5 },
        ]) }
    })(),

    (() => {
      // Near expiry, sold ~half stock; price curve shows urgency kicking in
      const createdAtMs = ms.ago(4)
      const pickupMs    = ms.h(0.75)
      const p = {
        seller: S[0], name: 'Cinnamon Danish',
        description: 'Soft, swirled cinnamon danish with cream cheese glaze.',
        category: 'pastry', originalPrice: 120,
        stock: 6, initialStock: 10, pickupMs, createdAtMs,
        viewsToday: 72, viewsLastHour: 30, watchersCount: 14,
      }
      return { ...p, pickupTime: new Date(pickupMs), createdAt: new Date(createdAtMs), updatedAt: new Date(),
        priceHistory: history(p, [
          { hoursAgo: 2, stockBefore: 10, qtySold: 4, demand: 0.4 },
        ]) }
    })(),

    // ── Saffron Kitchen ───────────────────────────────────────────────────────
    (() => {
      // Popular meal: 5 sold in two waves, high demand keeps price from dropping much
      const createdAtMs = ms.ago(3)
      const pickupMs    = ms.h(1)
      const p = {
        seller: S[1], name: 'Chicken Biryani Box',
        description: 'Aromatic basmati rice with tender chicken, slow-cooked with whole spices. Served with raita.',
        category: 'meal', originalPrice: 320,
        stock: 5, initialStock: 10, pickupMs, createdAtMs,
        viewsToday: 95, viewsLastHour: 40, watchersCount: 18,
      }
      return { ...p, pickupTime: new Date(pickupMs), createdAt: new Date(createdAtMs), updatedAt: new Date(),
        priceHistory: history(p, [
          { hoursAgo: 2,   stockBefore: 10, qtySold: 3, demand: 0.4 },
          { hoursAgo: 1.5, stockBefore: 7,  qtySold: 2, demand: 0.7 },
        ]) }
    })(),

    (() => {
      // Fresh listing, no purchases yet — chart shows gentle decay start
      const createdAtMs = ms.ago(1)
      const pickupMs    = ms.h(2.5)
      const p = {
        seller: S[1], name: 'Paneer Butter Masala + Naan',
        description: 'Creamy tomato-based paneer curry with 2 butter naans. Comfort food at its finest.',
        category: 'meal', originalPrice: 280,
        stock: 7, initialStock: 7, pickupMs, createdAtMs,
        viewsToday: 42, viewsLastHour: 15, watchersCount: 6,
      }
      return { ...p, pickupTime: new Date(pickupMs), createdAt: new Date(createdAtMs), updatedAt: new Date(),
        priceHistory: history(p, []) }
    })(),

    (() => {
      // Nearly sold out with massive demand — stock pressure gone, urgency loading
      const createdAtMs = ms.ago(5)
      const pickupMs    = ms.h(0.5)
      const p = {
        seller: S[1], name: 'Veg Thali',
        description: 'Full thali with dal, sabzi, rice, 2 rotis, pickle and papad.',
        category: 'meal', originalPrice: 200,
        stock: 3, initialStock: 15, pickupMs, createdAtMs,
        viewsToday: 120, viewsLastHour: 55, watchersCount: 22,
      }
      return { ...p, pickupTime: new Date(pickupMs), createdAt: new Date(createdAtMs), updatedAt: new Date(),
        priceHistory: history(p, [
          { hoursAgo: 3,   stockBefore: 15, qtySold: 7, demand: 0.3 },
          { hoursAgo: 1.5, stockBefore: 8,  qtySold: 5, demand: 0.6 },
        ]) }
    })(),

    // ── Brew Mornings ─────────────────────────────────────────────────────────
    (() => {
      // Just listed, long window, plenty of stock — low urgency, high stock pressure
      const createdAtMs = ms.ago(0.5)
      const pickupMs    = ms.h(3)
      const p = {
        seller: S[2], name: 'Cold Brew Coffee (500ml)',
        description: '18-hour cold brew, smooth and strong. No sugar added.',
        category: 'drink', originalPrice: 160,
        stock: 10, initialStock: 10, pickupMs, createdAtMs,
        viewsToday: 28, viewsLastHour: 8, watchersCount: 3,
      }
      return { ...p, pickupTime: new Date(pickupMs), createdAt: new Date(createdAtMs), updatedAt: new Date(),
        priceHistory: history(p, []) }
    })(),

    (() => {
      // Half sold, moderate demand, upcoming urgency threshold
      const createdAtMs = ms.ago(2)
      const pickupMs    = ms.h(1.2)
      const p = {
        seller: S[2], name: 'Avocado Toast Plate',
        description: 'Multigrain toast with smashed avocado, cherry tomatoes and everything bagel seasoning.',
        category: 'meal', originalPrice: 240,
        stock: 4, initialStock: 8, pickupMs, createdAtMs,
        viewsToday: 61, viewsLastHour: 25, watchersCount: 11,
      }
      return { ...p, pickupTime: new Date(pickupMs), createdAt: new Date(createdAtMs), updatedAt: new Date(),
        priceHistory: history(p, [
          { hoursAgo: 0.75, stockBefore: 8, qtySold: 4, demand: 0.5 },
        ]) }
    })(),

    (() => {
      // Low demand, overstocked, long window — maximum stock pressure
      const createdAtMs = ms.ago(0.5)
      const pickupMs    = ms.h(4)
      const p = {
        seller: S[2], name: 'Trail Mix Snack Pack',
        description: 'Mixed nuts, dried fruits and dark chocolate chips. 200g pack.',
        category: 'snack', originalPrice: 130,
        stock: 15, initialStock: 15, pickupMs, createdAtMs,
        viewsToday: 18, viewsLastHour: 4, watchersCount: 1,
      }
      return { ...p, pickupTime: new Date(pickupMs), createdAt: new Date(createdAtMs), updatedAt: new Date(),
        priceHistory: history(p, []) }
    })(),
  ]

  return products
}

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to DB')

  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})])
  console.log('Cleared existing data')

  const sellerDocs = await Promise.all(
    SELLERS.map(async (s) => User.create({ ...s, password: await bcrypt.hash(s.password, 10) }))
  )
  const buyerDocs = await Promise.all(
    BUYERS.map(async (b) => User.create({ ...b, password: await bcrypt.hash(b.password, 10) }))
  )
  console.log(`Created ${sellerDocs.length} sellers, ${buyerDocs.length} buyers`)

  const rawProducts = makeProducts(sellerDocs.map((s) => s._id))

  // Strip helper fields and insert with custom createdAt preserved
  const docs = rawProducts.map(({ pickupMs, createdAtMs, ...rest }) => rest)
  await Product.insertMany(docs, { timestamps: false })
  console.log(`Created ${docs.length} products`)

  console.log('\nSeed complete. Realistic price history generated from algorithm simulation.')
  console.log('  Sellers: arjun@thecornerbakery.com / priya@saffronkitchen.com / ravi@brewmornings.com')
  console.log('  Buyers:  kavya@email.com / sam@email.com')
  console.log('  All passwords: password123')

  process.exit(0)
}

seed().catch((err) => { console.error(err); process.exit(1) })
