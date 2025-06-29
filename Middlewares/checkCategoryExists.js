const Category = require('../models/categoryModel');

module.exports = async (req, res, next) => {
  if (req.params.categoryId) req.body.category = req.params.categoryId;

  const categoryId = req.body.category;

  if (categoryId) {
    const exists = await Category.findById(categoryId);
    if (!exists) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid category ID: no category found'
      });
    }
  }
  next();
};
