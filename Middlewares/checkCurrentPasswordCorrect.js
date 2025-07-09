const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

const checkCurrentPasswordCorrect = async (req, res, next) => {
  const match = await bcrypt.compare(req.body.currentPassword, req.user.password);
  if (!match) {
    return next(new AppError('Not correct password', 401));
  }

  next();
};

module.exports = checkCurrentPasswordCorrect;
