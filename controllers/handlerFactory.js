const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc
    });
  });

exports.getOne = (Model, populationOpt) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    const doc = await query;
    if (!doc) {
      return next(new AppError('No doc found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.getAll = (Model, modelName = '') =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .search(modelName)
      .limitFields()
      .paginate();

    const docs = await features.query;
    const filteredQuery = new APIFeatures(Model.find(filter), req.query).filter().search(modelName);
    const totalDocs = await filteredQuery.query.clone().countDocuments();
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

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
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
