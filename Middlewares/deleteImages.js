const { deleteImage, deleteImages } = require('../utils/imageCleanup');
const Brand = require('../models/brandModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Products
module.exports.deleteProductImages = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('No product found with this ID', 404));

  await deleteImage(product.imageCover?.public_id);
  await deleteImages(product.images);

  next();
});

module.exports.deleteOldImagesIfUpdated = catchAsync(async (req, res, next) => {
  const isCoverUpdated = req.files?.imageCover;
  const isImagesUpdated = req.files?.images;

  if (!isCoverUpdated && !isImagesUpdated) return next();

  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('No product found with this ID', 404));

  if (isCoverUpdated) await deleteImage(product.imageCover?.public_id);
  if (isImagesUpdated) await deleteImages(product.images);

  next();
});

// Users
module.exports.deleteUserImage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('No user found with this ID', 404));

  await deleteImage(user.profileImage?.public_id);

  next();
});

module.exports.deleteOldProfileImage = catchAsync(async (req, res, next) => {
  if (!req.file?.buffer) return next();

  const userId = req.params.id || req.user._id;
  const user = await User.findById(userId);
  if (!user) return next(new AppError('No user found with this ID', 404));

  await deleteImage(user.profileImage?.public_id);

  next();
});

// Brands
module.exports.deleteBrandImage = catchAsync(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return next(new AppError('No brand found with this ID', 404));

  await deleteImage(brand.image?.public_id);

  next();
});

module.exports.deleteOldBrandImage = catchAsync(async (req, res, next) => {
  if (!req.file?.buffer) return next();

  const brand = await Brand.findById(req.params.id);
  if (!brand) return next(new AppError('No brand found with this ID', 404));

  await deleteImage(brand.image?.public_id);

  next();
});

// Category
module.exports.deleteCategoryImage = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError('No category found with this ID', 404));

  await deleteImage(category.image?.public_id);

  next();
});

module.exports.deleteOldCategoryImage = catchAsync(async (req, res, next) => {
  if (!req.file?.buffer) return next();

  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError('No category found with this ID', 404));

  await deleteImage(category.image?.public_id);

  next();
});
