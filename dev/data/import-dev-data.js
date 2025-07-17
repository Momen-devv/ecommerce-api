const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../../models/productModel');
const Category = require('../../models/categoryModel');
const Subcategory = require('../../models/subCategoryModel');
const Brand = require('../../models/brandModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');
const Settings = require('../../models/settingsModel');
const Coupon = require('../../models/couponModel');

mongoose.connect(process.env.DB_URL).then(() => console.log('✅ DB connection successful!'));

// Read JSON files
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));
const subcategories = JSON.parse(fs.readFileSync(`${__dirname}/subcategories.json`, 'utf-8'));
const brands = JSON.parse(fs.readFileSync(`${__dirname}/brands.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/fakeUsers.json`, 'utf-8'));
const settings = JSON.parse(fs.readFileSync(`${__dirname}/settings.json`, 'utf-8'));
const coupons = JSON.parse(fs.readFileSync(`${__dirname}/coupons.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
  try {
    await Category.create(categories);
    await Subcategory.create(subcategories);
    await Brand.create(brands);
    await Product.create(products);
    await Review.create(reviews);
    await User.insertMany(users);
    await Settings.create(settings);
    await Coupon.create(coupons);
    console.log('✅ Data successfully imported!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await Subcategory.deleteMany();
    await Brand.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    await Settings.deleteMany();
    await Coupon.deleteMany();
    console.log('🗑️ All data deleted!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// Run command
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
