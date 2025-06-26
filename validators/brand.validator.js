const Joi = require('joi');
const slugify = require('slugify');

const isDev = process.env.NODE_ENV === 'development';

exports.createBrandValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid brand data'
    };

    if (isDev) {
      baseResponse.details = error.details.map((d) => d.message);
    }

    return res.status(400).json(baseResponse);
  }

  req.body.slug = slugify(req.body.name);
  next();
};

exports.updateBrandValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24)
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid data for updating brand'
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
