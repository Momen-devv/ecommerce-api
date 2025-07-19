const Product = require('../models/productModel');
const SubCategory = require('../models/subCategoryModel');

const checkSubcategoriesBelongToCategory = async (req, res, next) => {
  const { subcategories, category } = req.body;

  // Skip if subcategories is not provided or not an array or is empty
  if (!Array.isArray(subcategories) || subcategories.length === 0) return next();

  let actualCategoryId = category;

  // If category is not provided in the request, fetch it from the existing product
  if (!category) {
    const product = await Product.findById(req.params.id).select('category');

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }

    actualCategoryId = product.category._id.toString();
  }

  // Fetch the provided subcategories from DB
  const foundSubs = await SubCategory.find({ _id: { $in: subcategories } });

  // Check if all provided subcategories actually exist
  if (foundSubs.length !== subcategories.length) {
    return res.status(400).json({
      status: 'fail',
      message: 'One or more subcategories not found'
    });
  }

  // Ensure all subcategories belong to the specified (or existing) category
  const invalidSub = foundSubs.find((sub) => sub.category.toString() !== actualCategoryId);

  if (invalidSub) {
    return res.status(400).json({
      status: 'fail',
      message: 'One or more subcategories do not belong to the specified category'
    });
  }

  // All checks passed, proceed to the next middleware
  next();
};

module.exports = checkSubcategoriesBelongToCategory;
