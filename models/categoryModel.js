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
    image: String
  },
  { timestamps: true }
);

// Generate slug before save/update
categorySchema.pre('save', setSlugOnSave('name'));
categorySchema.pre('findOneAndUpdate', setSlugOnUpdate('name'));

// Add full image URL after retrieving or saving
const setImageURL = function (doc) {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
  }
};

categorySchema.post('init', function () {
  setImageURL(this);
});

categorySchema.post('save', function () {
  setImageURL(this);
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
