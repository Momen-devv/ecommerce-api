const Product = require('../models/productModel');
const factory = require('./handlerFactory');

exports.createProduct = factory.createOne(Product);

exports.getAllProducts = factory.getAll(Product, 'Products');

exports.getProduct = factory.getOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
