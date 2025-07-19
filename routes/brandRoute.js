const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const { createBrandValidator, updateBrandValidator } = require('../validators/brand.validator');
const authController = require('../controllers/authController');

const { deleteBrandImage, deleteOldBrandImage } = require('../Middlewares/deleteImages');

const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  handleBrandImageUpload
} = require('../controllers/brandController');

const router = express.Router();

// Public routes
router.route('/').get(getAllBrands);

// Protected routes (admin/manager only)
router.post(
  '/',
  authController.protect,
  authController.restricTo('admin', 'manager'),
  uploadBrandImage,
  createBrandValidator,
  handleBrandImageUpload,
  createBrand
);

router
  .route('/:id')
  .get(mongoIdValidator, getBrand)
  .patch(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    uploadBrandImage,
    updateBrandValidator,
    deleteOldBrandImage,
    handleBrandImageUpload, // middlewaer delete image after update image
    updateBrand
  )
  .delete(
    authController.protect,
    authController.restricTo('admin', 'manager'),
    mongoIdValidator,
    deleteBrandImage,
    deleteBrand
  );

module.exports = router;
