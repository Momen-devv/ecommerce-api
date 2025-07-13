const mongoose = require('mongoose');
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
    finalTotal: Number
  },
  {
    timestamps: true
  }
);

// Calculate total prices and shipping
cartSchema.methods.updateCartTotals = async function () {
  const hasItems = this.cartItems.length > 0;

  // Total before discount
  this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  // Apply coupon if valid
  if (this.appliedCoupon) {
    const coupon = await mongoose.model('Coupon').findOne({ name: this.appliedCoupon });
    if (coupon && coupon.expire > Date.now()) {
      this.totalPriceAfterDiscount = this.totalPrice - (this.totalPrice * coupon.discount) / 100;
    } else {
      this.appliedCoupon = null;
      this.totalPriceAfterDiscount = undefined;
    }
  }

  // Shipping and final total
  const basePrice = this.totalPriceAfterDiscount || this.totalPrice;
  this.shippingPrice = hasItems ? (this.totalPrice > 10000 ? 0 : 50) : 0;
  this.finalTotal = basePrice + this.shippingPrice;
};
