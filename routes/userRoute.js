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

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  reSizePhoto,
  changeUserPassword,
  deleteMe,
  getMe,
  updateMe,
  updateMePassword
} = require('../controllers/userController');

const router = express.Router();

router.use(authController.protect);

router.route('/me').get(getMe, getUser);
router.route('/deleteMe').delete(deleteMe);
router.route('/updateMe').patch(uploadUserImage, reSizePhoto, updateMeValidator, updateMe);
router
  .route('/updateMePassword')
  .patch(updateMePasswordValidator, checkCurrentPasswordCorrect, updateMePassword);

router.use(authController.restricTo('admin'));

router
  .route('/changeUserPassword/:id')
  .patch(mongoIdValidator, checkUserExists, changeUserPasswordValidator, changeUserPassword);

router
  .route('/')
  .get(getAllUsers)
  .post(uploadUserImage, reSizePhoto, createUserValidator, createUser);

router
  .route('/:id')
  .get(mongoIdValidator, getUser)
  .patch(uploadUserImage, reSizePhoto, updateUserValidator, updateUser)
  .delete(mongoIdValidator, deleteUser);

module.exports = router;
