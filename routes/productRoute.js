const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const checkCategoryExists = require('../Middlewares/checkCategoryExists');
const checkSubcategoriesExist = require('../Middlewares/checkSubcategoriesExists');
const checkBrandExists = require('../Middlewares/checkBrandExists');
const checkSubcategoriesBelongToCategory = require('../Middlewares/checkSubcategoriesBelongToCategory');
const { subcategoriesToArray } = require('../Middlewares/subcategoriesToArray');
const {
  createProductValidator,
  updateProductValidator
} = require('../validators/product.validator');
const authController = require('../controllers/authController');
const reviewRoute = require('./reviewRoute');

const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages
} = require('../controllers/productController');

const router = express.Router();

// Nested route: /products/:productId/reviews
router.use('/:productId/reviews', reviewRoute);

// /api/v1/products
router
  .route('/')
  .get(getAllProducts)
  .post(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    uploadProductImages,
    resizeProductImages,
    subcategoriesToArray,
    createProductValidator,
    checkCategoryExists,
    checkSubcategoriesExist,
    checkSubcategoriesBelongToCategory,
    checkBrandExists,
    createProduct
  );

// /api/v1/products/:id
router
  .route('/:id')
  .get(mongoIdValidator, getProduct)
  .patch(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    mongoIdValidator,
    uploadProductImages,
    resizeProductImages,
    subcategoriesToArray,
    updateProductValidator,
    checkCategoryExists,
    checkSubcategoriesExist,
    checkSubcategoriesBelongToCategory,
    checkBrandExists,
    updateProduct
  )
  .delete(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    mongoIdValidator,
    deleteProduct
  );

module.exports = router;
