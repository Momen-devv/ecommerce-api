const Joi = require('joi');
const slugify = require('slugify');

exports.createBrandValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).required().messages({
      'string.base': 'Brand name must be a string',
      'string.empty': 'Brand name cannot be empty',
      'string.min': 'Brand name must be at least {#limit} characters',
      'string.max': 'Brand name must be at most {#limit} characters',
      'any.required': 'Brand name is required'
    }),
    image: Joi.string().required().messages({
      'string.base': 'Image must be a string',
      'string.empty': 'Image cannot be empty',
      'any.required': 'Image is required'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid brand data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  req.body.slug = slugify(req.body.name);
  next();
};

exports.updateBrandValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).messages({
      'string.base': 'Brand name must be a string',
      'string.empty': 'Brand name cannot be empty',
      'string.min': 'Brand name must be at least {#limit} characters',
      'string.max': 'Brand name must be at most {#limit} characters'
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
      message: 'Invalid data for updating brand',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;

  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  next();
};
