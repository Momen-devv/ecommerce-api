const Joi = require('joi');

exports.signupValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required().messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least {#limit} characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .messages({
        'string.pattern.base': 'Phone number must be 10–15 digits, optionally starting with +'
      }),
    profileImage: Joi.string().optional(),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': 'Password is required'
    }),
    passwordConfirm: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({ 'any.only': 'Passwords do not match' }),
    role: Joi.string().valid('user', 'admin').messages({
      'any.only': 'Role must be either "user" or "admin"'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid user data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }
  req.body = value;
  next();
};

exports.loginValidator = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': 'Password is required'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid user data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }
  req.body = value;
  next();
};

exports.forgotPasswordValidator = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email',
      'any.required': 'Email is required'
    })
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.details[0].message
    });
  }

  req.body = value;
  next();
};

exports.verifyResetCodeValidator = (req, res, next) => {
  const schema = Joi.object({
    resetOTP: Joi.string().optional()
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid input data',
      details: error.details.map((e) => e.message)
    });
  }

  req.body = value;
  next();
};

exports.resetPasswordValidator = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email',
      'any.required': 'Email is required'
    }),
    newPassword: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': 'Password is required'
    }),
    passwordConfirm: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({ 'any.only': 'Passwords do not match' })
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.details[0].message
    });
  }

  req.body = value;
  next();
};
