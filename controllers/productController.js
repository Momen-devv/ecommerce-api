const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');
const sharp = require('sharp');
const Product = require('../models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const { uploadMixOfImages } = require('../Middlewares/uploadImage');

// Middleware to handle image upload from request
exports.uploadProductImages = uploadMixOfImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, publicId, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Main middleware to process + upload images
exports.handleProductImagesUpload = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // Upload cover Image
  if (req.files.imageCover) {
    const file = req.files.imageCover[0];

    const compressedBuffer = await sharp(file.buffer)
      .resize(2000, 1333)
      .jpeg({ quality: 95 })
      .toBuffer();

    const result = await uploadToCloudinary(
      compressedBuffer,
      `product-cover-${Date.now()}`,
      'ecommerce/products'
    );

    req.body.imageCover = {
      url: result.secure_url,
      public_id: result.public_id
    };
  }

  // Upload multiple Images
  if (req.files.images && req.files.images.length > 0) {
    const uploadedImages = await Promise.all(
      req.files.images.map(async (file, index) => {
        const compressedBuffer = await sharp(file.buffer)
          .resize(600, 600)
          .jpeg({ quality: 85 })
          .toBuffer();

        const result = await uploadToCloudinary(
          compressedBuffer,
          `product-${Date.now()}-${index + 1}`,
          'ecommerce/products'
        );

        return {
          url: result.secure_url,
          public_id: result.public_id
        };
      })
    );

    req.body.images = uploadedImages;
  }

  next();
});

// CRUD operations
exports.createProduct = factory.createOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, 'reviews'); // populate reviews
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
