const Joi = require('joi');

exports.createUserValidator = (req, res, next) => {
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

exports.updateUserValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least {#limit} characters',
      'string.max': 'Name must be at most {#limit} characters'
    }),
    image: Joi.string().uri().messages({
      'string.uri': 'Image must be a valid URL'
    }),
    email: Joi.string().email().optional().messages({
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
    role: Joi.string().valid('user', 'admin').messages({
      'any.only': 'Role must be either "user" or "admin"'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid data for updating user',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};

exports.changeUserPasswordValidator = async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': 'Password is required'
    }),
    passwordConfirm: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({ 'any.only': 'Passwords do not match' })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid data for updating user',
      errors: error.details.map((d) => d.message)
    });
  }

  req.body = value;
  next();
};

exports.updateMePasswordValidator = async (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({ 'any.required': 'CurrentPassword is required' }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': 'Password is required'
    }),
    passwordConfirm: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({ 'any.only': 'Passwords do not match' })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid data for updating user',
      errors: error.details.map((d) => d.message)
    });
  }

  req.body = value;
  next();
};

exports.updateMeValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least {#limit} characters',
      'string.max': 'Name must be at most {#limit} characters'
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Email must be a valid email',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .messages({
        'string.pattern.base': 'Phone number must be 10–15 digits, optionally starting with +'
      }),
    profileImage: Joi.string().optional()
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid data for updating user',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};
