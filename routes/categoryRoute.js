const express = require('express');

const { mongoIdValidator } = require('../validators/commonValidators');
const subCategoryRoute = require('./subCategoryRoute');
const {
  createCategoryValidator,
  updateCategoryValidator
} = require('../validators/category.validator');

const { deleteCategoryImage, deleteOldCategoryImage } = require('../Middlewares/deleteImages');

const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  handleCategoryImageUpload
} = require('../controllers/categoryController');

const authController = require('../controllers/authController');

const router = express.Router();

// Nested route for subcategories
router.use('/:categoryId/subcategories', subCategoryRoute);

// Routes for /api/v1/categories
router
  .route('/')
  .get(getAllCategories)
  .post(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    uploadCategoryImage,
    createCategoryValidator,
    handleCategoryImageUpload,
    createCategory
  );

// Routes for /api/v1/categories/:id
router
  .route('/:id')
  .get(mongoIdValidator, getCategory)
  .patch(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    uploadCategoryImage,
    updateCategoryValidator,
    deleteOldCategoryImage,
    handleCategoryImageUpload,
    updateCategory
  )
  .delete(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    mongoIdValidator,
    deleteCategoryImage,
    deleteCategory
  );

module.exports = router;
