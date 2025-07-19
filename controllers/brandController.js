const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');
const sharp = require('sharp');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const { uploadSingleImage } = require('../Middlewares/uploadImage');
const Brand = require('../models/brandModel');

// Upload image from req.file
exports.uploadBrandImage = uploadSingleImage('image');

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
exports.handleBrandImageUpload = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // Upload cover Image
  if (req.file) {
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(500, 500)
      .jpeg({ quality: 80 })
      .toBuffer();

    const result = await uploadToCloudinary(
      compressedBuffer,
      `brand-image-${Date.now()}`,
      'ecommerce/brands'
    );
    req.body.image = {
      url: result.secure_url,
      public_id: result.public_id
    };
  }

  next();
});

// Basic CRUD using factory functions
exports.createBrand = factory.createOne(Brand);
exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
