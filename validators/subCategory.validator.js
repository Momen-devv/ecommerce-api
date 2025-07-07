const Joi = require('joi');
const slugify = require('slugify');

exports.createSubCategoryValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).required().messages({
      'string.base': 'Subcategory name must be a string',
      'string.empty': 'Subcategory name cannot be empty',
      'string.min': 'Subcategory name must be at least {#limit} characters',
      'string.max': 'Subcategory name must be at most {#limit} characters',
      'any.required': 'Subcategory name is required'
    }),
    category: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId',
        'string.base': 'Category ID must be a string',
        'string.empty': 'Category ID cannot be empty'
      })
  })
    .or('name', 'category')
    .messages({
      'object.missing': 'At least one of name or category must be provided'
    });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Validation failed for subcategory data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  req.body.slug = slugify(req.body.name);
  next();
};

exports.updateSubCategoryValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).messages({
      'string.base': 'Subcategory name must be a string',
      'string.empty': 'Subcategory name cannot be empty',
      'string.min': 'Subcategory name must be at least {#limit} characters',
      'string.max': 'Subcategory name must be at most {#limit} characters'
    }),
    category: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId',
        'string.base': 'Category ID must be a string',
        'string.empty': 'Category ID cannot be empty'
      })
  })
    .or('name', 'category')
    .messages({
      'object.missing': 'At least one of name or category must be provided'
    });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Validation failed for subcategory data',
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
