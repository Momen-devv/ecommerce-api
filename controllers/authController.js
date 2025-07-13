const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const User = require('../models/userModel');

// Generate JWT token
const createToken = (id) =>
  jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

// Send JWT token via cookie + response
const createSendToken = (user, statusCode, req, res) => {
  const token = createToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// SIGN UP
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome(); // Send welcome email

  createSendToken(newUser, 201, req, res);
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');

  // Check credentials
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

// LOGOUT
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

// PROTECT ROUTES (middleware)
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Get token from headers or cookies
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'loggedout') {
    return next(new AppError('You are not logged in!', 401));
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }

  // Check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser || currentUser.active === false) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // Check if password was changed after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password changed recently! Please log in again.', 401));
  }

  req.user = currentUser;
  next();
});

// RESTRICT TO ROLES (admin only)

exports.restricTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  });

// FORGOT PASSWORD (send token or OTP)
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  const { resetToken, otp } = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL, otp).sendPasswordReset(); // Send email with token + OTP

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    // If email sending fails, reset values
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetOTP = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }
});

// VERIFY RESET CODE (token or OTP)

exports.verifyPassResetCode = catchAsync(async (req, res, next) => {
  let user;
  const secret = process.env.CRYPTO_SECRET;

  if (req.params.token) {
    const hashResetToken = crypto
      .createHmac('sha256', secret)
      .update(req.params.token)
      .digest('hex');

    user = await User.findOne({
      passwordResetToken: hashResetToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) return next(new AppError('Token is invalid or has expired', 400));
  } else if (req.body.resetOTP) {
    const hashOTP = crypto.createHmac('sha256', secret).update(req.body.resetOTP).digest('hex');

    user = await User.findOne({
      passwordResetOTP: hashOTP,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) return next(new AppError('OTP is invalid or has expired', 400));
  } else {
    return next(new AppError('Please provide a token or an OTP to reset your password', 400));
  }

  // If passed, mark as verified
  user.passwordResetVerified = true;
  await user.save({ validateBeforeSave: true });

  res.status(200).json({ status: 'success' });
});

// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError('No user found with this email address.', 404));
  if (!user.passwordResetVerified) {
    return next(new AppError('Please verify your reset token or OTP first.', 400));
  }

  // Update password + clear reset fields
  user.password = req.body.newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save({ validateBeforeSave: true });

  createSendToken(user, 200, req, res);
});
