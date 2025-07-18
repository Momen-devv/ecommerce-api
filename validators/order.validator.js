const Joi = require('joi');

// Middleware to validate creating an order
exports.createOrderValidator = (req, res, next) => {
  const schema = Joi.object({
    shippingAddress: Joi.object({
      location: Joi.string().required().messages({
        'string.base': 'Location must be a string',
        'string.empty': 'Location is required',
        'any.required': 'Location is required'
      }),
      city: Joi.string().required().messages({
        'string.base': 'City must be a string',
        'string.empty': 'City is required',
        'any.required': 'City is required'
      }),
      phone: Joi.string()
        .pattern(/^\+?[0-9]{10,15}$/)
        .required()
        .messages({
          'string.base': 'Phone must be a string',
          'string.empty': 'Phone is required',
          'any.required': 'Phone is required',
          'string.pattern.base': 'Phone number must be 10–15 digits, optionally starting with +'
        }),
      label: Joi.string().valid('home', 'work', 'other').default('home').messages({
        'any.only': 'Label must be either "home", "work", or "other".',
        'string.base': 'Label must be a string.'
      })
    }).optional(),

    addressIndex: Joi.number().min(0).optional().messages({
      'number.base': 'Address index must be a number',
      'number.min': 'Address index must be 0 or greater'
    })
  })
    .or('shippingAddress', 'addressIndex')
    .messages({
      'object.missing': 'You must provide either a shipping address or an address index.'
    });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid address data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};

// Middleware to validate updating order status (admin only)
exports.updateOrderStatusValidator = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'paid', 'shipped', 'delivered', 'canceled').messages({
      'any.only': 'Status must be one of: pending, paid, shipped, delivered, canceled.'
    }),
    isPaid: Joi.boolean().messages({
      'boolean.base': 'isPaid must be true or false.'
    }),
    isDelivered: Joi.boolean().messages({
      'boolean.base': 'isDelivered must be true or false.'
    }),
    paidAt: Joi.date().iso().messages({
      'date.base': 'paidAt must be a valid date.',
      'date.format': 'paidAt must be in ISO format (e.g., 2023-05-01T00:00:00.000Z).'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid address data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};

exports.checkoutValidation = (req, res, next) => {
  const schema = Joi.object({
    shippingAddress: Joi.object({
      location: Joi.string().required().messages({
        'string.base': 'Location must be a string',
        'string.empty': 'Location is required',
        'any.required': 'Location is required'
      }),
      city: Joi.string().required().messages({
        'string.base': 'City must be a string',
        'string.empty': 'City is required',
        'any.required': 'City is required'
      }),
      phone: Joi.string()
        .pattern(/^\+?[0-9]{10,15}$/)
        .required()
        .messages({
          'string.base': 'Phone must be a string',
          'string.empty': 'Phone is required',
          'any.required': 'Phone is required',
          'string.pattern.base': 'Phone number must be 10–15 digits, optionally starting with +'
        }),
      label: Joi.string().valid('home', 'work', 'other').default('home').messages({
        'any.only': 'Label must be either "home", "work", or "other".',
        'string.base': 'Label must be a string.'
      })
    }).optional(),

    addressIndex: Joi.number().min(0).optional().messages({
      'number.base': 'Address index must be a number',
      'number.min': 'Address index must be 0 or greater'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid address data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  req.body = value;
  next();
};
