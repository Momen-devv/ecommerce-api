const stripe = require('stripe')(process.env.STRIPE_SECRET);
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

  let order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
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

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError('There is no cart with this ID', 404));

  if (!cart.user.equals(req.user._id)) {
    return next(new AppError('You are not allowed to pay for this cart', 403));
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: req.user.email,
    client_reference_id: cart._id.toString(),
    metadata: {
      userId: req.user._id.toString(),
      shippingAddress: JSON.stringify(req.body.shippingAddress)
    },
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: `cart ${cart._id}`
          },
          unit_amount: cart.finalTotal * 100
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/api/v1/orders/my-orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/v1/car/myCart`
  });

  res.status(200).json({
    status: 'success',
    session
  });
});

const createWebhookCheckout = async (session) => {
  const cartId = session.client_reference_id;

  const cart = await Cart.findById(cartId);

  const shippingAddress = JSON.parse(session.metadata.shippingAddress);
  const userId = session.metadata.userId;

  if (cart.user.equals(userId)) {
    const order = await Order.create({
      user: userId,
      cartItems: cart.cartItems,
      paymentMethod: 'card',
      isPaid: true,
      paidAt: Date.now(),
      status: 'paid',
      shippingAddress,
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
  }

  // Delete cart after placing order
  await Cart.findOneAndDelete({ user: userId });
};

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  let event = req.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  if (event.type === 'checkout.session.completed') createWebhookCheckout(event.data.object);

  res.status(200).json({ received: true });
});
