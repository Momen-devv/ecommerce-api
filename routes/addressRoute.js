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

// Require user to be authenticated and authorized as 'user'
router.use(authController.protect, authController.restricTo('user'));

// Routes for managing addresses
router
  .route('/')
  .get(getAddress) // Get all user addresses
  .post(addAddressValidator, addAddress); // Add new address

router
  .route('/:id')
  .delete(mongoIdValidator, deleteAddress) // Delete address by ID
  .patch(updateAddressValidator, updateAddress); // Update address by ID

module.exports = router;
