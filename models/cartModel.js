const mongoose = require('mongoose');

const Settings = require('../models/settingsModel');
// Mongoose Cart Schema
const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Cart must belong to a user']
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: [true, 'Cart item must have a product']
        },
        color: String,
        quantity: {
          type: Number,
          default: 1
        },
        price: Number
      }
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    shippingPrice: Number,
    appliedCoupon: {
      type: String,
      default: null
    },
    taxRate: Number,
    taxAmount: Number,
    finalTotal: Number
  },
  {
    timestamps: true
  }
);

// Calculate total prices including coupon, tax, and shipping
cartSchema.methods.updateCartTotals = async function () {
  // Calculate total price (before discount)
  this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  // Handle coupon discount (if applied)
  if (this.appliedCoupon) {
    const coupon = await mongoose.model('Coupon').findOne({ name: this.appliedCoupon });
    if (coupon && coupon.expire > Date.now()) {
      this.totalPriceAfterDiscount = this.totalPrice - (this.totalPrice * coupon.discount) / 100;
    } else {
      this.appliedCoupon = null;
      this.totalPriceAfterDiscount = undefined;
    }
  }

  // Load dynamic settings (tax, shipping, free shipping threshold)
  const settings = await Settings.findOne();

  const basePrice = this.totalPriceAfterDiscount || this.totalPrice;

  // Tax calculation
  this.taxRate = settings.taxRate;
  this.taxAmount = +((basePrice * settings.taxRate) / 100).toFixed(2);

  // Shipping calculation
  this.shippingPrice = basePrice >= settings.freeShippingThreshold ? 0 : settings.shippingPrice;

  // Final total = base + shipping + tax
  this.finalTotal = +(basePrice + this.taxAmount + this.shippingPrice).toFixed(2);
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
