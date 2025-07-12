const express = require('express');

const {
  addAddress,
  deleteAddress,
  getAddress,
  updateAddress
} = require('../controllers/addressesController');

const { addAddressValidator, updateAddressValidator } = require('../validators/user.validator');

const { mongoIdValidator } = require('../validators/commonValidators');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.restricTo('user'));

router.route('/').get(getAddress).post(addAddressValidator, addAddress);

router
  .route('/:id')
  .delete(mongoIdValidator, deleteAddress)
  .patch(updateAddressValidator, updateAddress);

module.exports = router;
