const Brand = require('../models/brandModel');

const checkBrandExists = async (req, res, next) => {
  if (req.body.brand) {
    const brand = await Brand.findById(req.body.brand);
    if (!brand) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid brand ID: brand not found'
      });
    }
  }
  next();
};

module.exports = checkBrandExists;
