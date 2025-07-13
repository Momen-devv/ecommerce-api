const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

// Add new address to user's address list
exports.addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // Add address only if it's not duplicated
      $addToSet: { addresses: req.body }
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      addresses: user.addresses
    }
  });
});

// Delete address by its _id
exports.deleteAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // Remove address that matches the given id
      $pull: { addresses: { _id: req.params.id } }
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: {
      addresses: user.addresses
    }
  });
});

// Get all addresses for the current user
exports.getAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('addresses');

  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: {
      addresses: user.addresses
    }
  });
});

// Update a specific address by its _id
exports.updateAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Find the address inside the array
  const address = user.addresses.id(req.params.id);

  if (!address) return next(new AppError('Address not found', 404));

  // Update only provided fields
  if (req.body.location !== undefined) address.location = req.body.location;
  if (req.body.phone !== undefined) address.phone = req.body.phone;
  if (req.body.city !== undefined) address.city = req.body.city;
  if (req.body.label !== undefined) address.label = req.body.label;

  await user.save(); // Save embedded document changes

  res.status(200).json({
    status: 'success',
    data: {
      addresses: user.addresses
    }
  });
});
