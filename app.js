const path = require('path');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const mountRoutes = require('./routes');
const { webhookCheckout } = require('./controllers/orderController');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());

app.use(compression());

app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout);

mountRoutes(app);

app.get('/', (req, res) => {
  res.send('e-commerce api is live 🚀');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
