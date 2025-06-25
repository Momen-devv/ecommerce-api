const Category = require('../models/categoryModel');

module.exports = async (req, res, next) => {
  const categoryId = req.body.category;
  if (categoryId) {
    const exists = await Category.findById(categoryId);
    if (!exists) {
      return res.status(400).json({
        status: 'fail',
        message: 'Category not found for this subcategory'
      });
    }
  }
  next();
};
