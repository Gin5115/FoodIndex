import jwt from 'jsonwebtoken'
import User from '../../models/User.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password, isSeller, businessName, businessType, businessAddress, phone } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }

  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email already in use' })

  const user = await User.create({
    name,
    email,
    password,
    isSeller: !!isSeller,
    ...(isSeller && { businessName, businessType, businessAddress, phone }),
  })

  const token = signToken(user._id)

  res.status(201).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isSeller: user.isSeller,
      businessName: user.businessName,
    },
  })
}

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email })
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = signToken(user._id)

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isSeller: user.isSeller,
      businessName: user.businessName,
    },
  })
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user)
}
