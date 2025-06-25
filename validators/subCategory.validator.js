const Joi = require('joi');
const slugify = require('slugify');

const isDev = process.env.NODE_ENV === 'development';

exports.createSubCategoryValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).required(),
    category: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
  }).or('name', 'category');

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Validation failed for subcategory data'
    };

    if (isDev) {
      baseResponse.details = error.details.map((d) => d.message);
    }

    return res.status(400).json(baseResponse);
  }

  req.body.slug = slugify(req.body.name);
  next();
};

exports.updateSubCategoryValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24)
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Validation failed for subcategory data'
    };

    if (isDev) {
      baseResponse.details = error.details.map((d) => d.message);
    }

    return res.status(400).json(baseResponse);
  }

  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  next();
};
