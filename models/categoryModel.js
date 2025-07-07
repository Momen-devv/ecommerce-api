const mongoose = require('mongoose');

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

const setImageURL = function (doc) {
  if (doc.image) {
    imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageURL;
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
