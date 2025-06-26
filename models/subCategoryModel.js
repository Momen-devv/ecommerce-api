const { types, required } = require('joi');
const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'Subcategory name must be unique.'],
      minlength: [2, 'Subcategory name must be at least 2 characters.'],
      maxlength: [24, 'Subcategory name must not exceed 24 characters.']
    },
    slug: {
      type: String,
      lowercase: true
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Subcategory must belong to a category.']
    }
  },
  { timestamps: true }
);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
