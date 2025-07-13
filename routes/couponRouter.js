const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const authController = require('../controllers/authController');

const { createCouponValidator, updateCouponValidator } = require('../validators/coupon.validator');

const {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  getActiveCoupons
} = require('../controllers/couponController');

const router = express.Router();

router.get('/active', getActiveCoupons);

router
  .route('/')
  .get(getAllCoupons)
  .post(
    authController.protect,
    authController.restricTo('admin'),
    createCouponValidator,
    createCoupon
  );

router
  .route('/:id')
  .get(mongoIdValidator, getCoupon)
  .patch(
    authController.protect,
    authController.restricTo('admin'),
    updateCouponValidator,
    updateCoupon
  )
  .delete(
    authController.protect,
    authController.restricTo('admin'),
    mongoIdValidator,
    deleteCoupon
  );

module.exports = router;
