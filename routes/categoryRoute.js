const express = require('express');

const { mongoIdValidator } = require('../validators/commonValidators');
const subCategoryRoute = require('./subCategoryRoute');
const {
  createCategoryValidator,
  updateCategoryValidator
} = require('../validators/category.validator');

const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  reSizePhoto
} = require('../controllers/categoryController');

const authController = require('../controllers/authController');

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoryRoute);

router
  .route('/')
  .get(getAllCategories)
  .post(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    uploadCategoryImage,
    reSizePhoto,
    createCategoryValidator,
    createCategory
  );

router
  .route('/:id')
  .get(mongoIdValidator, getCategory)
  .patch(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    uploadCategoryImage,
    reSizePhoto,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    mongoIdValidator,
    deleteCategory
  );

module.exports = router;
