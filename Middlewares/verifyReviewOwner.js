const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');

const verifyReviewOwner = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  if (review.user._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};

module.exports = verifyReviewOwner;
