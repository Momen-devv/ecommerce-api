const SubCategory = require('../models/subCategoryModel');
const factory = require('./handlerFactory');

// Set category ID from params to body (for nested routes)
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// Create filter object to get subcategories for a specific category
exports.createFilterObj = (req, res, next) => {
  let filterObject;
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// CRUD operations
exports.createSubCategory = factory.createOne(SubCategory);
exports.getAllSubCategories = factory.getAll(SubCategory);
exports.getSubCategory = factory.getOne(SubCategory);
exports.updateSubCategory = factory.updateOne(SubCategory);
exports.deleteSubCategory = factory.deleteOne(SubCategory);
