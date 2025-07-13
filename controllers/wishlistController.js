const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

// Add product to wishlist
exports.addProductToWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.params.id } }, // Prevent duplicates
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: { wishlist: user.wishlist }
  });
});

// Remove product from wishlist
exports.deleteProductFromWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.id } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: { wishlist: user.wishlist }
  });
});

// Get user's wishlist
exports.getWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('wishlist').populate('wishlist');

  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    results: user.wishlist.length,
    data: { wishlist: user.wishlist }
  });
});
