const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary');

module.exports.deleteProductImages = catchAsync(async (req, res, next) => {
  // Find product by id
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('No product found with this ID', 404));

  // Delete cover image from cloud if exist
  if (product.imageCover?.public_id) {
    await cloudinary.uploader.destroy(product.imageCover.public_id);
  }

  //  Delete cover images from cloud if exist
  if (Array.isArray(product.images)) {
    const deletePromises = product.images
      .filter((img) => img?.public_id)
      .map((img) => cloudinary.uploader.destroy(img.public_id));

    await Promise.all(deletePromises);
  }

  next();
});

module.exports.deleteOldImagesIfUpdated = catchAsync(async (req, res, next) => {
  // Check if there changes on imageCover or images
  const isCoverUpdated = req.files?.imageCover;
  const isImagesUpdated = req.files?.images;

  // If not next
  if (!isCoverUpdated && !isImagesUpdated) return next();

  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('No product found with this ID', 404));

  // Delete cover image from cloud if exist
  if (isCoverUpdated && product.imageCover?.public_id) {
    await cloudinary.uploader.destroy(product.imageCover.public_id);
  }

  //  Delete cover images from cloud if exist
  if (isImagesUpdated && Array.isArray(product.images)) {
    const deletePromises = product.images
      .filter((img) => img?.public_id)
      .map((img) => cloudinary.uploader.destroy(img.public_id));
    await Promise.all(deletePromises);
  }

  next();
});
