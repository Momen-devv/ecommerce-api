const Joi = require('joi');

exports.mongoIdValidator = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'ID must be a string',
        'string.empty': 'ID cannot be empty',
        'string.pattern.base': 'ID must be a valid MongoDB ObjectId',
        'any.required': 'ID is required'
      })
  });

  const { error } = schema.validate(req.params, { abortEarly: false });

  if (error) {
    const baseResponse = {
      status: 'fail',
      message: 'Invalid resource ID',
      errors: error.details.map((d) => d.message)
    };

    return res.status(400).json(baseResponse);
  }

  next();
};
