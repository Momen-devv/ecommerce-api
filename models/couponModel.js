const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coupon name is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount is required'],
      min: [0, 'Discount must be at least 0'],
      max: [100, 'Discount cannot exceed 100']
    },
    expire: {
      type: Date,
      required: [true, 'Coupon expiration date is required']
    }
  },
  {
    timestamps: true
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
