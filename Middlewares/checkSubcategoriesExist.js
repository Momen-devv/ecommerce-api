const SubCategory = require('../models/subCategoryModel');

const checkSubcategoriesExist = async (req, res, next) => {
  if (req.body.subcategories && req.body.subcategories.length > 0) {
    const foundSubs = await SubCategory.find({ _id: { $in: req.body.subcategories } });
    if (foundSubs.length !== req.body.subcategories.length) {
      return res.status(400).json({
        status: 'fail',
        message: 'One or more subcategories are invalid'
      });
    }
  }
  next();
};

module.exports = checkSubcategoriesExist;
