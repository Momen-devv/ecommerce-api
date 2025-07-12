const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
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

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
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

exports.updateAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.id);

  if (!address) return next(new AppError('Address not found', 404));

  if (req.body.location !== undefined) address.location = req.body.location;
  if (req.body.phone !== undefined) address.phone = req.body.phone;
  if (req.body.city !== undefined) address.city = req.body.city;
  if (req.body.label !== undefined) address.label = req.body.label;

  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      addresses: user.addresses
    }
  });
});
