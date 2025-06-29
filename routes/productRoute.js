const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const checkCategoryExists = require('../Middlewares/checkCategoryExists');
const checkSubcategoriesExist = require('../Middlewares/checkSubcategoriesExist');
const checkBrandExists = require('../Middlewares/checkBrandExists');
const checkSubcategoriesBelongToCategory = require('../Middlewares/checkSubcategoriesBelongToCategory');
const {
  createProductValidator,
  updateProductValidator
} = require('../validators/product.validator');

const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(
    createProductValidator,
    checkCategoryExists,
    checkSubcategoriesExist,
    checkSubcategoriesBelongToCategory,
    checkBrandExists,
    createProduct
  );

router
  .route('/:id')
  .get(mongoIdValidator(), getProduct)
  .patch(
    mongoIdValidator(),
    updateProductValidator,
    checkCategoryExists,
    checkSubcategoriesExist,
    checkSubcategoriesBelongToCategory,
    checkBrandExists,
    updateProduct
  )
  .delete(mongoIdValidator(), deleteProduct);

module.exports = router;
