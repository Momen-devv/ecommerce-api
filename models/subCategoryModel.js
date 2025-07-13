const mongoose = require('mongoose');
const { setSlugOnSave, setSlugOnUpdate } = require('../utils/modelHelpers');

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

// Set slug on create and update
subCategorySchema.pre('save', setSlugOnSave('name'));
subCategorySchema.pre('findOneAndUpdate', setSlugOnUpdate('name'));

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;
