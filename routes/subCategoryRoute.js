const express = require('express');
const router = express.Router({ mergeParams: true });

const { mongoIdValidator } = require('../validators/commonValidators');
const checkCategoryExists = require('../Middlewares/checkCategoryExists');
const {
  createSubCategoryValidator,
  updateSubCategoryValidator
} = require('../validators/subCategory.validator');

const authController = require('../controllers/authController');

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
  .post(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    createSubCategoryValidator,
    checkCategoryExists,
    createSubCategory
  );

router
  .route('/:id')
  .get(mongoIdValidator, getSubCategory)
  .patch(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    updateSubCategoryValidator,
    checkCategoryExists,
    updateSubCategory
  ).delete;
(authController.protect,
  authController.restricTo('admin', 'manager'),
  (mongoIdValidator, deleteSubCategory));

module.exports = router;
