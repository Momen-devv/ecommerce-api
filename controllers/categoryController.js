const sharp = require('sharp');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const { uploadSingleImage } = require('../Middlewares/uploadImage');
const Category = require('../models/categoryModel');

exports.uploadCategoryImage = uploadSingleImage('image');

exports.reSizePhoto = catchAsync(async (req, res, next) => {
  const fileName = `category-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  req.body.image = fileName;
  next();
});

exports.createCategory = factory.createOne(Category);

exports.getAllCategories = factory.getAll(Category);

exports.getCategory = factory.getOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
