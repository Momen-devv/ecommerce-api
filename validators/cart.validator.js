const Joi = require('joi');

exports.addItemToCartValidator = (req, res, next) => {
  const schema = Joi.object({
    product: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.empty': 'product id is required.',
        'string.pattern.base': 'Invalid product ID.'
      }),
    quantity: Joi.number().min(0).required().messages({
      'any.required': 'Quantity is required',
      'number.min': 'Quantity must be at least 0'
    }),
    color: Joi.string().required().messages({
      'string.empty': 'Color is required.'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid coupon name',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};

exports.applyCouponValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().uppercase().required().messages({
      'string.empty': 'Coupon name is required to apply.'
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

exports.updateCartItemQuantityValidator = (req, res, next) => {
  const schema = Joi.object({
    quantity: Joi.number().min(0).required().messages({
      'any.required': 'Quantity is required',
      'number.min': 'Quantity must be at least 0'
    }),
    color: Joi.string().optional().messages({
      'string.empty': 'Color is required.'
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
