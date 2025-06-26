const { string } = require('joi');
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required.'],
      unique: [true, 'Brand name must be unique.'],
      minlength: [2, 'Brand name must be at least 3 characters.'],
      maxlength: [24, 'Brand name must not exceed 32 characters.'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    },
    image: String
  },
  { timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
