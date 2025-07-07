const sharp = require('sharp');
const Product = require('../models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const { uploadMixOfImages } = require('../Middlewares/uploadImage');

exports.uploadProductImages = uploadMixOfImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 8 }
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${Math.round(Math.random() * 1e9)}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imagesName = `product-${Math.round(Math.random() * 1e9)}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imagesName}`);

        req.body.images.push(imagesName);
      })
    );
  }
  next();
});

exports.createProduct = factory.createOne(Product);

exports.getAllProducts = factory.getAll(Product, 'Products');

exports.getProduct = factory.getOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
