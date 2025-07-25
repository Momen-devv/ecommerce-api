const categoryRoute = require('./categoryRoute');
const subCategoryRoute = require('./subCategoryRoute');
const brandRouter = require('./brandRoute');
const productRoute = require('./productRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const reviewRoute = require('./reviewRoute');
const wishlistRoute = require('./wishlistRoute');
const addressRoute = require('./addressRoute');
const couponRoute = require('./couponRouter');
const cartRouter = require('./cartRouter');
const orderRouter = require('./orderRoute');
const settingsRoute = require('./settingsRoute');

const mountRoutes = (app) => {
  app.use('/api/v1/categories', categoryRoute);
  app.use('/api/v1/subcategories', subCategoryRoute);
  app.use('/api/v1/brands', brandRouter);
  app.use('/api/v1/products', productRoute);
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/reviews', reviewRoute);
  app.use('/api/v1/wishlist', wishlistRoute);
  app.use('/api/v1/addresses', addressRoute);
  app.use('/api/v1/coupons', couponRoute);
  app.use('/api/v1/cart', cartRouter);
  app.use('/api/v1/orders', orderRouter);
  app.use('/api/v1/settings', settingsRoute);
};

module.exports = mountRoutes;
