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
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoryRoute);

router.route('/').get(getAllCategories).post(createCategoryValidator, createCategory);

router
  .route('/:id')
  .get(mongoIdValidator(), getCategory)
  .patch(updateCategoryValidator, updateCategory)
  .delete(mongoIdValidator(), deleteCategory);

module.exports = router;
