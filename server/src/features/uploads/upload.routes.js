import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { protect } from '../../middleware/auth.js'

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    cb(null, allowed.includes(file.mimetype))
  },
})

const router = Router()

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

export default router
