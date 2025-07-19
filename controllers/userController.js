const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sharp = require('sharp');
const { uploadSingleImage } = require('../Middlewares/uploadImage');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT token
const createToken = (id) =>
  jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

// Create and send JWT token in cookie
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
    data: { user }
  });
};

// Upload user image middleware
exports.uploadUserImage = uploadSingleImage('profileImage');

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, publicId, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Main middleware to process + upload images
exports.handleUserImageUpload = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // Upload cover Image
  if (req.file) {
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(500, 500, {
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy
      })
      .composite([
        {
          input: Buffer.from(`<svg><circle cx="250" cy="250" r="250" fill="white"/></svg>`),
          blend: 'dest-in'
        }
      ])
      .png()
      .toBuffer();

    const result = await uploadToCloudinary(
      compressedBuffer,
      `user-profileImage-${Date.now()}`,
      'ecommerce/users'
    );
    req.body.profileImage = {
      url: result.secure_url,
      public_id: result.public_id
    };
  }

  next();
});

// Admin actions
exports.createUser = factory.createOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

// Admin update user profile
exports.updateUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      slug: req.body.slug,
      profileImage: req.body.profileImage,
      role: req.body.role
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!doc) return next(new AppError('No doc found with this ID', 404));

  res.status(200).json({ status: 'success', data: doc });
});

// Admin change user password
exports.changeUserPassword = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now()
    },
    { new: true }
  );

  if (!user) return next(new AppError('No doc found with this ID', 404));

  await user.save();

  res.status(200).json({ status: 'success', data: user });
});

// Middleware to attach current user ID to req.params
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// Deactivate current user account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'success', data: null });
});

// User updates their own password
exports.updateMePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now()
    },
    { new: true }
  );

  if (!user) return next(new AppError('No doc found with this ID', 404));

  await user.save();
  createSendToken(user, 200, req, res);
});

// User updates their own profile data
exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      profileImage: req.body.profileImage
    },
    { new: true }
  );

  if (!user) return next(new AppError('No doc found with this ID', 404));

  res.status(200).json({ status: 'success', data: user });
});
