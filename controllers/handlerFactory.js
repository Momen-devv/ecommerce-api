const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const slugify = require('slugify');
const APIFeatures = require('../utils/apiFeatures');

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = { ...req.body };
    if (data.name) {
      data.slug = slugify(data.name);
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No doc found with this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError('No doc found with this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const filterQuery = features.query.getFilter();

    const [docs, totalDocs] = await Promise.all([
      features.query,
      Model.countDocuments(filterQuery)
    ]);

    const totalPages = Math.ceil(totalDocs / features.pagination.limit);

    res.status(200).json({
      status: 'success',
      results: docs.length,
      pagination: {
        totalDocs,
        totalPages,
        currentPage: features.pagination.page
      },
      data: docs
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No doc found with this ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.createOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const data = { ...req.body };

    if (data.name && options.slugifyName) {
      data.slug = slugify(data.name);
    }

    const doc = await Model.create(data);

    res.status(201).json({
      status: 'success',
      data: doc
    });
  });
