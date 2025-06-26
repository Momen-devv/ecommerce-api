const Joi = require('joi');
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';

exports.mongoIdValidator =
  (paramName = 'id') =>
  (req, res, next) => {
    const schema = Joi.object({
      [paramName]: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
    });

    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      const baseResponse = {
        status: 'fail',
        message: 'Invalid resource ID'
      };

      if (isDev) {
        baseResponse.details = error.details.map((d) => d.message);
      }

      return res.status(400).json(baseResponse);
    }

    next();
  };
