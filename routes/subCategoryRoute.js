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
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj
} = require('../controllers/subCategoryController');

// GET all subcategories or POST a new one (optionally under a specific category)
router
  .route('/')
  .get(createFilterObj, getAllSubCategories)
  .post(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    setCategoryIdToBody,
    createSubCategoryValidator,
    checkCategoryExists,
    createSubCategory
  );

// GET, UPDATE or DELETE a specific subcategory
router
  .route('/:id')
  .get(mongoIdValidator, getSubCategory)
  .patch(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    updateSubCategoryValidator,
    checkCategoryExists,
    updateSubCategory
  )
  .delete(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    mongoIdValidator,
    deleteSubCategory
  );

module.exports = router;
