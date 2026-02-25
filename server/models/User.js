const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    isSeller: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?background=random',
    },

    // ── SELLER FIELDS ───────────────────────────────────────
    businessName: {
        type: String,
        trim: true,
    },
    businessType: {
        type: String,
        enum: ['Restaurant', 'Bakery', 'Café', 'Grocery', 'Cloud Kitchen', 'Other'],
    },
    businessAddress: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },

    // ── GEOLOCATION (GeoJSON) ───────────────────────────────
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],   // [longitude, latitude]
            default: [0, 0],
        },
        formattedAddress: String,
    },
}, {
    timestamps: true,
});

// ── GEOSPATIAL INDEX ────────────────────────────────────────
userSchema.index({ location: '2dsphere' });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
