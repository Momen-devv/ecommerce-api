const Category = require("../models/categoryModel");
var slugify = require("slugify");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
  });

  res.status(201).json({
    status: "success",
    data: category,
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Category.find(), req.query).paginate();

  const categories = await features.query;

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No category found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    return next(new AppError("No category found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("No category found with this ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
