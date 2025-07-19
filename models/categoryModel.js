const mongoose = require('mongoose');
const { setSlugOnSave, setSlugOnUpdate } = require('../utils/modelHelpers');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      unique: [true, 'Category name must be unique.'],
      minlength: [2, 'Category name must be at least 3 characters.'],
      maxlength: [24, 'Category name must not exceed 32 characters.'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    },
    image: {
      url: {
        type: String,
        require: [true, 'Category must hava a image']
      },
      public_id: {
        type: String,
        require: true
      }
    }
  },
  { timestamps: true }
);

// Generate slug before save/update
categorySchema.pre('save', setSlugOnSave('name'));
categorySchema.pre('findOneAndUpdate', setSlugOnUpdate('name'));

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
