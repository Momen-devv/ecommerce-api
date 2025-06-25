const express = require('express');
const router = express.Router();

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
  .get(mongoIdValidator('SubCategoryId'), getSubCategory)
  .patch(updateSubCategoryValidator, updateSubCategory)
  .delete(mongoIdValidator('SubCategoryId'), deleteSubCategory);

module.exports = router;
