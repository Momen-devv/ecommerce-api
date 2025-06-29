const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../../models/productModel');

mongoose.connect(process.env.DB_URL).then(() => console.log('DB connection successful!'));

const product = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
const imortData = async () => {
  try {
    await Product.create(product);
    console.log('done added');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('done');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  imortData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
