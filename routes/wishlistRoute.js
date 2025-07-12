const express = require('express');

const {
  addProductToWishlist,
  deleteProductFromWishlist,
  getWishlist
} = require('../controllers/wishlistController');
const { mongoIdValidator } = require('../validators/commonValidators');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.restricTo('user'));

router.route('/').get(getWishlist);

router
  .route('/:id')
  .post(mongoIdValidator, addProductToWishlist)
  .delete(mongoIdValidator, deleteProductFromWishlist);

module.exports = router;
