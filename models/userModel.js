const crypto = require('crypto');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { setSlugOnSave, setSlugOnUpdate } = require('../utils/modelHelpers');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required']
    },
    slug: {
      type: String,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true
    },
    phone: String,
    profileImage: {
      url: {
        type: String,
        default:
          'https://res.cloudinary.com/dsui5qi7x/image/upload/v1752935261/ecommerce/users/user-profileImage-1752935259288.png'
      },
      public_id: {
        type: String,
        default: null
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user'
    },
    active: {
      type: Boolean,
      default: true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetOTP: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ],
    addresses: [
      {
        location: String,
        phone: String,
        city: String,
        label: {
          type: String,
          enum: ['home', 'work', 'other'],
          default: 'home'
        }
      }
    ]
  },
  { timestamps: true }
);

// Hash password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Set passwordChangedAt for JWT invalidation
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Generate slug from name
userSchema.pre('save', setSlugOnSave('name'));
userSchema.pre('findOneAndUpdate', setSlugOnUpdate('name'));

// Exclude inactive users from queries
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Generate password reset token and OTP
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const secret = process.env.CRYPTO_SECRET;

  // Hash reset token before saving
  this.passwordResetToken = crypto.createHmac('sha256', secret).update(resetToken).digest('hex');

  // Generate and hash OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.passwordResetOTP = crypto.createHmac('sha256', secret).update(otp).digest('hex');

  // Set expiry time
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  this.passwordResetVerified = false;

  // Return original (unhashed) values to send to user
  return { resetToken, otp };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
