const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const {
  createUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  updateMePasswordValidator,
  updateMeValidator
} = require('../validators/user.validator');

const authController = require('../controllers/authController');
const checkUserExists = require('../Middlewares/checkUserExists');
const checkCurrentPasswordCorrect = require('../Middlewares/checkCurrentPasswordCorrect');
const { deleteUserImage, deleteOldProfileImage } = require('../Middlewares/deleteImages');

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  handleUserImageUpload,
  changeUserPassword,
  deleteMe,
  getMe,
  updateMe,
  updateMePassword
} = require('../controllers/userController');

const router = express.Router();

// Protected routes (accessible only if logged in)
router.use(authController.protect);

// Current logged-in user routes
router.route('/me').get(getMe, getUser);
router.route('/deleteMe').delete(deleteMe); // Not delete user data just make it active false
router
  .route('/updateMe') // Delete old profileImage
  .patch(
    uploadUserImage,
    updateMeValidator,
    deleteOldProfileImage,
    handleUserImageUpload,
    updateMe
  );
router
  .route('/updateMePassword')
  .patch(updateMePasswordValidator, checkCurrentPasswordCorrect, updateMePassword);

// Admin-only routes
router.use(authController.restricTo('admin'));

// Admin password update for a specific user
router
  .route('/changeUserPassword/:id')
  .patch(mongoIdValidator, checkUserExists, changeUserPasswordValidator, changeUserPassword);

// CRUD routes for users (admin)
router
  .route('/')
  .get(getAllUsers)
  .post(uploadUserImage, createUserValidator, handleUserImageUpload, createUser);

router
  .route('/:id')
  .get(mongoIdValidator, getUser)
  .patch(
    uploadUserImage,
    updateUserValidator,
    deleteOldProfileImage,
    handleUserImageUpload,
    updateUser
  )
  .delete(mongoIdValidator, deleteUserImage, deleteUser); // Delete profile image with deleteing user(admin only)

module.exports = router;
