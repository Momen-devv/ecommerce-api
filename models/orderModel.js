const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: true
        },
        color: String,
        quantity: Number,
        price: Number
      }
    ],
    shippingAddress: {
      location: { type: String, required: true },
      city: { type: String },
      phone: { type: String, required: true },
      label: { type: String, enum: ['home', 'work', 'other'], default: 'home' }
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card'],
      default: 'cash'
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'],
      default: 'pending'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: Date,
    taxRate: Number,
    taxAmount: Number,
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    shippingPrice: Number,
    appliedCoupon: String,
    finalTotal: Number
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name email profileImage' }).populate({
    path: 'cartItems.product',
    select: 'title imageCover'
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
