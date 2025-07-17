const mongoose = require('mongoose');
const { setSlugOnSave, setSlugOnUpdate } = require('../utils/modelHelpers');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [5, 'Product title must be at least 5 characters'],
      maxlength: [80, 'Product title must not exceed 80 characters']
    },
    slug: {
      type: String,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Product description must be at least 10 characters']
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required']
    },
    sold: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      max: [500000, 'Product price must not exceed 500,000 EGP']
    },
    priceAfterDiscount: {
      type: Number
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, 'Product image cover is required']
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category']
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
      }
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand'
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be >= 1.0'],
      max: [5, 'Rating must be <= 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Auto-populate category name on find
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id'
  });
  next();
});

// Virtual populate for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

// Set slug before save and update
productSchema.pre('save', setSlugOnSave('title'));
productSchema.pre('findOneAndUpdate', setSlugOnUpdate('title'));

// Convert image names to full URLs
const setImageURL = function (doc) {
  if (doc.imageCover && !doc.imageCover.startsWith('http')) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images) {
    doc.images = doc.images.map((image) => `${process.env.BASE_URL}/products/${image}`);
  }
};

productSchema.post('init', function () {
  setImageURL(this);
});

productSchema.post('save', function () {
  setImageURL(this);
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
