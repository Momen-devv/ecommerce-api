const Joi = require('joi');

exports.createCategoryValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).required().messages({
      'string.base': 'Category name must be a string',
      'string.empty': 'Category name cannot be empty',
      'string.min': 'Category name must be at least {#limit} characters',
      'string.max': 'Category name must be at most {#limit} characters',
      'any.required': 'Category name is required'
    }),
    image: Joi.string().optional().messages({
      'string.base': 'Image must be a string',
      'string.empty': 'Image cannot be empty'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid category data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};

exports.updateCategoryValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).messages({
      'string.base': 'Category name must be a string',
      'string.empty': 'Category name cannot be empty',
      'string.min': 'Category name must be at least {#limit} characters',
      'string.max': 'Category name must be at most {#limit} characters'
    }),
    image: Joi.string().optional().messages({
      'string.base': 'Image must be a string',
      'string.empty': 'Image cannot be empty'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid data for updating category',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};
