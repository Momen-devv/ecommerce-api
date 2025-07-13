const sharp = require('sharp');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const { uploadSingleImage } = require('../Middlewares/uploadImage');
const Brand = require('../models/brandModel');

// Upload image from req.file
exports.uploadBrandImage = uploadSingleImage('image');

// Resize and save brand image
exports.reSizePhoto = catchAsync(async (req, res, next) => {
  const fileName = `brand-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${fileName}`);

    req.body.image = fileName;
  }

  next();
});

// Basic CRUD using factory functions
exports.createBrand = factory.createOne(Brand);
exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
