const Product = require('../models/productModel');

const checkProductExists = async (req, res, next) => {
  if (req.body.product) {
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid product ID: product not found'
      });
    }
  }
  next();
};

module.exports = checkProductExists;
