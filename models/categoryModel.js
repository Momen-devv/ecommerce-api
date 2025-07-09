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

categorySchema.pre('save', setSlugOnSave('name'));

categorySchema.pre('findOneAndUpdate', setSlugOnUpdate('name'));

// categorySchema.pre('save', function (next) {
//   if (this.isModified('name')) {
//     this.slug = slugify(this.name, { lower: true });
//   }
//   next();
// });

// categorySchema.pre('findOneAndUpdate', function (next) {
//   const update = this.getUpdate();
//   if (update.name) {
//     update.slug = slugify(update.name, { lower: true });
//     this.setUpdate(update);
//   }
//   next();
// });

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
