const mongoose = require('mongoose');
const { setSlugOnSave, setSlugOnUpdate } = require('../utils/modelHelpers');

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

// Generate slug before save/update
brandSchema.pre('save', setSlugOnSave('name'));
brandSchema.pre('findOneAndUpdate', setSlugOnUpdate('name'));

// Add full image URL after retrieving or saving
const setImageURL = function (doc) {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/brands/${doc.image}`;
  }
};

brandSchema.post('init', function () {
  setImageURL(this);
});

brandSchema.post('save', function () {
  setImageURL(this);
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
