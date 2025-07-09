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
    profileImage: String,
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
    passwordResetVerified: Boolean
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', setSlugOnSave('name'));

userSchema.pre('findOneAndUpdate', setSlugOnUpdate('name'));

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const setImageURL = function (doc) {
  if (doc.profileImage && !doc.profileImage.startsWith('http')) {
    doc.profileImage = `${process.env.BASE_URL}/users/${doc.profileImage}`;
  }
};

userSchema.post('init', function () {
  setImageURL(this);
});

userSchema.post('save', function () {
  setImageURL(this);
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const secret = process.env.CRYPTO_SECRET;

  this.passwordResetToken = crypto.createHmac('sha256', secret).update(resetToken).digest('hex');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.passwordResetOTP = crypto.createHmac('sha256', secret).update(otp).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  this.passwordResetVerified = false;

  return { resetToken, otp };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
