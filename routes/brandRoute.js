const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const { createBrandValidator, updateBrandValidator } = require('../validators/brand.validator');

const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteDelete,
  uploadBrandImage,
  reSizePhoto
} = require('../controllers/brandController');

const router = express.Router();

router
  .route('/')
  .get(getAllBrands)
  .post(uploadBrandImage, reSizePhoto, createBrandValidator, createBrand);

router
  .route('/:id')
  .get(mongoIdValidator(), getBrand)
  .patch(uploadBrandImage, reSizePhoto, updateBrandValidator, updateBrand)
  .delete(mongoIdValidator(), deleteDelete);

module.exports = router;
