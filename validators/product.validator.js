const Joi = require('joi');

exports.createProductValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(80).required().messages({
      'string.empty': 'Product title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 80 characters'
    }),
    description: Joi.string().min(10).required().messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters'
    }),
    quantity: Joi.number().integer().min(0).required().messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be 0 or more',
      'any.required': 'Quantity is required'
    }),
    price: Joi.number().min(0).max(500000).required().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'number.max': 'Price cannot exceed 500,000',
      'any.required': 'Price is required'
    }),
    priceAfterDiscount: Joi.number().less(Joi.ref('price')).messages({
      'number.less': 'Discounted price must be less than actual price'
    }),
    colors: Joi.array().items(Joi.string()),
    category: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid category ID',
        'any.required': 'Product must belong to a category'
      }),
    subcategories: Joi.array().items(
      Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          'string.pattern.base': 'Invalid subcategory ID'
        })
    ),
    brand: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid brand ID'
      }),
    ratingsAverage: Joi.number().min(1).max(5),
    ratingsQuantity: Joi.number().min(0)
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid product data',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  next();
};

exports.updateProductValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(80).optional().messages({
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 80 characters'
    }),
    description: Joi.string().min(10).optional().messages({
      'string.min': 'Description must be at least 10 characters'
    }),
    quantity: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be 0 or more'
    }),
    price: Joi.number().min(0).max(500000).optional().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'number.max': 'Price cannot exceed 500,000'
    }),
    priceAfterDiscount: Joi.number().less(Joi.ref('price')).messages({
      'number.less': 'Discounted price must be less than actual price'
    }),
    colors: Joi.array().items(Joi.string()),
    category: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid category ID'
      }),
    subcategories: Joi.array().items(
      Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          'string.pattern.base': 'Invalid subcategory ID'
        })
    ),
    brand: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid brand ID'
      }),
    ratingsAverage: Joi.number().min(1).max(5),
    ratingsQuantity: Joi.number().min(0)
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid data for updating product',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  next();
};
