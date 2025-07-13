const Joi = require('joi');

exports.createCouponValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().uppercase().required().messages({
      'string.empty': 'Coupon name is required'
    }),
    discount: Joi.number().min(0).max(100).required().messages({
      'number.base': 'Coupon name is required',
      'number.min': 'Discount must be at least 0',
      'number.max': 'Discount cannot exceed 100'
    }),
    expire: Joi.date().required().messages({
      'date.base': 'Coupon expiration date must be a valid date',
      'string.empty': 'Coupon expiration date is required'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid coupon data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};

exports.updateCouponValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().uppercase().optional().messages({
      'string.empty': 'Coupon name is required'
    }),
    discount: Joi.number().min(0).max(100).optional().messages({
      'number.base': 'Discount must be a number',
      'number.min': 'Discount must be at least 0',
      'number.max': 'Discount cannot exceed 100'
    }),
    expire: Joi.date().optional().messages({
      'date.base': 'Coupon expiration date must be a valid date'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid coupon data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};
