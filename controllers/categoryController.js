const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');
const sharp = require('sharp');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const { uploadSingleImage } = require('../Middlewares/uploadImage');
const Category = require('../models/categoryModel');

// Middleware to handle single image upload
exports.uploadCategoryImage = uploadSingleImage('image');

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
exports.handleCategoryImageUpload = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // Upload cover Image
  if (req.file) {
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(500, 500)
      .jpeg({ quality: 80 })
      .toBuffer();

    const result = await uploadToCloudinary(
      compressedBuffer,
      `category-image-${Date.now()}`,
      'ecommerce/categories'
    );
    req.body.image = {
      url: result.secure_url,
      public_id: result.public_id
    };
  }

  next();
});

// CRUD handlers using generic factory functions
exports.createCategory = factory.createOne(Category);
exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
