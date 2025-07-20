const path = require('path');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');

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

// Set security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());

app.use(compression());

// To remove data using these defaults:
app.use(mongoSanitize());
app.use(xss());

// Apply the rate limiting middleware to all requests.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api', limiter);

app.use(hpp());

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
