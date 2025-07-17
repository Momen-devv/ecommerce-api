const Joi = require('joi');

exports.validateUpdateSettings = (req, res, next) => {
  const schema = Joi.object({
    shippingPrice: Joi.number().optional().min(0).messages({
      'number.base': 'Shipping price must be a number.',
      'number.min': 'Shipping price cannot be negative.'
    }),

    freeShippingThreshold: Joi.number().optional().min(0).messages({
      'number.base': 'Free shipping threshold must be a number.',
      'number.min': 'Free shipping threshold cannot be negative.'
    }),

    taxRate: Joi.number().optional().min(0).max(100).messages({
      'number.base': 'Tax rate must be a number.',
      'number.min': 'Tax rate cannot be less than 0.',
      'number.max': 'Tax rate cannot be more than 100.'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.details[0].message
    });
  }

  next();
};
