module.exports = (req, res, next) => {
  if (req.body.subcategories && !Array.isArray(req.body.subcategories)) {
    req.body.subcategories = [req.body.subcategories];
  }
  next();
};
