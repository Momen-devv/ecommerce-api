const Joi = require('joi');

exports.createReviewValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).required().messages({
      'string.empty': 'Review title is required',
      'string.max': 'Title must not exceed 200 characters',
      'string.min': 'Title must be at least 1 characters'
    }),
    product: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid product ID'
      }),
    ratings: Joi.number().min(1).max(5).required().messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5',
      'number.empty': 'Review rating is required'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid review data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  next();
};

exports.updateReviewValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).optional().messages({
      'string.empty': 'Review title is required',
      'string.max': 'Title must not exceed 200 characters',
      'string.min': 'Title must be at least 1 character'
    }),
    ratings: Joi.number().min(1).max(5).optional().messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid review data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  next();
};
