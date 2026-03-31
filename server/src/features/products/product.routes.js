import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  watchProduct,
  getNearby,
  getSellerListings,
} from './product.controller.js'
import { protect, sellerOnly } from '../../middleware/auth.js'

const router = Router()

// Public
router.get('/', getProducts)
router.get('/nearby', getNearby)
router.get('/seller/:sellerId/listings', getSellerListings)
router.get('/:id', getProductById)

// Buyer — watch a product
router.post('/:id/watch', protect, watchProduct)

// Seller only
router.get('/seller/my', protect, sellerOnly, getMyProducts)
router.post('/', protect, sellerOnly, createProduct)
router.put('/:id', protect, sellerOnly, updateProduct)
router.delete('/:id', protect, sellerOnly, deleteProduct)

export default router
