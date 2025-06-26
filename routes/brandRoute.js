const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const { createBrandValidator, updateBrandValidator } = require('../validators/brand.validator');

const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteDelete
} = require('../controllers/brandController');

const router = express.Router();

router.route('/').get(getAllBrands).post(createBrandValidator, createBrand);

router
  .route('/:id')
  .get(mongoIdValidator(), getBrand)
  .patch(updateBrandValidator, updateBrand)
  .delete(mongoIdValidator(), deleteDelete);

module.exports = router;
