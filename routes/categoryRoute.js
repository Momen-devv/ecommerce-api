const express = require("express");
const { mongoIdValidator } = require("../validators/commonValidators");
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require("../validators/category.validator");

const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(mongoIdValidator("CategoryId"), getCategory)
  .patch(updateCategoryValidator, updateCategory)
  .delete(mongoIdValidator("CategoryId"), deleteCategory);

module.exports = router;
