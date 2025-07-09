const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const checkProductExists = require('../Middlewares/checkProductExists');
const setUserId = require('../Middlewares/setUserId');
const authController = require('../controllers/authController');
const { createReviewValidator, updateReviewValidator } = require('../validators/review.validator');

const {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(getAllReviews)
  .post(
    authController.protect,
    authController.restricTo('user'),
    createReviewValidator,
    setUserId,
    checkProductExists,
    createReview
  );

router
  .route('/:id')
  .get(mongoIdValidator, getReview)
  .patch(
    mongoIdValidator,
    authController.protect,
    authController.restricTo('user'),
    updateReviewValidator,
    updateReview
  )
  .delete(
    mongoIdValidator,
    authController.protect,
    authController.restricTo('admin', 'manager', 'user'),
    deleteReview
  );

module.exports = router;
