const Settings = require('../models/settingsModel');
const catchAsync = require('../utils/catchAsync');

exports.updateSettings = catchAsync(async (req, res, next) => {
  const updated = await Settings.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true
  });

  res.status(200).json({
    status: 'success',
    data: updated
  });
});

exports.getSettings = catchAsync(async (req, res, next) => {
  const settings = await Settings.findOne();
  res.status(200).json({ status: 'success', data: settings });
});
