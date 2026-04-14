import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // Role
    isSeller: { type: Boolean, default: false },

    // Seller-only fields
    businessName: { type: String },
    businessType: {
      type: String,
      enum: ['bakery', 'cafe', 'other'],
    },
    businessAddress: { type: String },
    phone: { type: String },

    // Geolocation (GeoJSON) — used for nearby discovery
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
  },
  { timestamps: true }
)

userSchema.index({ location: '2dsphere' })

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
