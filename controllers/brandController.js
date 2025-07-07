const sharp = require('sharp');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const { uploadSingleImage } = require('../Middlewares/uploadImage');
const Brand = require('../models/brandModel');

exports.uploadBrandImage = uploadSingleImage('image');

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

exports.createBrand = factory.createOne(Brand);

exports.getAllBrands = factory.getAll(Brand);

exports.getBrand = factory.getOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteDelete = factory.deleteOne(Brand);
