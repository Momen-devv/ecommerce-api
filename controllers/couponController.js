const factory = require('./handlerFactory');
const Coupon = require('../models/couponModel');
const catchAsync = require('../utils/catchAsync');

// CRUD operations using factory handlers
exports.createCoupon = factory.createOne(Coupon);
exports.getAllCoupons = factory.getAll(Coupon);
exports.getCoupon = factory.getOne(Coupon);
exports.updateCoupon = factory.updateOne(Coupon);
exports.deleteCoupon = factory.deleteOne(Coupon);

// Get all non-expired coupons
exports.getActiveCoupons = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find({ expire: { $gt: Date.now() } });

  res.status(200).json({
    status: 'success',
    result: coupons.length,
    data: { coupons }
  });
});
