const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const checkProductExists = require('../Middlewares/checkProductExists');
const setUserId = require('../Middlewares/setUserId');
const verifyReviewOwner = require('../Middlewares/verifyReviewOwner.js');
const authController = require('../controllers/authController');
const { createReviewValidator, updateReviewValidator } = require('../validators/review.validator');

const {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  setProductIdToBody,
  createFilterObj
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getAllReviews)
  .post(
    authController.protect,
    authController.restricTo('user'),
    setProductIdToBody,
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
    verifyReviewOwner,
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
