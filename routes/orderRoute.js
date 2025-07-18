const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');
const {
  createOrderValidator,
  updateOrderStatusValidator,
  checkoutValidation
} = require('../validators/order.validator');

const { validateShippingAddress } = require('../Middlewares/validateShippingAddress');

const authController = require('../controllers/authController');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  getCheckoutSession
} = require('../controllers/orderController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.get(
  '/create-checkout-session/:id',
  authController.restricTo('user'),
  checkoutValidation,
  validateShippingAddress,
  getCheckoutSession
);

// Create order
router.post(
  '/',
  authController.restricTo('user'),
  createOrderValidator,
  validateShippingAddress,
  createOrder
);

// User: Get their own orders
router.get('/my-orders', authController.restricTo('user'), getUserOrders);

// Admin: Get all orders
router.get('/', authController.restricTo('admin', 'manger'), getAllOrders);

// Get single order (admin or the owner)
router.get(
  '/:id',
  mongoIdValidator,
  authController.restricTo('admin', 'manger', 'user'),
  getOrderById
);

// Update status
router.patch(
  '/:id',
  authController.restricTo('admin', 'manger'),
  mongoIdValidator,
  updateOrderStatusValidator,
  updateOrderStatus
);

// Delete order
router.delete('/:id', authController.restricTo('admin'), mongoIdValidator, deleteOrder);

module.exports = router;
