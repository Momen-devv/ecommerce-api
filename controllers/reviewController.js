const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');

exports.createReview = factory.createOne(Review);

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
