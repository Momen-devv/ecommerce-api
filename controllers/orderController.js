const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Email = require('../utils/email');

exports.createOrder = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('There is no cart for this user', 404));

  const user = await User.findById(req.user._id);

  let shippingAddress;

  if (req.body.shippingAddress) {
    // No saved address, use one provided in the request
    shippingAddress = req.body.shippingAddress;
  } else if (user.addresses.length > 0) {
    // Determine shipping address
    // User has saved addresses
    const index = Number(req.body.addressIndex);

    if (typeof index === 'number' && index >= 0 && index < user.addresses.length) {
      shippingAddress = user.addresses[index]; // Use selected address
    } else {
      shippingAddress = user.addresses[0]; // Default to the first address
    }
  } else {
    // No saved or provided address
    return next(
      new AppError('No shipping address provided. Please add an address to continue.', 400)
    );
  }

  let order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    paymentMethod: 'cash',
    isPaid: false,
    paidAt: null,
    status: 'pending',
    totalPrice: cart.totalPrice,
    totalPriceAfterDiscount: cart.totalPriceAfterDiscount || null,
    shippingPrice: cart.shippingPrice,
    taxRate: cart.taxRate,
    taxAmount: cart.taxAmount,
    finalTotal: cart.finalTotal
  });

  // Update product stock and sold count
  if (order) {
    const bulkUpdates = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: {
            sold: item.quantity,
            quantity: -item.quantity
          }
        }
      }
    }));

    await Product.bulkWrite(bulkUpdates);
  }

  try {
    order = await Order.findById(order._id).populate({
      path: 'cartItems.product',
      select: 'title '
    });

    const url = `${req.protocol}://${req.get('host')}/api/v1/orders/${order._id}`;
    await new Email(user, url, null, order).sendOrderEmail();
  } catch (err) {
    console.error('Error sending order email:', err);
  }

  // Delete cart after placing order
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (orders.length === 0) {
    return next(new AppError('There are no orders. Please place an order first.', 404));
  }

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

exports.getAllOrders = factory.getAll(Order);

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  if (req.body.status === 'paid' || req.body.isPaid === true) {
    req.body.paidAt = Date.now();
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      isPaid: req.body.isPaid,
      paidAt: req.body.paidAt,
      isDelivered: req.body.isDelivered
    },
    { new: true }
  );

  if (!order) return next(new AppError('there no such a order with this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.deleteOrder = factory.deleteOne(Order);

exports.getOrderById = catchAsync(async (req, res, next) => {
  let order;

  if (req.user.role === 'user') {
    // User can only access their own orders
    order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  } else {
    // Admin and Manger can access any order
    order = await Order.findById(req.params.id);
  }

  if (!order) {
    return next(new AppError('No order found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});
