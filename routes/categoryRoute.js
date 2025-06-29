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

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoryRoute);

router
  .route('/')
  .get(getAllCategories)
  .post(uploadCategoryImage, reSizePhoto, createCategoryValidator, createCategory);

router
  .route('/:id')
  .get(mongoIdValidator(), getCategory)
  .patch(uploadCategoryImage, reSizePhoto, updateCategoryValidator, updateCategory)
  .delete(mongoIdValidator(), deleteCategory);

module.exports = router;
