const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const authController = require('../controllers/authController');

const {
  addItemToCartValidator,
  applyCouponValidator,
  updateCartItemQuantityValidator
} = require('../validators/cart.validator');

const {
  addItemToCart,
  removeItemFromCart,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
  getCart,
  removeCoupon
} = require('../controllers/cartController');

const router = express.Router();

// Protected routes (user only)
router.use(authController.protect, authController.restricTo('user'));

// Cart operations
router.route('/').post(addItemToCartValidator, addItemToCart);
router.route('/myCart').get(getCart);
router.route('/clear').delete(clearCart);

// Coupon operations
router.route('/apply-coupon').patch(applyCouponValidator, applyCoupon);
router.route('/remove-coupon').patch(removeCoupon);

// Item operations by ID
router
  .route('/:id')
  .delete(mongoIdValidator, removeItemFromCart)
  .patch(mongoIdValidator, updateCartItemQuantityValidator, updateCartItemQuantity);

module.exports = router;
