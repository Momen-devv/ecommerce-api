const mongoose = require('mongoose');
const Product = require('../models/productModel');

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      required: [true, 'Rating is required']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product']
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate reviews per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Auto-populate user data on queries
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'profileImage name'
  });
});

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$ratings' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRatings
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0
    });
  }
};

// Recalculate ratings after saving a review
reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.product);
});

// Store doc before update/delete to access product ID
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

// Recalculate ratings after update/delete
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.product);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
