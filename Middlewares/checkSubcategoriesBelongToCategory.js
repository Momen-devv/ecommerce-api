const SubCategory = require('../models/subCategoryModel');

const checkSubcategoriesBelongToCategory = async (req, res, next) => {
  const { subcategories, category } = req.body;

  if (!Array.isArray(subcategories) || subcategories.length === 0 || !category) {
    return next();
  }

  const foundSubs = await SubCategory.find({ _id: { $in: subcategories } });

  const invalidSub = foundSubs.find((sub) => sub.category.toString() !== category);

  if (invalidSub) {
    return res.status(400).json({
      status: 'fail',
      message: 'One or more subcategories do not belong to the specified category'
    });
  }

  next();
};
module.exports = checkSubcategoriesBelongToCategory;
