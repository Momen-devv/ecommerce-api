const path = require('path');

const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');

const app = express();

// Middlewar
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/products', productRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
