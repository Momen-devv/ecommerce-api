const Joi = require('joi');
const AppError = require('../utils/appError');

// Middleware to validate creating an order
exports.createOrderValidator = (req, res, next) => {
  const schema = Joi.object({
    shippingAddress: Joi.object({
      location: Joi.string().min(3).max(200).messages({
        'string.base': 'Location must be a string.',
        'string.min': 'Location must be at least 3 characters long.',
        'string.max': 'Location cannot exceed 200 characters.'
      }),
      city: Joi.string().min(2).max(100).messages({
        'string.base': 'City must be a string.',
        'string.min': 'City must be at least 2 characters long.',
        'string.max': 'City cannot exceed 100 characters.'
      }),
      phone: Joi.string().min(6).max(20).messages({
        'string.base': 'Phone must be a string.',
        'string.min': 'Phone number must be at least 6 digits.',
        'string.max': 'Phone number cannot exceed 20 digits.'
      }),
      label: Joi.string().valid('home', 'work', 'other').messages({
        'any.only': 'Label must be one of: home, work, or other.'
      })
    }),

    addressIndex: Joi.number().min(0).messages({
      'number.base': 'Address index must be a number.',
      'number.min': 'Address index cannot be negative.'
    })
  })
    .or('shippingAddress', 'addressIndex')
    .messages({
      'object.missing': 'You must provide either a shipping address or an address index.'
    });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      new AppError(`Validation error: ${error.details.map((e) => e.message).join(', ')}`, 400)
    );
  }

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

  const { error } = schema.validate(req.body);

  if (error) return next(new AppError(error.details[0].message, 400));

  next();
};
