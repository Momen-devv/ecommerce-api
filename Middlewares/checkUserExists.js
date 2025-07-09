const User = require('../models/userModel');
const AppError = require('../utils/appError');

const checkUserExists = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('There is no user with this id', 404));
  next();
};

module.exports = checkUserExists;
