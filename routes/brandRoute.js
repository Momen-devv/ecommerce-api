const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const { createBrandValidator, updateBrandValidator } = require('../validators/brand.validator');
const authController = require('../controllers/authController');

const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  reSizePhoto
} = require('../controllers/brandController');

const router = express.Router();

router
  .route('/')
  .get(getAllBrands)
  .post(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    uploadBrandImage,
    reSizePhoto,
    createBrandValidator,
    createBrand
  );

router
  .route('/:id')
  .get(mongoIdValidator, getBrand)
  .patch(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    uploadBrandImage,
    reSizePhoto,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    mongoIdValidator,
    deleteBrand
  );

module.exports = router;
