const express = require('express');
const router = express.Router({ mergeParams: true });

const { mongoIdValidator } = require('../validators/commonValidators');
const checkCategoryExists = require('../Middlewares/checkCategoryExists');
const {
  createSubCategoryValidator,
  updateSubCategoryValidator
} = require('../validators/subCategory.validator');

const {
  createSubCategory,
  updateSubCategory,
  getAllSubCategories,
  getSubCategory,
  deleteSubCategory
} = require('../controllers/subCategoryController');

// Routes
router
  .route('/')
  .get(getAllSubCategories)
  .post(createSubCategoryValidator, checkCategoryExists, createSubCategory);

router
  .route('/:id')
  .get(mongoIdValidator(), getSubCategory)
  .patch(updateSubCategoryValidator, checkCategoryExists, updateSubCategory)
  .delete(mongoIdValidator(), deleteSubCategory);

module.exports = router;
