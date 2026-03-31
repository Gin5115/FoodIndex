import Product from '../../models/Product.js'
import User from '../../models/User.js'
import { computeCurrentPrice, computeDiscount } from '../../utils/pricingAlgorithm.js'

const attachPricing = (product) => {
  const obj = product.toObject ? product.toObject({ virtuals: true }) : product
  obj.currentPrice = computeCurrentPrice(obj)
  obj.discountPercent = computeDiscount(obj.originalPrice, obj.currentPrice)
  return obj
}

// GET /api/products — public marketplace listing
export const getProducts = async (req, res) => {
  const { category, search, sort } = req.query

  const filter = {
    active: true,
    soldOut: false,
    pickupTime: { $gt: new Date() },
  }

  if (category) filter.category = category
  if (search) filter.name = { $regex: search, $options: 'i' }

  const products = await Product.find(filter)
    .populate('seller', 'name businessName businessType location')
    .lean()

  const priced = products.map((p) => {
    const currentPrice = computeCurrentPrice(p)
    return { ...p, currentPrice, discountPercent: computeDiscount(p.originalPrice, currentPrice) }
  })

  // Sort
  if (sort === 'discount') priced.sort((a, b) => b.discountPercent - a.discountPercent)
  else if (sort === 'price_asc') priced.sort((a, b) => a.currentPrice - b.currentPrice)
  else if (sort === 'price_desc') priced.sort((a, b) => b.currentPrice - a.currentPrice)
  else if (sort === 'expiry') priced.sort((a, b) => new Date(a.pickupTime) - new Date(b.pickupTime))
  else priced.sort((a, b) => new Date(a.pickupTime) - new Date(b.pickupTime))

  res.json(priced)
}

// GET /api/products/nearby?lng=&lat=&maxKm=5 — geospatial query
export const getNearby = async (req, res) => {
  const { lng, lat, maxKm = 5, category } = req.query

  if (!lng || !lat) {
    return res.status(400).json({ message: 'lng and lat are required' })
  }

  // Find sellers within radius
  const nearbySellers = await User.find({
    isSeller: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseFloat(maxKm) * 1000,
      },
    },
  }).select('_id')

  const sellerIds = nearbySellers.map((s) => s._id)

  const filter = {
    seller: { $in: sellerIds },
    active: true,
    soldOut: false,
    pickupTime: { $gt: new Date() },
  }
  if (category) filter.category = category

  const products = await Product.find(filter)
    .populate('seller', 'name businessName businessType location businessAddress')
    .lean()

  const priced = products.map((p) => {
    const currentPrice = computeCurrentPrice(p)
    return { ...p, currentPrice, discountPercent: computeDiscount(p.originalPrice, currentPrice) }
  })

  priced.sort((a, b) => b.discountPercent - a.discountPercent)
  res.json(priced)
}

// GET /api/products/:id — single product, increments view count
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'seller', 'name businessName businessType businessAddress'
  )

  if (!product || !product.active) {
    return res.status(404).json({ message: 'Product not found' })
  }

  product.viewsToday += 1
  product.viewsLastHour += 1
  await product.save()

  res.json(attachPricing(product))
}

// POST /api/products/:id/watch — buyer watches a product (bumps watchersCount)
export const watchProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })

  product.watchersCount += 1
  await product.save()

  const priced = attachPricing(product)
  res.json({ watchersCount: product.watchersCount, currentPrice: priced.currentPrice, discountPercent: priced.discountPercent })
}

// POST /api/products — seller creates a listing
export const createProduct = async (req, res) => {
  const { name, description, category, image, originalPrice, stock, pickupTime } = req.body

  if (!name || !category || !originalPrice || !stock || !pickupTime) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const product = await Product.create({
    seller: req.user._id,
    name, description, category, image,
    originalPrice, stock, initialStock: stock, pickupTime,
  })

  res.status(201).json(attachPricing(product))
}

// PUT /api/products/:id — seller updates their listing
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) return res.status(404).json({ message: 'Product not found' })
  if (product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your listing' })
  }

  const allowed = ['name', 'description', 'image', 'stock', 'pickupTime', 'active']
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field]
  })
  if (req.body.stock !== undefined) product.soldOut = req.body.stock === 0

  await product.save()
  res.json(attachPricing(product))
}

// DELETE /api/products/:id — seller removes their listing
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) return res.status(404).json({ message: 'Product not found' })
  if (product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your listing' })
  }

  await product.deleteOne()
  res.json({ message: 'Product removed' })
}

// GET /api/products/seller/:sellerId/listings — public seller storefront
export const getSellerListings = async (req, res) => {
  const seller = await User.findById(req.params.sellerId).select('-password')
  if (!seller || !seller.isSeller) return res.status(404).json({ message: 'Seller not found' })

  const products = await Product.find({
    seller: seller._id, active: true, soldOut: false, pickupTime: { $gt: new Date() },
  }).lean()

  const priced = products.map((p) => {
    const currentPrice = computeCurrentPrice(p)
    return { ...p, currentPrice, discountPercent: computeDiscount(p.originalPrice, currentPrice) }
  })

  res.json({ seller, products: priced })
}

// GET /api/products/seller/my — seller's own listings
export const getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 })
  res.json(products.map(attachPricing))
}
